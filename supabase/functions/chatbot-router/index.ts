
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  messageId: string;
  from: string;
  to: string;
  text: {
    message: string;
  };
  timestamp: number;
  fromMe: boolean;
  senderName: string;
  pushName: string;
}

interface WebhookPayload {
  event: string;
  instanceId: string;
  data: WhatsAppMessage;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload: WebhookPayload = await req.json()
    console.log('Router recebeu mensagem:', JSON.stringify(payload, null, 2))

    // Ignorar mensagens enviadas pelo próprio bot
    if (payload.event !== 'message-received' || payload.data.fromMe) {
      console.log('Mensagem ignorada - evento:', payload.event, 'fromMe:', payload.data.fromMe)
      return new Response(JSON.stringify({ success: true, message: 'Mensagem ignorada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const message = payload.data
    const telefone = message.from.replace(/\D/g, '')

    // Verificar se existe estado do chatbot para este contato
    const { data: chatbotState, error: stateError } = await supabase
      .from('chatbot_state')
      .select('*')
      .eq('contact_phone', telefone)
      .single()

    console.log('Estado do chatbot:', chatbotState)

    // Decidir roteamento baseado no estado
    let shouldUseChatbot = false

    if (stateError && stateError.code === 'PGRST116') {
      // Não existe estado - nova conversa
      // Verificar se deve iniciar com chatbot (pode ser configurável por empresa)
      shouldUseChatbot = true
      console.log('Nova conversa - direcionando para chatbot')
    } else if (chatbotState) {
      // Existe estado ativo - continuar com chatbot
      shouldUseChatbot = true
      console.log('Estado ativo encontrado - continuando com chatbot')
    } else {
      // Erro na consulta ou conversa já transferida para humano
      shouldUseChatbot = false
      console.log('Direcionando para atendimento humano')
    }

    if (shouldUseChatbot) {
      // Direcionar para o Motor do Chatbot
      console.log('Chamando motor do chatbot...')
      const chatbotResponse = await fetch(`${supabaseUrl}/functions/v1/chatbot-engine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          message: payload.data,
          currentState: chatbotState
        })
      })

      const chatbotResult = await chatbotResponse.json()
      console.log('Resposta do motor do chatbot:', chatbotResult)

      return new Response(JSON.stringify({
        success: true,
        message: 'Processado pelo chatbot',
        result: chatbotResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      // Direcionar para atendimento humano (webhook do Amplie Chat)
      console.log('Direcionando para atendimento humano...')
      const humanResponse = await fetch(`${supabaseUrl}/functions/v1/whatsapp-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify(payload)
      })

      const humanResult = await humanResponse.json()
      console.log('Resposta do atendimento humano:', humanResult)

      return new Response(JSON.stringify({
        success: true,
        message: 'Direcionado para atendimento humano',
        result: humanResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

  } catch (error) {
    console.error('Erro no router:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
