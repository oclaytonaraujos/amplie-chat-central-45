
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatbotState {
  id: string;
  contact_phone: string;
  current_stage: string;
  context: Record<string, any>;
  updated_at: string;
}

interface ChatbotEnginePayload {
  message: {
    messageId: string;
    from: string;
    to: string;
    text: {
      message: string;
    };
    timestamp: number;
    senderName: string;
    pushName: string;
  };
  currentState?: ChatbotState;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload: ChatbotEnginePayload = await req.json()
    console.log('Motor do chatbot processando:', JSON.stringify(payload, null, 2))

    const message = payload.message
    const telefone = message.from.replace(/\D/g, '')
    const userMessage = message.text.message.toLowerCase().trim()
    const userName = message.senderName || message.pushName || 'Cliente'

    // Obter ou criar estado do chatbot
    let currentState = payload.currentState
    if (!currentState) {
      // Criar novo estado
      const { data: newState, error: createError } = await supabase
        .from('chatbot_state')
        .insert({
          contact_phone: telefone,
          current_stage: 'start',
          context: { name: userName, phone: telefone }
        })
        .select()
        .single()

      if (createError) {
        throw createError
      }
      currentState = newState
    }

    const context = currentState.context || {}
    let nextStage = currentState.current_stage
    let responseMessages: any[] = []
    let shouldTransferToHuman = false

