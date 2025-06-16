
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useSetoresData } from '@/hooks/useSetoresData';

interface SetorData {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ativo: boolean;
  created_at: string;
}

interface ExcluirSetorDialogProps {
  setor: SetorData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExcluirSetorDialog({ setor, open, onOpenChange }: ExcluirSetorDialogProps) {
  const { excluirSetor } = useSetoresData();

  if (!setor) return null;

  const handleExcluir = async () => {
    const sucesso = await excluirSetor(setor.id);
    if (sucesso) {
      onOpenChange(false);
    }
  };

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
