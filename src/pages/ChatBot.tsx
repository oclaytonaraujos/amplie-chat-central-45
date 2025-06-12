
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatbotForm } from '@/components/chatbot/ChatbotForm';
import { ChatbotTable } from '@/components/chatbot/ChatbotTable';
import { EmptyState } from '@/components/chatbot/EmptyState';

const chatbotsData = [
  {
    id: 1,
    nome: 'Fluxo Principal',
    status: 'Ativo',
    ultimaEdicao: '2024-06-10',
    interacoes: 234,
    transferencias: 12
  },
  {
    id: 2,
    nome: 'Suporte Técnico',
    status: 'Ativo',
    ultimaEdicao: '2024-06-09',
    interacoes: 89,
    transferencias: 45
  },
  {
    id: 3,
    nome: 'Vendas',
    status: 'Inativo',
    ultimaEdicao: '2024-06-08',
    interacoes: 156,
    transferencias: 23
  }
];

export default function ChatBot() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    mensagemInicial: '',
    opcoes: [''],
    acaoTransferencia: '',
    setorTransferencia: ''
  });

  const filteredChatbots = useMemo(() => 
    chatbotsData.filter(chatbot =>
      chatbot.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  const handleCreateChatbot = () => {
    console.log('Criando chatbot:', formData);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditChatbot = (chatbot) => {
    setSelectedChatbot(chatbot);
    setFormData({
      nome: chatbot.nome,
      mensagemInicial: '',
      opcoes: [''],
      acaoTransferencia: '',
      setorTransferencia: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    console.log('Salvando edição:', formData);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      mensagemInicial: '',
      opcoes: [''],
      acaoTransferencia: '',
      setorTransferencia: ''
    });
    setSelectedChatbot(null);
  };

  const toggleStatus = (chatbotId) => {
    console.log('Alternando status do chatbot:', chatbotId);
  };

  const handleDelete = (chatbotId) => {
    console.log('Excluindo chatbot:', chatbotId);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Fluxo de ChatBot</DialogTitle>
            </DialogHeader>
            <ChatbotForm
              formData={formData}
              setFormData={setFormData}
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
          onToggleStatus={toggleStatus}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState onCreateNew={() => setIsCreateDialogOpen(true)} />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Fluxo de ChatBot</DialogTitle>
          </DialogHeader>
          <ChatbotForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSaveEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
