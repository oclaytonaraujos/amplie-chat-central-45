
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse webhook payload
    const payload: WebhookPayload = await req.json()
    console.log('Webhook recebido:', JSON.stringify(payload, null, 2))

    // Verificar se é uma mensagem recebida (não enviada por nós)
    if (payload.event !== 'message-received' || payload.data.fromMe) {
      console.log('Evento ignorado:', payload.event, 'fromMe:', payload.data.fromMe)
      return new Response(JSON.stringify({ success: true, message: 'Evento ignorado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const message = payload.data
    const telefone = message.from.replace(/\D/g, '') // Remove caracteres não numéricos
    const nomeContato = message.senderName || message.pushName || 'Cliente'

    console.log('Processando mensagem de:', telefone, 'nome:', nomeContato)

    // Buscar ou criar contato
    let { data: contato, error: contatoError } = await supabase
      .from('contatos')
      .select('*')
      .eq('telefone', telefone)
      .single()

    if (contatoError && contatoError.code === 'PGRST116') {
      // Contato não existe, criar novo
      console.log('Criando novo contato para:', telefone)
      
      // Buscar primeira empresa ativa (melhorar isso depois)
      const { data: empresa } = await supabase
        .from('empresas')
        .select('id')
        .eq('ativo', true)
        .limit(1)
        .single()

      if (!empresa) {
        throw new Error('Nenhuma empresa ativa encontrada')
      }

      const { data: novoContato, error: criarContatoError } = await supabase
        .from('contatos')
        .insert({
          nome: nomeContato,
          telefone: telefone,
          empresa_id: empresa.id
        })
        .select()
        .single()

      if (criarContatoError) {
        throw criarContatoError
      }

      contato = novoContato
    } else if (contatoError) {
      throw contatoError
    }

    console.log('Contato encontrado/criado:', contato?.id)

    // Buscar conversa ativa para este contato
    let { data: conversa, error: conversaError } = await supabase
      .from('conversas')
      .select('*')
      .eq('contato_id', contato!.id)
      .in('status', ['ativo', 'em-atendimento'])
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (conversaError && conversaError.code === 'PGRST116') {
      // Conversa não existe, criar nova
      console.log('Criando nova conversa para contato:', contato!.id)
      
      const { data: novaConversa, error: criarConversaError } = await supabase
        .from('conversas')
        .insert({
          contato_id: contato!.id,
          empresa_id: contato!.empresa_id,
          status: 'ativo',
          canal: 'whatsapp',
          prioridade: 'normal'
        })
        .select()
        .single()

      if (criarConversaError) {
        throw criarConversaError
      }

      conversa = novaConversa
    } else if (conversaError) {
      throw conversaError
    }

    console.log('Conversa encontrada/criada:', conversa?.id)

    // Inserir mensagem
    const { data: mensagem, error: mensagemError } = await supabase
      .from('mensagens')
      .insert({
        conversa_id: conversa!.id,
        conteudo: message.text.message,
        remetente_tipo: 'cliente',
        remetente_nome: nomeContato,
        tipo_mensagem: 'texto',
        metadata: {
          messageId: message.messageId,
          timestamp: message.timestamp,
          from: message.from,
          to: message.to
        }
      })
      .select()
      .single()

    if (mensagemError) {
      throw mensagemError
    }

    console.log('Mensagem inserida:', mensagem.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mensagem processada com sucesso',
        conversaId: conversa!.id,
        mensagemId: mensagem.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    
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
