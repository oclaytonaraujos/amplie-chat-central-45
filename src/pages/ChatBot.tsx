
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatbotForm } from '@/components/chatbot/ChatbotForm';
import { ChatbotTable } from '@/components/chatbot/ChatbotTable';
import { EmptyState } from '@/components/chatbot/EmptyState';
import { useChatbotFlows, ChatbotFlow } from '@/hooks/useChatbotFlows';
import { toast } from 'sonner';

export default function ChatBot() {
  const { flows, loading, deleteFlow, toggleFlowStatus, duplicateFlow } = useChatbotFlows();
  const [showForm, setShowForm] = useState(false);
  const [editingFlow, setEditingFlow] = useState<ChatbotFlow | null>(null);

  const handleEdit = (chatbot: ChatbotFlow) => {
    setEditingFlow(chatbot);
    setShowForm(true);
  };

  const handleDuplicate = async (chatbotId: string) => {
    await duplicateFlow(chatbotId);
  };

  const handleToggleStatus = async (chatbotId: string, currentStatus: string) => {
    await toggleFlowStatus(chatbotId, currentStatus);
  };

  const handleDelete = async (chatbotId: string) => {
    if (confirm('Tem certeza que deseja excluir este fluxo de chatbot?')) {
      await deleteFlow(chatbotId);
    }
  };

  const handleFormSubmit = (success: boolean) => {
    if (success) {
      setShowForm(false);
      setEditingFlow(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFlow(null);
  };

  const handleCreateNew = () => {
    setEditingFlow(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amplie-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando fluxos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chatbot</h1>
          <p className="text-gray-600">
            Configure fluxos de atendimento automatizado para melhorar a experiência do cliente
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-amplie-primary hover:bg-amplie-primary-light">
          <Plus className="w-4 h-4 mr-2" />
          Novo Fluxo
        </Button>
      </div>

      {flows.length === 0 ? (
        <EmptyState onCreateFirst={handleCreateNew} />
      ) : (
        <ChatbotTable
          chatbots={flows}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingFlow ? 'Editar Fluxo de Chatbot' : 'Criar Novo Fluxo'}
            </DialogTitle>
          </DialogHeader>
          
          <ChatbotForm
            flowId={editingFlow?.id}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEdit={!!editingFlow}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