    // Roteador Principal baseado no current_stage
    switch (currentState.current_stage) {
      case 'start':
        responseMessages.push({
          type: 'text',
          phone: telefone,
          data: {
            message: `Olá ${userName}! 👋\n\nSou o assistente virtual da nossa empresa. Como posso ajudá-lo hoje?\n\n1️⃣ Informações sobre produtos\n2️⃣ Suporte técnico\n3️⃣ Falar com atendente\n4️⃣ Horário de funcionamento\n\nDigite o número da opção desejada:`
          }
        })
        nextStage = 'awaiting_option'
        break

      case 'awaiting_option':
        if (userMessage === '1') {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '📋 Ótimo! Temos diversos produtos disponíveis.\n\nPoderia me informar seu nome completo para um atendimento mais personalizado?'
            }
          })
          nextStage = 'collecting_name_products'
        } else if (userMessage === '2') {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '🛠️ Entendi que você precisa de suporte técnico.\n\nPara melhor ajudá-lo, preciso de algumas informações. Qual é o seu nome completo?'
            }
          })
          nextStage = 'collecting_name_support'
        } else if (userMessage === '3') {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '👨‍💼 Perfeito! Vou conectá-lo com um de nossos atendentes.\n\nPor favor, aguarde um momento...'
            }
          })
          shouldTransferToHuman = true
          context.transfer_reason = 'Solicitação direta do cliente'
        } else if (userMessage === '4') {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '🕐 Nosso horário de funcionamento:\n\n📅 Segunda a Sexta: 8h às 18h\n📅 Sábado: 8h às 12h\n📅 Domingo: Fechado\n\nPosso ajudá-lo com mais alguma coisa?\n\n1️⃣ Voltar ao menu principal\n2️⃣ Falar com atendente'
            }
          })
          nextStage = 'after_hours_info'
        } else {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '❌ Opção inválida. Por favor, digite apenas o número da opção desejada:\n\n1️⃣ Informações sobre produtos\n2️⃣ Suporte técnico\n3️⃣ Falar com atendente\n4️⃣ Horário de funcionamento'
            }
          })
          // Manter no mesmo estágio
        }
        break

      case 'collecting_name_products':
        context.name = userMessage
        responseMessages.push({
          type: 'text',
          phone: telefone,
          data: {
            message: `Prazer em conhecê-lo, ${userMessage}! 😊\n\nAgora me conte, qual tipo de produto você tem interesse?\n\n🔍 Digite sua dúvida ou interesse específico:`
          }
        })
        nextStage = 'collecting_product_interest'
        break

      case 'collecting_name_support':
        context.name = userMessage
        responseMessages.push({
          type: 'text',
          phone: telefone,
          data: {
            message: `Olá ${userMessage}! 👋\n\nPara oferecer o melhor suporte, preciso entender melhor sua situação.\n\n📝 Descreva brevemente o problema que está enfrentando:`
          }
        })
        nextStage = 'collecting_support_issue'
        break

      case 'collecting_product_interest':
        context.product_interest = userMessage
        responseMessages.push({
          type: 'text',
          phone: telefone,
          data: {
            message: `Entendi seu interesse em "${userMessage}". 📋\n\nVou conectá-lo com nosso especialista em produtos para que ele possa fornecer informações detalhadas e personalizadas.\n\nAguarde um momento, por favor...`
          }
        })
        shouldTransferToHuman = true
        context.transfer_reason = 'Interesse em produtos'
        context.department = 'Vendas'
        break

      case 'collecting_support_issue':
        context.support_issue = userMessage
        responseMessages.push({
          type: 'text',
          phone: telefone,
          data: {
            message: `Obrigado pelas informações, ${context.name}. 🛠️\n\nVou transferir você para nossa equipe de suporte técnico especializada.\n\nEles terão acesso ao seu problema: "${userMessage}"\n\nAguarde um momento...`
          }
        })
        shouldTransferToHuman = true
        context.transfer_reason = 'Suporte técnico'
        context.department = 'Suporte'
        break

      case 'after_hours_info':
        if (userMessage === '1') {
          nextStage = 'start'
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: `Como posso ajudá-lo hoje?\n\n1️⃣ Informações sobre produtos\n2️⃣ Suporte técnico\n3️⃣ Falar com atendente\n4️⃣ Horário de funcionamento\n\nDigite o número da opção desejada:`
            }
          })
        } else if (userMessage === '2') {
          shouldTransferToHuman = true
          context.transfer_reason = 'Solicitação após informações de horário'
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '👨‍💼 Vou conectá-lo com um atendente. Aguarde um momento...'
            }
          })
        } else {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '❌ Opção inválida. Digite:\n\n1️⃣ Voltar ao menu principal\n2️⃣ Falar com atendente'
            }
          })
        }
        break

      default:
        // Fallback para estágios não reconhecidos
        responseMessages.push({
          type: 'text',
          phone: telefone,
          data: {
            message: '🤔 Parece que algo deu errado. Vou conectá-lo com um atendente para melhor ajudá-lo.'
          }
        })
        shouldTransferToHuman = true
        context.transfer_reason = 'Erro no fluxo do chatbot'
        break
    }

    // Enviar mensagens de resposta
    for (const responseMessage of responseMessages) {
      console.log('Enviando mensagem:', responseMessage)
      const sendResponse = await fetch(`${supabaseUrl}/functions/v1/chatbot-sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify(responseMessage)
      })

      if (!sendResponse.ok) {
        console.error('Erro ao enviar mensagem:', await sendResponse.text())
      }
    }

    if (shouldTransferToHuman) {
      // Transferir para atendimento humano
      console.log('Transferindo para atendimento humano...')
      
      // Chamar webhook do Amplie Chat com contexto
      const transferPayload = {
        event: 'chatbot-transfer',
        instanceId: 'chatbot',
        data: {
          messageId: message.messageId,
          from: message.from,
          to: message.to,
          text: {
            message: `[TRANSFERÊNCIA DO CHATBOT]\n\nCliente: ${context.name || userName}\nTelefone: ${telefone}\nMotivo: ${context.transfer_reason}\nDepartamento: ${context.department || 'Geral'}\n\nContexto da conversa:\n${JSON.stringify(context, null, 2)}`
          },
          timestamp: Date.now(),
          fromMe: false,
          senderName: userName,
          pushName: userName,
          chatbotContext: context
        }
      }

      const humanResponse = await fetch(`${supabaseUrl}/functions/v1/whatsapp-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify(transferPayload)
      })

      // Remover estado do chatbot após transferência
      await supabase
        .from('chatbot_state')
        .delete()
        .eq('contact_phone', telefone)

      console.log('Cliente transferido para atendimento humano')
    } else {
      // Atualizar estado do chatbot
      await supabase
        .from('chatbot_state')
        .update({
          current_stage: nextStage,
          context: context
        })
        .eq('contact_phone', telefone)

      console.log('Estado do chatbot atualizado:', { stage: nextStage, context })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Processamento concluído',
      stage: nextStage,
      context: context,
      transferred: shouldTransferToHuman,
      responses_sent: responseMessages.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Erro no motor do chatbot:', error)
    
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
