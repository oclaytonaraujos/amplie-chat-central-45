
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatbotEngineRequest {
  conversaId: string;
  mensagemCliente?: string;
  iniciarFluxo?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { conversaId, mensagemCliente, iniciarFluxo }: ChatbotEngineRequest = await req.json()

    console.log('Chatbot Engine chamado:', { conversaId, mensagemCliente, iniciarFluxo })

    // Buscar dados da conversa
    const { data: conversa, error: conversaError } = await supabase
      .from('conversas')
      .select(`
        *,
        contatos (
          id,
          nome,
          telefone,
          empresa_id
        )
      `)
      .eq('id', conversaId)
      .single()

    if (conversaError || !conversa) {
      throw new Error('Conversa não encontrada')
    }

    // Se for para iniciar fluxo, verificar se já existe sessão ativa
    if (iniciarFluxo) {
      const { data: sessaoExistente } = await supabase
        .from('chatbot_sessions')
        .select('*')
        .eq('conversa_id', conversaId)
        .eq('status', 'ativo')
        .single()

      if (sessaoExistente) {
        console.log('Sessão de chatbot já existe para esta conversa')
        return new Response(
          JSON.stringify({ success: true, message: 'Sessão já ativa' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Buscar fluxo padrão da empresa
      const { data: fluxoPadrao, error: fluxoError } = await supabase
        .from('chatbot_flows')
        .select('*')
        .eq('empresa_id', conversa.contatos.empresa_id)
        .eq('status', 'ativo')
        .eq('is_default', true)
        .single()

      if (fluxoError || !fluxoPadrao) {
        console.log('Nenhum fluxo padrão ativo encontrado para a empresa')
        return new Response(
          JSON.stringify({ success: false, message: 'Nenhum fluxo ativo' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Buscar nó inicial do fluxo
      const { data: noInicial, error: noError } = await supabase
        .from('chatbot_nodes')
        .select('*')
        .eq('flow_id', fluxoPadrao.id)
        .eq('node_id', 'no-inicial')
        .single()

      if (noError || !noInicial) {
        throw new Error('Nó inicial não encontrado no fluxo')
      }

      // Criar sessão do chatbot
      const { error: sessaoError } = await supabase
        .from('chatbot_sessions')
        .insert({
          conversa_id: conversaId,
          flow_id: fluxoPadrao.id,
          current_node_id: 'no-inicial',
          status: 'ativo'
        })

      if (sessaoError) {
        throw sessaoError
      }

      // Enviar mensagem inicial
      await enviarMensagem(supabase, conversaId, fluxoPadrao.mensagem_inicial)

      // Se o nó inicial tem opções, enviar menu
      if (noInicial.tipo_resposta === 'opcoes') {
        const { data: opcoes } = await supabase
          .from('chatbot_options')
          .select('*')
          .eq('node_id', noInicial.id)
          .order('ordem', { ascending: true })

        if (opcoes && opcoes.length > 0) {
          const menuTexto = opcoes.map((opcao, index) => 
            `${index + 1}. ${opcao.texto}`
          ).join('\n')

          await enviarMensagem(supabase, conversaId, menuTexto)
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Fluxo iniciado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Processar resposta do cliente
    if (mensagemCliente) {
      const { data: sessao, error: sessaoError } = await supabase
        .from('chatbot_sessions')
        .select(`
          *,
          chatbot_flows (*)
        `)
        .eq('conversa_id', conversaId)
        .eq('status', 'ativo')
        .single()

      if (sessaoError || !sessao) {
        console.log('Sessão de chatbot não encontrada ou inativa')
        return new Response(
          JSON.stringify({ success: false, message: 'Sessão não encontrada' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Buscar nó atual
      const { data: noAtual, error: noError } = await supabase
        .from('chatbot_nodes')
        .select('*')
        .eq('flow_id', sessao.flow_id)
        .eq('node_id', sessao.current_node_id)
        .single()

      if (noError || !noAtual) {
        throw new Error('Nó atual não encontrado')
      }

      // Processar resposta baseada no tipo de nó
      if (noAtual.tipo_resposta === 'opcoes') {
        // Buscar opções do nó
        const { data: opcoes } = await supabase
          .from('chatbot_options')
          .select('*')
          .eq('node_id', noAtual.id)
          .order('ordem', { ascending: true })

        if (opcoes && opcoes.length > 0) {
          // Tentar encontrar a opção selecionada
          const numeroOpcao = parseInt(mensagemCliente.trim())
          const opcaoSelecionada = opcoes[numeroOpcao - 1]

          if (opcaoSelecionada) {
            await processarAcaoOpcao(supabase, conversaId, sessao, opcaoSelecionada)
          } else {
            // Opção inválida
            const menuTexto = 'Opção inválida. Por favor, escolha uma das opções:\n\n' +
              opcoes.map((opcao, index) => `${index + 1}. ${opcao.texto}`).join('\n')
            
            await enviarMensagem(supabase, conversaId, menuTexto)
          }
        }
      } else {
        // Para outros tipos (texto-livre, anexo), continuar fluxo ou finalizar
        // Por enquanto, vamos finalizar a sessão
        await finalizarSessao(supabase, conversaId)
        await enviarMensagem(supabase, conversaId, 'Obrigado! Seu atendimento será transferido para um de nossos especialistas.')
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Resposta processada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Parâmetros inválidos' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

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

async function enviarMensagem(supabase: any, conversaId: string, conteudo: string) {
  await supabase
    .from('mensagens')
    .insert({
      conversa_id: conversaId,
      conteudo: conteudo,
      remetente_tipo: 'bot',
      remetente_nome: 'Chatbot',
      tipo_mensagem: 'texto'
    })

  // Aqui você pode integrar com a Z-API para enviar a mensagem via WhatsApp
  // Por enquanto, apenas salvamos no banco
}

async function processarAcaoOpcao(supabase: any, conversaId: string, sessao: any, opcao: any) {
  switch (opcao.proxima_acao) {
    case 'proximo-no':
      if (opcao.proximo_node_id) {
        // Buscar próximo nó
        const { data: proximoNo } = await supabase
          .from('chatbot_nodes')
          .select('*')
          .eq('flow_id', sessao.flow_id)
          .eq('node_id', opcao.proximo_node_id)
          .single()

        if (proximoNo) {
          // Atualizar sessão para o próximo nó
          await supabase
            .from('chatbot_sessions')
            .update({
              current_node_id: opcao.proximo_node_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', sessao.id)

          // Enviar mensagem do próximo nó
          await enviarMensagem(supabase, conversaId, proximoNo.mensagem)

          // Se o próximo nó tem opções, enviar menu
          if (proximoNo.tipo_resposta === 'opcoes') {
            const { data: proximasOpcoes } = await supabase
              .from('chatbot_options')
              .select('*')
              .eq('node_id', proximoNo.id)
              .order('ordem', { ascending: true })

            if (proximasOpcoes && proximasOpcoes.length > 0) {
              const menuTexto = proximasOpcoes.map((opcao, index) => 
                `${index + 1}. ${opcao.texto}`
              ).join('\n')

              await enviarMensagem(supabase, conversaId, menuTexto)
            }
          }
        }
      }
      break

    case 'transferir':
      await finalizarSessao(supabase, conversaId)
      await enviarMensagem(supabase, conversaId, 
        `Transferindo você para o setor de ${opcao.setor_transferencia}. Um especialista entrará em contato em breve.`)
      
      // Atualizar conversa para indicar transferência
      await supabase
        .from('conversas')
        .update({
          setor: opcao.setor_transferencia,
          status: 'em-atendimento'
        })
        .eq('id', conversaId)
      break

    case 'mensagem-finalizar':
      await finalizarSessao(supabase, conversaId)
      if (opcao.mensagem_final) {
        await enviarMensagem(supabase, conversaId, opcao.mensagem_final)
      }
      
      await supabase
        .from('conversas')
        .update({ status: 'finalizado' })
        .eq('id', conversaId)
      break

    case 'finalizar':
      await finalizarSessao(supabase, conversaId)
      await enviarMensagem(supabase, conversaId, 'Atendimento finalizado. Obrigado!')
      
      await supabase
        .from('conversas')
        .update({ status: 'finalizado' })
        .eq('id', conversaId)
      break
  }
}

async function finalizarSessao(supabase: any, conversaId: string) {
  await supabase
    .from('chatbot_sessions')
    .update({
      status: 'finalizado',
      updated_at: new Date().toISOString()
    })
    .eq('conversa_id', conversaId)
}
