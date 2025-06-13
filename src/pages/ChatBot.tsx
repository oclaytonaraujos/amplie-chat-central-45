
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatbotForm } from '@/components/chatbot/ChatbotForm';
import { ChatbotTable } from '@/components/chatbot/ChatbotTable';
import { EmptyState } from '@/components/chatbot/EmptyState';

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

interface ChatbotData {
  id: number;
  nome: string;
  status: 'Ativo' | 'Inativo';
  ultimaEdicao: string;
  interacoes: number;
  transferencias: number;
  mensagemInicial: string;
  nos: NoDoFluxo[];
}

const chatbotsData: ChatbotData[] = [
  {
    id: 1,
    nome: 'Fluxo Principal',
    status: 'Ativo',
    ultimaEdicao: '2024-06-10',
    interacoes: 234,
    transferencias: 12,
    mensagemInicial: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo hoje?',
    nos: [
      {
        id: 'no-inicial',
        nome: 'Nó Inicial',
        mensagem: 'Por favor, escolha uma das opções abaixo:',
        tipoResposta: 'opcoes',
        opcoes: [
          { id: '1', texto: 'Vendas', proximaAcao: 'transferir', setorTransferencia: 'Vendas' },
          { id: '2', texto: 'Suporte Técnico', proximaAcao: 'transferir', setorTransferencia: 'Suporte Técnico' }
        ]
      }
    ]
  },
  {
    id: 2,
    nome: 'Suporte Técnico',
    status: 'Ativo',
    ultimaEdicao: '2024-06-09',
    interacoes: 89,
    transferencias: 45,
    mensagemInicial: 'Olá! Você está no suporte técnico.',
    nos: [
      {
        id: 'no-inicial',
        nome: 'Nó Inicial',
        mensagem: 'Qual tipo de problema você está enfrentando?',
        tipoResposta: 'opcoes',
        opcoes: [
          { id: '1', texto: 'Problema de acesso', proximaAcao: 'proximo-no', proximoNoId: 'no-acesso' },
          { id: '2', texto: 'Erro no sistema', proximaAcao: 'transferir', setorTransferencia: 'Suporte Técnico' }
        ]
      }
    ]
  },
  {
    id: 3,
    nome: 'Vendas',
    status: 'Inativo',
    ultimaEdicao: '2024-06-08',
    interacoes: 156,
    transferencias: 23,
    mensagemInicial: 'Olá! Interessado em nossos produtos?',
    nos: [
      {
        id: 'no-inicial',
        nome: 'Nó Inicial',
        mensagem: 'Que tipo de produto você procura?',
        tipoResposta: 'opcoes',
        opcoes: [
          { id: '1', texto: 'Planos Básicos', proximaAcao: 'mensagem-finalizar', mensagemFinal: 'Obrigado pelo interesse! Um consultor entrará em contato.' },
          { id: '2', texto: 'Planos Premium', proximaAcao: 'transferir', setorTransferencia: 'Vendas' }
        ]
      }
    ]
  }
];

export default function ChatBot() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<ChatbotData | null>(null);
  const [chatbots, setChatbots] = useState<ChatbotData[]>(chatbotsData);

  const filteredChatbots = useMemo(() => 
    chatbots.filter(chatbot =>
      chatbot.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm, chatbots]
  );

  const handleCreateChatbot = (formData: any) => {
    console.log('Criando chatbot:', formData);
    
    const novoChatbot: ChatbotData = {
      id: Date.now(),
      nome: formData.nome,
      status: 'Ativo',
      ultimaEdicao: new Date().toISOString().split('T')[0],
      interacoes: 0,
      transferencias: 0,
      mensagemInicial: formData.mensagemInicial,
      nos: formData.nos
    };

    setChatbots([...chatbots, novoChatbot]);
    setIsCreateDialogOpen(false);
  };

  const handleEditChatbot = (chatbot: any) => {
    const chatbotCompleto = chatbots.find(c => c.id === chatbot.id);
    setSelectedChatbot(chatbotCompleto || null);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (formData: any) => {
    if (!selectedChatbot) return;

    console.log('Salvando edição:', formData);
    
    setChatbots(chatbots.map(chatbot =>
      chatbot.id === selectedChatbot.id
        ? {
            ...chatbot,
            nome: formData.nome,
            mensagemInicial: formData.mensagemInicial,
            nos: formData.nos,
            ultimaEdicao: new Date().toISOString().split('T')[0]
          }
        : chatbot
    ));
    
    setIsEditDialogOpen(false);
    setSelectedChatbot(null);
  };

  const handleDuplicate = (chatbotId: number) => {
    const chatbotOriginal = chatbots.find(c => c.id === chatbotId);
    if (!chatbotOriginal) return;

    const chatbotDuplicado: ChatbotData = {
      ...chatbotOriginal,
      id: Date.now(),
      nome: `${chatbotOriginal.nome} (Cópia)`,
      status: 'Inativo',
      ultimaEdicao: new Date().toISOString().split('T')[0],
      interacoes: 0,
      transferencias: 0
    };

    setChatbots([...chatbots, chatbotDuplicado]);
    console.log('Chatbot duplicado:', chatbotDuplicado);
  };

  const toggleStatus = (chatbotId: number) => {
    setChatbots(chatbots.map(chatbot =>
      chatbot.id === chatbotId
        ? { 
            ...chatbot, 
            status: chatbot.status === 'Ativo' ? 'Inativo' : 'Ativo',
            ultimaEdicao: new Date().toISOString().split('T')[0]
          }
        : chatbot
    ));
    console.log('Status alternado para chatbot:', chatbotId);
  };

  const handleDelete = (chatbotId: number) => {
    setChatbots(chatbots.filter(chatbot => chatbot.id !== chatbotId));
    console.log('Chatbot excluído:', chatbotId);
  };

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
                mensagemInicial: selectedChatbot.mensagemInicial,
                nos: selectedChatbot.nos
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
