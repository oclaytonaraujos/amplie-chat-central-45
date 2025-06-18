
import { KanbanBoard } from '@/components/kanban/KanbanBoard';

interface Atendimento {
  id: string;
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

export function KanbanColumns({ atendimentos, onSelectAtendimento, usuarioLogado = 'Ana Silva' }: KanbanColumnsProps) {
  // Converter atendimentos para o formato esperado pelo KanbanBoard
  const atendimentosConvertidos = atendimentos.map(a => ({
    ...a,
    id: parseInt(a.id), // Converter string para number se necessário
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
