
import { KanbanBoard } from '@/components/kanban/KanbanBoard';

interface Atendimento {
  id: number;
  cliente: string;
  telefone: string;
  ultimaMensagem: string;
  tempo: string;
  setor: string;
  agente?: string;
  tags?: string[];
  status: 'novos' | 'em-atendimento' | 'aguardando-cliente' | 'finalizados';
}

interface KanbanColumnsProps {
  atendimentos: Atendimento[];
  onSelectAtendimento: (atendimento: Atendimento) => void;
  usuarioLogado?: string;
}

// Mapear status antigo para novo
const mapearStatus = (status: string) => {
  switch (status) {
    case 'pendentes': return 'aguardando-cliente';
    default: return status;
  }
};

export function KanbanColumns({ atendimentos, onSelectAtendimento, usuarioLogado = 'Ana Silva' }: KanbanColumnsProps) {
  // Converter atendimentos para o novo formato
  const atendimentosConvertidos = atendimentos.map(a => ({
    ...a,
    status: mapearStatus(a.status) as 'novos' | 'em-atendimento' | 'aguardando-cliente' | 'finalizados',
    tempoAberto: a.tempo // Usar o tempo existente como tempo em aberto
  }));

  return (
    <KanbanBoard
      atendimentos={atendimentosConvertidos}
      onSelectAtendimento={onSelectAtendimento}
      usuarioLogado={usuarioLogado}
      isAdmin={false}
    />
  );
}
