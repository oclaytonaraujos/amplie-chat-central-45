
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createLogger } from '../_shared/logger.ts'
import { validateWebhookPayload, sanitizePhone } from '../_shared/validation.ts'
import { MessageQueue } from '../_shared/queue.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Generate correlation ID for request tracking
  const correlationId = crypto.randomUUID();
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const logger = createLogger(supabase, correlationId, 'chatbot-router');

  try {
    await logger.info('Router received request', undefined, undefined, { 
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Parse and validate request body
    let payload;
    try {
      payload = await req.json();
    } catch (error) {
      await logger.error('Invalid JSON payload', undefined, undefined, { error: error.message });
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON payload',
        correlationId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Validate webhook payload structure
    const validation = validateWebhookPayload(payload);
    if (!validation.success) {
      await logger.error('Invalid webhook payload', undefined, undefined, { 
        errors: validation.errors,
        payload 
      });
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid webhook payload',
        details: validation.errors,
        correlationId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const validatedPayload = validation.data!;
    const message = validatedPayload.data;
    const telefone = sanitizePhone(message.from);

    await logger.info('Processing webhook payload', telefone, undefined, { 
      event: validatedPayload.event,
      messageId: message.messageId 
    });

    // Ignore messages sent by the bot itself
    if (validatedPayload.event !== 'message-received' || message.fromMe) {
      await logger.debug('Message ignored', telefone, undefined, { 
        event: validatedPayload.event,
        fromMe: message.fromMe 
      });
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Message ignored',
        correlationId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Check if chatbot state exists for this contact
    const { data: chatbotState, error: stateError } = await supabase
      .from('chatbot_state')
      .select('*')
      .eq('contact_phone', telefone)
      .single();

    await logger.debug('Chatbot state lookup', telefone, chatbotState?.current_stage, { 
      stateExists: !!chatbotState,
      error: stateError?.message 
    });

    // Determine routing strategy
    let shouldUseChatbot = false;
    let routingReason = '';

    if (stateError && stateError.code === 'PGRST116') {
      // No state exists - new conversation
      shouldUseChatbot = true;
      routingReason = 'New conversation - routing to chatbot';
    } else if (chatbotState) {
      // Active state exists - continue with chatbot
      shouldUseChatbot = true;
      routingReason = 'Active chatbot state found - continuing with chatbot';
    } else {
      // Error in query or conversation transferred to human
      shouldUseChatbot = false;
      routingReason = 'No active chatbot state or error - routing to human';
    }

    await logger.info('Routing decision made', telefone, chatbotState?.current_stage, { 
      shouldUseChatbot,
      routingReason 
    });

    if (shouldUseChatbot) {
      // Enqueue message for chatbot processing
      const messageQueue = new MessageQueue(supabase, logger);
      const queueMessageId = await messageQueue.enqueue({
        correlationId,
        messageType: 'chatbot_message',
        payload: {
          message: validatedPayload.data,
          currentState: chatbotState
        },
        priority: 1,
        metadata: {
          routingReason,
          telefone,
          messageId: message.messageId
        }
      });

      if (!queueMessageId) {
        await logger.error('Failed to enqueue message', telefone, chatbotState?.current_stage);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to enqueue message for processing',
          correlationId 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }

      await logger.info('Message enqueued for chatbot processing', telefone, chatbotState?.current_stage, { 
        queueMessageId 
      });

      // Trigger queue processor immediately for faster response
      try {
        fetch(`${supabaseUrl}/functions/v1/chatbot-queue-processor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'X-Correlation-ID': correlationId
          },
          body: JSON.stringify({ trigger: 'router' })
        }).catch(() => {
          // Ignore errors from queue processor trigger - it will be picked up by scheduled runs
        });
      } catch (error) {
        // Ignore trigger errors - queue processor will handle messages on its next run
        await logger.debug('Queue processor trigger failed, will be handled by scheduler', telefone, undefined, {
          error: error.message
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Message enqueued for chatbot processing',
        correlationId,
        queueMessageId,
        status: 'queued'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 202, // Accepted for processing
      });
    } else {
      // Route directly to human support
      await logger.info('Routing to human support', telefone, undefined, { routingReason });
      
      const humanResponse = await fetch(`${supabaseUrl}/functions/v1/whatsapp-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'X-Correlation-ID': correlationId
        },
        body: JSON.stringify(validatedPayload)
      });

      const humanResult = await humanResponse.json();
      
      await logger.info('Human support response', telefone, undefined, { 
        success: humanResponse.ok,
        result: humanResult 
      });

      return new Response(JSON.stringify({
        success: true,
        message: 'Routed to human support',
        correlationId,
        result: humanResult,
        status: 'human_support'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

  } catch (error) {
    await logger.error('Unexpected error in router', undefined, undefined, { 
      error: error.message,
      stack: error.stack 
    });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error',
      correlationId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
