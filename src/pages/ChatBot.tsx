
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatbotForm } from '@/components/chatbot/ChatbotForm';
import { ChatbotTable } from '@/components/chatbot/ChatbotTable';
import { EmptyState } from '@/components/chatbot/EmptyState';
import { useChatbots } from '@/hooks/useChatbots';

interface NoDoFluxo {
  id: string;
  nome: string;
  mensagem: string;
  tipoResposta: 'opcoes' | 'texto-livre' | 'anexo' | 'apenas-mensagem';
  opcoes: Array<{
    id: string;
    texto: string;
    proximaAcao: 'proximo-no' | 'transferir' | 'finalizar' | 'mensagem-finalizar';
    proximoNoId?: string;
    setorTransferencia?: string;
    mensagemFinal?: string;
  }>;
}

interface ChatbotFormData {
  nome: string;
  mensagemInicial: string;
  nos: NoDoFluxo[];
}

// Converter dados do Supabase para o formato esperado pela tabela
const convertSupabaseChatbotToTableFormat = (chatbot: any) => ({
  id: chatbot.id,
  nome: chatbot.nome,
  status: chatbot.status === 'ativo' ? 'Ativo' as const : 'Inativo' as const,
  ultimaEdicao: new Date(chatbot.updated_at).toISOString().split('T')[0],
  interacoes: chatbot.interacoes || 0,
  transferencias: chatbot.transferencias || 0,
  mensagemInicial: chatbot.mensagem_inicial,
  nos: chatbot.fluxo || []
});

export default function ChatBot() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<any>(null);
  
  const { 
    chatbots, 
    loading, 
    criarChatbot, 
    atualizarChatbot, 
    deletarChatbot, 
    toggleStatusChatbot 
  } = useChatbots();

  const filteredChatbots = useMemo(() => 
    chatbots
      .filter(chatbot =>
        chatbot.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(convertSupabaseChatbotToTableFormat),
    [searchTerm, chatbots]
  );

  const handleCreateChatbot = async (formData: ChatbotFormData) => {
    console.log('Criando chatbot:', formData);
    
    const result = await criarChatbot({
      nome: formData.nome,
      status: 'ativo',
      mensagem_inicial: formData.mensagemInicial,
      fluxo: formData.nos
    });

    if (result) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditChatbot = (chatbot: any) => {
    const chatbotCompleto = chatbots.find(c => c.id === chatbot.id);
    setSelectedChatbot(chatbotCompleto || null);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (formData: ChatbotFormData) => {
    if (!selectedChatbot) return;

    console.log('Salvando edição:', formData);
    
    const result = await atualizarChatbot(selectedChatbot.id, {
      nome: formData.nome,
      mensagem_inicial: formData.mensagemInicial,
      fluxo: formData.nos
    });
    
    if (result) {
      setIsEditDialogOpen(false);
      setSelectedChatbot(null);
    }
  };

  const handleDuplicate = async (chatbotId: string) => {
    const chatbotOriginal = chatbots.find(c => c.id === chatbotId);
    if (!chatbotOriginal) return;

    const result = await criarChatbot({
      nome: `${chatbotOriginal.nome} (Cópia)`,
      status: 'inativo',
      mensagem_inicial: chatbotOriginal.mensagem_inicial,
      fluxo: chatbotOriginal.fluxo
    });

    if (result) {
      console.log('Chatbot duplicado:', result);
    }
  };

  const toggleStatus = async (chatbotId: string) => {
    await toggleStatusChatbot(chatbotId);
    console.log('Status alternado para chatbot:', chatbotId);
  };

  const handleDelete = async (chatbotId: string) => {
    const success = await deletarChatbot(chatbotId);
    if (success) {
      console.log('Chatbot excluído:', chatbotId);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amplie-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando chatbots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com botão de ação */}
      <div className="flex items-center justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
              <Plus className="w-4 h-4 mr-2" />
              Novo Fluxo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Criar Novo Fluxo de ChatBot</DialogTitle>
            </DialogHeader>
            <ChatbotForm
              onSubmit={handleCreateChatbot}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-amplie p-6">
        <Input
          placeholder="Pesquisar fluxos de chatbot..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Chatbots Table ou Empty State */}
      {filteredChatbots.length > 0 ? (
        <ChatbotTable
          chatbots={filteredChatbots}
          onEdit={handleEditChatbot}
          onDuplicate={handleDuplicate}
          onToggleStatus={toggleStatus}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState onCreateNew={() => setIsCreateDialogOpen(true)} />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Editar Fluxo de ChatBot</DialogTitle>
          </DialogHeader>
          {selectedChatbot && (
            <ChatbotForm
              formData={{
                nome: selectedChatbot.nome,
                mensagemInicial: selectedChatbot.mensagem_inicial,
                nos: selectedChatbot.fluxo || []
              }}
              onSubmit={handleSaveEdit}
              onCancel={() => setIsEditDialogOpen(false)}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
