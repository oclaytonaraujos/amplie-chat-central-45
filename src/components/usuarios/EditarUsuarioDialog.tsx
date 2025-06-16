
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  setor?: string;
  cargo?: string;
  status: string;
  permissoes?: any;
  avatar_url?: string;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
}

interface EditarUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onUsuarioEditado: (usuario: Usuario) => void;
}

const setoresDisponiveis = ['Vendas', 'Suporte', 'Marketing', 'Financeiro', 'RH', 'Administração', 'TI'];

const permissoesDisponiveis = [
  { id: 'dashboard', label: 'Visualizar Dashboard' },
  { id: 'atendimento', label: 'Acesso ao Atendimento' },
  { id: 'contatos', label: 'Gerenciar Contatos' },
  { id: 'usuarios', label: 'Gerenciar Usuários' },
  { id: 'setores', label: 'Gerenciar Setores' },
  { id: 'configuracoes', label: 'Configurações do Sistema' },
  { id: 'relatorios', label: 'Visualizar Relatórios' },
  { id: 'whatsapp', label: 'Gerenciar WhatsApp' },
  { id: 'chatbot', label: 'Gerenciar Chatbot' },
  { id: 'kanban', label: 'Acesso ao Kanban' },
  { id: 'chat_interno', label: 'Chat Interno' }
];

export function EditarUsuarioDialog({ open, onOpenChange, usuario, onUsuarioEditado }: EditarUsuarioDialogProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    setor: '',
    cargo: 'usuario',
    status: 'online',
    permissoes: [] as string[]
  });

  useEffect(() => {
    if (usuario) {
      // Parse permissoes do usuário (pode vir como string JSON ou array)
      let permissoesUsuario: string[] = [];
      if (usuario.permissoes) {
        if (typeof usuario.permissoes === 'string') {
          try {
            permissoesUsuario = JSON.parse(usuario.permissoes);
          } catch {
            permissoesUsuario = [];
          }
        } else if (Array.isArray(usuario.permissoes)) {
          permissoesUsuario = usuario.permissoes;
        }
      }

      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        setor: usuario.setor || '',
        cargo: usuario.cargo || 'usuario',
        status: usuario.status,
        permissoes: permissoesUsuario
      });
    }
  }, [usuario]);

  const handlePermissaoChange = (permissaoId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissoes: checked 
        ? [...prev.permissoes, permissaoId]
        : prev.permissoes.filter(p => p !== permissaoId)
    }));
  };

  const getPermissoesPorCargo = (cargo: string): string[] => {
    switch (cargo) {
      case 'admin':
        return permissoesDisponiveis.map(p => p.id);
      case 'supervisor':
        return ['dashboard', 'atendimento', 'contatos', 'usuarios', 'relatorios', 'kanban', 'chat_interno'];
      case 'agente':
        return ['dashboard', 'atendimento', 'contatos', 'kanban', 'chat_interno'];
      case 'usuario':
      default:
        return ['dashboard', 'atendimento', 'chat_interno'];
    }
  };

  const handleCargoChange = (cargo: string) => {
    const permissoesPadrao = getPermissoesPorCargo(cargo);
    setFormData(prev => ({
      ...prev,
      cargo,
      permissoes: permissoesPadrao
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usuario) {
      const usuarioEditado: Usuario = {
        ...usuario,
        nome: formData.nome,
        email: formData.email,
        setor: formData.setor,
        cargo: formData.cargo,
        status: formData.status,
        permissoes: formData.permissoes
      };

      onUsuarioEditado(usuarioEditado);
    }
  };

  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="setor">Setor</Label>
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
              <Label htmlFor="cargo">Cargo/Papel *</Label>
              <Select value={formData.cargo} onValueChange={handleCargoChange}>
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

          <div>
            <Label className="text-base font-medium">Permissões de Acesso</Label>
            <p className="text-sm text-gray-600 mb-3">
              Selecione as permissões que este usuário terá no sistema
            </p>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded p-3">
              {permissoesDisponiveis.map((permissao) => (
                <div key={permissao.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permissao.id}
                    checked={formData.permissoes.includes(permissao.id)}
                    onCheckedChange={(checked) => handlePermissaoChange(permissao.id, !!checked)}
                  />
                  <Label htmlFor={permissao.id} className="text-sm font-normal">
                    {permissao.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.nome || !formData.email}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
