
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface NovoUsuario {
  nome: string;
  email: string;
  setor: string;
  papel: string;
  status: 'Ativo' | 'Inativo';
  permissoes: string[];
}

interface NovoUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsuarioAdicionado: (usuario: NovoUsuario) => void;
}

const setoresDisponiveis = ['Vendas', 'Suporte', 'Marketing', 'Financeiro', 'RH'];
const papeisDisponiveis = ['Agente', 'Supervisor', 'Gerente', 'Admin'];
const permissoesDisponiveis = [
  'Visualizar Dashboard',
  'Gerenciar Usuários',
  'Gerenciar Contatos',
  'Atendimento',
  'Visualizar Relatórios',
  'Configurações Sistema',
  'Backup/Restore',
  'Gerenciar Setores'
];

export function NovoUsuarioDialog({ open, onOpenChange, onUsuarioAdicionado }: NovoUsuarioDialogProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    setor: '',
    papel: '',
    status: 'Ativo' as 'Ativo' | 'Inativo'
  });
  const [permissoes, setPermissoes] = useState<string[]>([]);

  const togglePermissao = (permissao: string) => {
    setPermissoes(prev => 
      prev.includes(permissao) 
        ? prev.filter(p => p !== permissao)
        : [...prev, permissao]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoUsuario: NovoUsuario = {
      ...formData,
      permissoes
    };

    onUsuarioAdicionado(novoUsuario);
    
    // Reset form
    setFormData({
      nome: '',
      email: '',
      setor: '',
      papel: '',
      status: 'Ativo'
    });
    setPermissoes([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="papel">Papel *</Label>
              <Select value={formData.papel} onValueChange={(value) => setFormData(prev => ({ ...prev, papel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  {papeisDisponiveis.map(papel => (
                    <SelectItem key={papel} value={papel}>{papel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Permissões</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {permissoesDisponiveis.map(permissao => (
                <div key={permissao} className="flex items-center space-x-2">
                  <Checkbox
                    id={permissao}
                    checked={permissoes.includes(permissao)}
                    onCheckedChange={() => togglePermissao(permissao)}
                  />
                  <Label htmlFor={permissao} className="text-sm font-normal cursor-pointer">
                    {permissao}
                  </Label>
                </div>
              ))}
            </div>
            {permissoes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {permissoes.map(permissao => (
                  <Badge key={permissao} variant="secondary" className="text-xs">
                    {permissao}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.nome || !formData.email || !formData.setor || !formData.papel}>
              Criar Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
