
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PermissaoItem {
  id: string;
  nome: string;
  descricao: string;
}

const permissoesDisponiveis: PermissaoItem[] = [
  { id: 'gerenciar_usuarios', nome: 'Gerenciar Usuários', descricao: 'Criar, editar e excluir usuários' },
  { id: 'gerenciar_contatos', nome: 'Gerenciar Contatos', descricao: 'Criar, editar e excluir contatos' },
  { id: 'gerenciar_conversas', nome: 'Gerenciar Conversas', descricao: 'Visualizar e gerenciar todas as conversas' },
  { id: 'gerenciar_setores', nome: 'Gerenciar Setores', descricao: 'Criar, editar e excluir setores' },
  { id: 'visualizar_relatorios', nome: 'Visualizar Relatórios', descricao: 'Acessar relatórios e análises' },
  { id: 'gerenciar_whatsapp', nome: 'Gerenciar WhatsApp', descricao: 'Configurar conexões do WhatsApp' },
  { id: 'usar_chatbot', nome: 'Usar ChatBot', descricao: 'Configurar e usar recursos de chatbot' },
  { id: 'transferir_conversas', nome: 'Transferir Conversas', descricao: 'Transferir conversas entre agentes' },
];

interface PermissoesSelectorProps {
  permissoesSelecionadas: string[];
  onPermissoesChange: (permissoes: string[]) => void;
}

export function PermissoesSelector({ permissoesSelecionadas, onPermissoesChange }: PermissoesSelectorProps) {
  const handlePermissaoChange = (permissaoId: string, checked: boolean) => {
    if (checked) {
      onPermissoesChange([...permissoesSelecionadas, permissaoId]);
    } else {
      onPermissoesChange(permissoesSelecionadas.filter(p => p !== permissaoId));
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Permissões</Label>
      <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
        {permissoesDisponiveis.map((permissao) => (
          <div key={permissao.id} className="flex items-start space-x-3">
            <Checkbox
              id={permissao.id}
              checked={permissoesSelecionadas.includes(permissao.id)}
              onCheckedChange={(checked) => handlePermissaoChange(permissao.id, !!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={permissao.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permissao.nome}
              </Label>
              <p className="text-xs text-muted-foreground">
                {permissao.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
