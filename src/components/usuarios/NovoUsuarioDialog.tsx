
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NovoUsuario {
  nome: string;
  email: string;
  setor: string;
  cargo: string;
  status: string;
}

interface NovoUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsuarioAdicionado: (usuario: NovoUsuario) => void;
}

const setoresDisponiveis = ['Vendas', 'Suporte', 'Marketing', 'Financeiro', 'RH'];

export function NovoUsuarioDialog({ open, onOpenChange, onUsuarioAdicionado }: NovoUsuarioDialogProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    setor: '',
    cargo: 'usuario',
    status: 'online'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoUsuario: NovoUsuario = {
      nome: formData.nome,
      email: formData.email,
      setor: formData.setor,
      cargo: formData.cargo,
      status: formData.status
    };

    onUsuarioAdicionado(novoUsuario);
    
    // Reset form
    setFormData({
      nome: '',
      email: '',
      setor: '',
      cargo: 'usuario',
      status: 'online'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="setor">Setor *</Label>
            <Select value={formData.setor} onValueChange={(value) => setFormData(prev => ({ ...prev, setor: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {setoresDisponiveis.map(setor => (
                  <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cargo">Cargo *</Label>
            <Select value={formData.cargo} onValueChange={(value) => setFormData(prev => ({ ...prev, cargo: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="agente">Agente</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="ausente">Ausente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.nome || !formData.email || !formData.setor || !formData.cargo}>
              Criar Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
