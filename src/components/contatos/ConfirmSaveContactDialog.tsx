
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Phone, Building2 } from 'lucide-react';

interface AtendimentoData {
  cliente: string;
  telefone: string;
  setor: string;
  agente?: string;
}

interface ConfirmSaveContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atendimentoData: AtendimentoData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSaveContactDialog({ 
  open, 
  onOpenChange, 
  atendimentoData,
  onConfirm,
  onCancel
}: ConfirmSaveContactDialogProps) {
  if (!atendimentoData) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Salvar Novo Contato</DialogTitle>
          <DialogDescription>
            Este número não está na sua lista de contatos. Deseja salvá-lo?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{atendimentoData.cliente}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{atendimentoData.telefone}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{atendimentoData.setor}</span>
            </div>
            
            {atendimentoData.agente && (
              <div className="text-sm text-gray-500">
                Último atendimento: {atendimentoData.agente}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Não Salvar
            </Button>
            <Button onClick={handleConfirm}>
              Salvar Contato
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
