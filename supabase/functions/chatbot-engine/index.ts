
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

// Função para integração com OpenAI
async function analyzeWithAI(userMessage: string, context: Record<string, any>) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    console.log('OpenAI API key not configured, skipping AI analysis');
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente de análise de intenções para chatbot. Analise a mensagem do usuário e retorne um JSON com:
            {
              "intent": "product_inquiry|support_request|complaint|greeting|other",
              "confidence": 0.9,
              "extracted_info": {
                "product_mentioned": "nome do produto se mencionado",
                "urgency_level": "low|medium|high",
                "emotion": "positive|neutral|negative"
              },
              "suggested_response": "resposta sugerida personalizada"
            }
            
            Contexto atual: ${JSON.stringify(context)}`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Erro na análise de IA:', error);
    return null;
  }
}

// Função para consultar banco de dados externo (produtos/serviços)
async function queryExternalDB(query: string, type: 'product' | 'service' = 'product') {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Simular consulta em tabela de produtos (você pode ajustar conforme sua estrutura)
    const { data, error } = await supabase
      .from('produtos') // Assumindo que existe uma tabela produtos
      .select('*')
      .ilike('nome', `%${query}%`)
      .limit(5);

    if (error) {
      console.error('Erro na consulta DB:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro na consulta externa:', error);
    return [];
  }
}

// Função para integrações externas (CRM, notificações)
async function triggerExternalIntegration(type: 'crm' | 'notification', data: Record<string, any>) {
  try {
    const webhookUrl = Deno.env.get(`${type.toUpperCase()}_WEBHOOK_URL`);
    
    if (!webhookUrl) {
      console.log(`${type} webhook not configured`);
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type,
        data: data,
        timestamp: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error(`Erro na integração ${type}:`, error);
    return false;
  }
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

    // Análise com IA (se configurada)
    const aiAnalysis = await analyzeWithAI(message.text.message, context)
    if (aiAnalysis) {
      console.log('Análise de IA:', aiAnalysis)
      
      // Armazenar insights da IA no contexto
      context.ai_insights = aiAnalysis
      
      // Se a IA detectar alta urgência, transferir imediatamente
      if (aiAnalysis.extracted_info?.urgency_level === 'high') {
        shouldTransferToHuman = true
        context.transfer_reason = 'Alta urgência detectada pela IA'
      }
    }

    // Roteador Principal baseado no current_stage
    switch (currentState.current_stage) {
      case 'start':
        // Usar resposta da IA se disponível
        if (aiAnalysis?.suggested_response && aiAnalysis.confidence > 0.7) {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: aiAnalysis.suggested_response
            }
          })
        } else {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: `Olá ${userName}! 👋\n\nSou o assistente virtual da nossa empresa. Como posso ajudá-lo hoje?\n\n1️⃣ Informações sobre produtos\n2️⃣ Suporte técnico\n3️⃣ Falar com atendente\n4️⃣ Horário de funcionamento\n\nDigite o número da opção desejada:`
            }
          })
        }
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
          // Tentar interpretar com IA
          if (aiAnalysis?.intent === 'product_inquiry') {
            nextStage = 'collecting_name_products'
            responseMessages.push({
              type: 'text',
              phone: telefone,
              data: {
                message: '📋 Entendi que você tem interesse em nossos produtos! Qual é o seu nome completo?'
              }
            })
          } else if (aiAnalysis?.intent === 'support_request') {
            nextStage = 'collecting_name_support'
            responseMessages.push({
              type: 'text',
              phone: telefone,
              data: {
                message: '🛠️ Vou ajudá-lo com o suporte. Primeiro, qual é o seu nome completo?'
              }
            })
          } else {
            responseMessages.push({
              type: 'text',
              phone: telefone,
              data: {
                message: '❌ Opção inválida. Por favor, digite apenas o número da opção desejada:\n\n1️⃣ Informações sobre produtos\n2️⃣ Suporte técnico\n3️⃣ Falar com atendente\n4️⃣ Horário de funcionamento'
              }
            })
          }
        }
        break

      case 'collecting_name_products':
        context.name = userMessage
        
        // Consultar produtos relacionados se o usuário mencionou algo específico
        const productQuery = aiAnalysis?.extracted_info?.product_mentioned || userMessage
        const products = await queryExternalDB(productQuery, 'product')
        
        if (products.length > 0) {
          const productList = products.map((p: any) => `• ${p.nome} - ${p.preco || 'Consulte'}`).join('\n')
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: `Prazer em conhecê-lo, ${userMessage}! 😊\n\nEncontrei alguns produtos que podem interessar:\n\n${productList}\n\n💬 Gostaria de saber mais sobre algum produto específico?`
            }
          })
        } else {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: `Prazer em conhecê-lo, ${userMessage}! 😊\n\nAgora me conte, qual tipo de produto você tem interesse?\n\n🔍 Digite sua dúvida ou interesse específico:`
            }
          })
        }
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
        
        // Integração com CRM
        await triggerExternalIntegration('crm', {
          phone: telefone,
          name: context.name,
          interest: userMessage,
          stage: 'product_inquiry'
        })
        
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
        
        // Notificar equipe de suporte
        await triggerExternalIntegration('notification', {
          type: 'support_request',
          phone: telefone,
          name: context.name,
          issue: userMessage,
          urgency: aiAnalysis?.extracted_info?.urgency_level || 'medium'
        })
        
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
        // Fallback - usar IA para tentar entender
        if (aiAnalysis?.suggested_response) {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: aiAnalysis.suggested_response
            }
          })
        } else {
          responseMessages.push({
            type: 'text',
            phone: telefone,
            data: {
              message: '🤔 Parece que algo deu errado. Vou conectá-lo com um atendente para melhor ajudá-lo.'
            }
          })
          shouldTransferToHuman = true
          context.transfer_reason = 'Erro no fluxo do chatbot'
        }
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
            message: `[TRANSFERÊNCIA DO CHATBOT]\n\nCliente: ${context.name || userName}\nTelefone: ${telefone}\nMotivo: ${context.transfer_reason}\nDepartamento: ${context.department || 'Geral'}\n\nContexto da conversa:\n${JSON.stringify(context, null, 2)}\n\nAnálise de IA: ${JSON.stringify(aiAnalysis, null, 2)}`
          },
          timestamp: Date.now(),
          fromMe: false,
          senderName: userName,
          pushName: userName,
          chatbotContext: context,
          aiInsights: aiAnalysis
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
      responses_sent: responseMessages.length,
      ai_analysis: aiAnalysis
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
