
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useSetores, type Setor } from '@/hooks/useSetores';

interface ExcluirSetorDialogProps {
  setor: Setor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExcluirSetorDialog({ setor, open, onOpenChange }: ExcluirSetorDialogProps) {
  const { excluirSetor } = useSetores();

  if (!setor) return null;

  const handleExcluir = () => {
    excluirSetor(setor.id);
    onOpenChange(false);
  };

  const hasActiveAgents = setor.agentes > 0;
  const hasActiveTickets = setor.atendimentosAtivos > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <DialogTitle>Excluir Setor</DialogTitle>
          </div>
          <DialogDescription>
            Esta ação não pode ser desfeita. Tem certeza que deseja excluir o setor "{setor.nome}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(hasActiveAgents || hasActiveTickets) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Atenção:</p>
                  <ul className="mt-1 space-y-1">
                    {hasActiveAgents && (
                      <li>• Este setor possui {setor.agentes} agente(s) vinculado(s)</li>
                    )}
                    {hasActiveTickets && (
                      <li>• Este setor possui {setor.atendimentosAtivos} atendimento(s) ativo(s)</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleExcluir}
            >
              Excluir Setor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
