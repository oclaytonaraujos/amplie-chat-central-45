
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendMessagePayload {
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'button' | 'list';
  phone: string;
  data: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: SendMessagePayload = await req.json()
    console.log('Chatbot Sender recebeu:', JSON.stringify(payload, null, 2))

    // Aqui você configuraria a URL da sua Z-API
    // Por enquanto, vamos simular o envio e registrar no log
    const ZAPI_URL = Deno.env.get('ZAPI_URL') || 'https://api.z-api.io'
    const ZAPI_TOKEN = Deno.env.get('ZAPI_TOKEN') || 'seu-token-aqui'
    const ZAPI_INSTANCE = Deno.env.get('ZAPI_INSTANCE') || 'sua-instancia-aqui'

    let endpoint = ''
    let body: Record<string, any> = {}

    // Roteamento baseado no tipo de mensagem
    switch (payload.type) {
      case 'text':
        endpoint = '/send-text'
        body = {
          phone: payload.phone,
          message: payload.data.message
        }
        break

      case 'image':
        endpoint = '/send-image'
        body = {
          phone: payload.phone,
          image: payload.data.image,
          caption: payload.data.caption || ''
        }
        break

      case 'document':
        endpoint = '/send-document'
        body = {
          phone: payload.phone,
          document: payload.data.document,
          filename: payload.data.filename
        }
        break

      case 'audio':
        endpoint = '/send-audio'
        body = {
          phone: payload.phone,
          audio: payload.data.audio
        }
        break

      case 'video':
        endpoint = '/send-video'
        body = {
          phone: payload.phone,
          video: payload.data.video,
          caption: payload.data.caption || ''
        }
        break

      case 'button':
        endpoint = '/send-button-list'
        body = {
          phone: payload.phone,
          message: payload.data.message,
          buttonList: payload.data.buttons
        }
        break

      case 'list':
        endpoint = '/send-list'
        body = {
          phone: payload.phone,
          message: payload.data.message,
          buttonText: payload.data.buttonText,
          sections: payload.data.sections
        }
        break

      default:
        throw new Error(`Tipo de mensagem não suportado: ${payload.type}`)
    }

    // Fazer a requisição para a Z-API
    const zapiUrl = `${ZAPI_URL}/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}${endpoint}`
    
    console.log('Enviando para Z-API:', zapiUrl)
    console.log('Body:', JSON.stringify(body, null, 2))

    const response = await fetch(zapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const responseData = await response.json()
    console.log('Resposta da Z-API:', responseData)

    if (!response.ok) {
      throw new Error(`Erro na Z-API: ${response.status} - ${JSON.stringify(responseData)}`)
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Mensagem enviada com sucesso',
      type: payload.type,
      phone: payload.phone,
      zapiResponse: responseData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Erro no sender:', error)
    
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
