
import { AtendimentoCard } from './AtendimentoCard';

interface Atendimento {
  id: number;
  cliente: string;
  telefone: string;
  ultimaMensagem: string;
  tempo: string;
  setor: string;
  agente?: string;
  tags?: string[];
  status: 'novos' | 'em-atendimento' | 'pendentes' | 'finalizados';
}

interface KanbanColumnsProps {
  atendimentos: Atendimento[];
  onSelectAtendimento: (atendimento: Atendimento) => void;
  usuarioLogado?: string;
}

export function KanbanColumns({ atendimentos, onSelectAtendimento, usuarioLogado = 'Ana Silva' }: KanbanColumnsProps) {
  // Filtrar atendimentos em andamento do usuário logado
  const atendimentosEmAndamento = atendimentos.filter(atendimento => 
    atendimento.agente === usuarioLogado && 
    (atendimento.status === 'em-atendimento' || atendimento.status === 'novos')
  );

  // Filtrar atendimentos pendentes (sem agente ou com outros agentes em status pendente)
  const atendimentosPendentes = atendimentos.filter(atendimento => 
    !atendimento.agente || 
    (atendimento.agente !== usuarioLogado && atendimento.status === 'pendentes') ||
    (atendimento.status === 'novos' && atendimento.agente !== usuarioLogado)
  );

  const colunas = [
    { 
      id: 'em-andamento', 
      titulo: 'Em Andamento', 
      cor: 'bg-green-500',
      atendimentos: atendimentosEmAndamento
    },
    { 
      id: 'pendentes', 
      titulo: 'Atendimentos Pendentes', 
      cor: 'bg-yellow-500',
      atendimentos: atendimentosPendentes
    }
  ];

  return (
    <div className="space-y-6">
      {colunas.map(coluna => (
        <div key={coluna.id} className="bg-gray-50 rounded-xl p-4">
          {/* Header da Coluna */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${coluna.cor}`} />
              <h3 className="font-semibold text-gray-900">{coluna.titulo}</h3>
            </div>
            <span className="bg-white text-gray-600 text-sm px-2 py-1 rounded-full font-medium">
              {coluna.atendimentos.length}
            </span>
          </div>

          {/* Cards da Coluna */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {coluna.atendimentos.map(atendimento => (
              <AtendimentoCard
                key={atendimento.id}
                {...atendimento}
                onClick={() => onSelectAtendimento(atendimento)}
              />
            ))}
            
            {coluna.atendimentos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Nenhum atendimento</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
