import { useState, useEffect } from 'react';
import { MessageSquare, User, Plus } from 'lucide-react';
import { FilterBar } from '@/components/atendimento/FilterBar';
import { AtendimentosList } from '@/components/atendimento/AtendimentosList';
import { ChatWhatsApp } from '@/components/atendimento/ChatWhatsApp';
import { ClienteInfo } from '@/components/atendimento/ClienteInfo';
import { ContactsList } from '@/components/atendimento/ContactsList';
import { TransferDialog } from '@/components/atendimento/TransferDialog';
import { ConfirmSaveContactDialog } from '@/components/contatos/ConfirmSaveContactDialog';
import { NovoContatoDialog } from '@/components/contatos/NovoContatoDialog';
import { useContactCheck } from '@/hooks/useContactCheck';
import { useAtendimento } from '@/hooks/useAtendimento';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Configuração simulada do limite de mensagens (normalmente viria do Painel)
const LIMITE_MENSAGENS_ABERTAS = 5; // Configurável pelo administrador

export default function Atendimento() {
  const [selectedAtendimento, setSelectedAtendimento] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();

  // Hooks do Supabase
  const {
    conversas,
    mensagens,
    loading: loadingConversas,
    loadMensagens,
    enviarMensagem,
    atualizarStatusConversa,
    assumirConversa
  } = useAtendimento();

  const {
    contatos,
    createContato,
    createConversa,
    loading: loadingContatos
  } = useSupabaseData();

  // Hook para gerenciar verificação e salvamento de contatos
  const {
    pendingContact,
    showConfirmDialog,
    showNovoContatoDialog,
    setShowConfirmDialog,
    setShowNovoContatoDialog,
    handleFinalizarWithContactCheck,
    handleConfirmSave,
    handleCancelSave,
    handleContactSaved
  } = useContactCheck();

  // Converter conversas do Supabase para o formato esperado pelo componente
  const atendimentosFormatados = conversas
    .filter(conv => conv.canal !== 'chat-interno') // Excluir conversas internas
    .map(conv => ({
      id: conv.id,
      cliente: conv.contatos?.nome || 'Cliente sem nome',
      telefone: conv.contatos?.telefone || '',
      ultimaMensagem: 'Nova conversa',
      tempo: new Date(conv.updated_at).toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      setor: conv.setor || 'Suporte',
      agente: conv.profiles?.nome,
      tags: conv.tags || [],
      status: conv.status as 'novos' | 'em-atendimento' | 'aguardando-cliente' | 'finalizados',
      tempoAberto: new Date(conv.created_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

  // Calcular mensagens em aberto para o agente atual
  const mensagensEmAberto = atendimentosFormatados.filter(a => 
    (a.status === 'novos' || a.status === 'em-atendimento') && 
    a.agente === user?.email // Usar email do usuário atual
  ).length;

  const podeIniciarNovoAtendimento = mensagensEmAberto < LIMITE_MENSAGENS_ABERTAS;
  
  const handleSelectAtendimento = (atendimento: any) => {
    setSelectedAtendimento(atendimento);
    setShowContacts(false);
    
    // Carregar mensagens da conversa
    loadMensagens(atendimento.id);
    
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleReturnToList = () => {
    setShowChat(false);
    setShowContacts(false);
  };

  const handleSairConversa = async () => {
    if (!selectedAtendimento) return;
    
    await atualizarStatusConversa(selectedAtendimento.id, 'aguardando-cliente');
    setSelectedAtendimento(null);
    if (isMobile) {
      setShowChat(false);
    }
  };

  const handleTransferir = () => {
    setShowTransferDialog(true);
  };

  const handleFinalizar = () => {
    if (!selectedAtendimento) return;

    // Agente e setor atuais (normalmente viriam do contexto de autenticação)
    const agenteAtual = user?.email || 'Agente Atual';
    const setorAtual = 'Suporte';

    // Usa o hook para verificar se deve salvar contato
    handleFinalizarWithContactCheck(
      {
        nome: selectedAtendimento.cliente,
        telefone: selectedAtendimento.telefone
      },
      contatos,
      agenteAtual,
      setorAtual,
      async () => {
        await atualizarStatusConversa(selectedAtendimento.id, 'finalizados');
        setSelectedAtendimento(null);
        if (isMobile) {
          setShowChat(false);
        }
      }
    );
  };

  const handleNovaConversa = () => {
    if (!podeIniciarNovoAtendimento) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${LIMITE_MENSAGENS_ABERTAS} mensagens em aberto. Finalize ou transfira alguns atendimentos para iniciar novos.`,
        variant: "destructive"
      });
      return;
    }
    setShowContacts(true);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleSelectContact = async (contato: any) => {
    if (!podeIniciarNovoAtendimento) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${LIMITE_MENSAGENS_ABERTAS} mensagens em aberto. Finalize ou transfira alguns atendimentos para iniciar novos.`,
        variant: "destructive"
      });
      return;
    }

    // Criar nova conversa no Supabase
    const novaConversa = await createConversa({
      contato_id: contato.id,
      status: 'novos',
      canal: 'whatsapp',
      prioridade: 'normal',
      setor: 'Suporte',
      tags: []
    });
    
    if (novaConversa) {
      const atendimentoFormatado = {
        id: novaConversa.id,
        cliente: contato.nome,
        telefone: contato.telefone,
        ultimaMensagem: 'Nova conversa iniciada',
        tempo: 'agora',
        setor: 'Suporte',
        tags: [],
        status: 'novos' as const
      };
      
      setSelectedAtendimento(atendimentoFormatado);
      setShowContacts(false);
      if (isMobile) {
        setShowChat(true);
      }
    }
  };

  const handleConfirmTransfer = async (agente: string, motivo: string) => {
    if (!selectedAtendimento) return;
    
    // Aqui você implementaria a lógica de transferência real
    // Por enquanto, apenas atualiza o status
    await atualizarStatusConversa(selectedAtendimento.id, 'aguardando-cliente');
    
    toast({
      title: "Atendimento transferido",
      description: `Atendimento transferido para ${agente} com sucesso.`,
    });
    setShowTransferDialog(false);
    setSelectedAtendimento(null);
    if (isMobile) {
      setShowChat(false);
    }
  };

  const handleContatoAdicionado = async (novoContato: any) => {
    const contato = await createContato(novoContato);
    if (contato) {
      handleContactSaved();
      toast({
        title: "Contato salvo",
        description: `${novoContato.nome} foi adicionado aos contatos com sucesso.`
      });
    }
  };

  const handleSendMessage = async (texto: string) => {
    if (!selectedAtendimento) return;
    
    await enviarMensagem(selectedAtendimento.id, texto);
    
    // Assumir conversa se ainda não foi assumida
    if (selectedAtendimento.status === 'novos') {
      await assumirConversa(selectedAtendimento.id);
    }
  };

  // Obter mensagens da conversa selecionada
  const mensagensConversa = selectedAtendimento 
    ? (mensagens[selectedAtendimento.id] || []).map(msg => ({
        id: parseInt(msg.id.substring(0, 8), 16), // Converter UUID para número para compatibilidade
        texto: msg.conteudo,
        autor: msg.remetente_tipo === 'agente' ? 'agente' as const : 'cliente' as const,
        tempo: new Date(msg.created_at).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: msg.lida ? 'lido' as const : 'entregue' as const
      }))
    : [];

  // Obter informações do cliente selecionado
  const clienteInfo = selectedAtendimento 
    ? {
        id: selectedAtendimento.id,
        nome: selectedAtendimento.cliente,
        telefone: selectedAtendimento.telefone,
        email: '', // Buscar do contato se disponível
        dataCadastro: selectedAtendimento.tempoAberto,
        tags: selectedAtendimento.tags || [],
        historico: [] // Implementar histórico de conversas
      }
    : null;

  if (loadingConversas || loadingContatos) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amplie-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando atendimentos...</p>
        </div>
      </div>
    );
  }

  // Layout mobile: mostra lista, contatos ou chat baseado no estado
  if (isMobile) {
    return (
      <div className="min-h-screen">
        {!showChat ? (
          // Mostra lista de atendimentos
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
              <FilterBar />
              <Button 
                onClick={handleNovaConversa}
                disabled={!podeIniciarNovoAtendimento}
                className="bg-green-500 hover:bg-green-600 text-white ml-2 w-10 h-10 p-0"
                size="icon"
                title={!podeIniciarNovoAtendimento ? `Limite de ${LIMITE_MENSAGENS_ABERTAS} mensagens atingido` : 'Nova conversa'}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AtendimentosList 
                atendimentos={atendimentosFormatados} 
                onSelectAtendimento={handleSelectAtendimento}
                selectedAtendimento={selectedAtendimento}
                isMobile={isMobile}
              />
            </div>
          </div>
        ) : showContacts ? (
          // Mostra lista de contatos
          <ContactsList
            contatos={contatos.map(c => ({
              ...c,
              status: 'online' as const,
              ultimoContato: new Date(c.updated_at).toLocaleDateString('pt-BR')
            }))}
            onSelectContact={handleSelectContact}
            onBack={handleReturnToList}
          />
        ) : selectedAtendimento ? (
          // Mostra chat em tela cheia
          <div className="h-full">
            <ChatWhatsApp 
              cliente={{
                id: selectedAtendimento.id,
                nome: selectedAtendimento.cliente,
                telefone: selectedAtendimento.telefone,
                status: 'online'
              }}
              mensagens={mensagensConversa}
              onReturnToList={handleReturnToList}
              onSairConversa={handleSairConversa}
              onTransferir={handleTransferir}
              onFinalizar={handleFinalizar}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : null}

        {/* Dialog de transferência */}
        <TransferDialog
          open={showTransferDialog}
          onOpenChange={setShowTransferDialog}
          onConfirm={handleConfirmTransfer}
        />

        {/* Dialog de confirmação para salvar contato */}
        <ConfirmSaveContactDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmSave}
          onCancel={handleCancelSave}
          clienteNome={pendingContact?.nome || ''}
          clienteTelefone={pendingContact?.telefone || ''}
        />

        {/* Dialog para criar novo contato com dados pré-preenchidos */}
        <NovoContatoDialog
          open={showNovoContatoDialog}
          onOpenChange={setShowNovoContatoDialog}
          onContatoAdicionado={handleContatoAdicionado}
          dadosIniciais={pendingContact || undefined}
        />
      </div>
    );
  }

  // Layout desktop: duas colunas
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Primeira Coluna - Pesquisa, Filtros e Atendimentos */}
        <div className="col-span-5 flex flex-col">
          {/* Barra de filtros e pesquisa */}
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <FilterBar />
            </div>
            <Button 
              onClick={handleNovaConversa}
              disabled={!podeIniciarNovoAtendimento}
              className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 p-0"
              size="icon"
              title={!podeIniciarNovoAtendimento ? `Limite de ${LIMITE_MENSAGENS_ABERTAS} mensagens atingido` : 'Nova conversa'}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Lista de atendimentos ou contatos */}
          <div className="flex-1 mt-4">
            {showContacts ? (
              <ContactsList
                contatos={contatos.map(c => ({
                  ...c,
                  status: 'online' as const,
                  ultimoContato: new Date(c.updated_at).toLocaleDateString('pt-BR')
                }))}
                onSelectContact={handleSelectContact}
                onBack={() => setShowContacts(false)}
              />
            ) : (
              <AtendimentosList 
                atendimentos={atendimentosFormatados} 
                onSelectAtendimento={handleSelectAtendimento}
                selectedAtendimento={selectedAtendimento}
              />
            )}
          </div>
        </div>

        {/* Segunda Coluna - Chat e Informações do Cliente */}
        <div className="col-span-7 grid grid-rows-3 gap-4 h-full">
          {/* Chat do WhatsApp - ocupa 2/3 da altura */}
          <div className="row-span-2">
            {selectedAtendimento ? (
              <ChatWhatsApp 
                cliente={{
                  id: selectedAtendimento.id,
                  nome: selectedAtendimento.cliente,
                  telefone: selectedAtendimento.telefone,
                  status: 'online'
                }}
                mensagens={mensagensConversa}
                onSairConversa={handleSairConversa}
                onTransferir={handleTransferir}
                onFinalizar={handleFinalizar}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-xl border border-dashed border-gray-300">
                <div className="text-center p-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-1">Selecione uma conversa</h3>
                  <p className="text-sm text-gray-500">Clique em uma conversa para iniciar o atendimento</p>
                  {!podeIniciarNovoAtendimento && (
                    <p className="text-xs text-orange-600 mt-2">
                      Limite de {LIMITE_MENSAGENS_ABERTAS} mensagens em aberto atingido
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Informações do cliente - ocupa 1/3 da altura */}
          <div className="row-span-1">
            {clienteInfo ? (
              <ClienteInfo cliente={clienteInfo} />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-xl border border-dashed border-gray-300">
                <div className="text-center">
                  <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Dados do cliente</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de transferência */}
      <TransferDialog
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        onConfirm={handleConfirmTransfer}
      />

      {/* Dialog de confirmação para salvar contato */}
      <ConfirmSaveContactDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
        clienteNome={pendingContact?.nome || ''}
        clienteTelefone={pendingContact?.telefone || ''}
      />

      {/* Dialog para criar novo contato com dados pré-preenchidos */}
      <NovoContatoDialog
        open={showNovoContatoDialog}
        onOpenChange={setShowNovoContatoDialog}
        onContatoAdicionado={handleContatoAdicionado}
        dadosIniciais={pendingContact || undefined}
      />
    </div>
  );
}
