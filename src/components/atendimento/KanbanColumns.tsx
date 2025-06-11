
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
}

export function KanbanColumns({ atendimentos, onSelectAtendimento }: KanbanColumnsProps) {
  const colunas = [
    { id: 'novos', titulo: 'Novos', cor: 'bg-blue-500' },
    { id: 'em-atendimento', titulo: 'Em Atendimento', cor: 'bg-green-500' },
    { id: 'pendentes', titulo: 'Pendentes', cor: 'bg-yellow-500' },
    { id: 'finalizados', titulo: 'Finalizados', cor: 'bg-gray-500' }
  ];

  const getAtendimentosPorStatus = (status: string) => {
    return atendimentos.filter(atendimento => atendimento.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {colunas.map(coluna => {
        const atendimentosColuna = getAtendimentosPorStatus(coluna.id);
        
        return (
          <div key={coluna.id} className="bg-gray-50 rounded-xl p-4">
            {/* Header da Coluna */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${coluna.cor}`} />
                <h3 className="font-semibold text-gray-900">{coluna.titulo}</h3>
              </div>
              <span className="bg-white text-gray-600 text-sm px-2 py-1 rounded-full font-medium">
                {atendimentosColuna.length}
              </span>
            </div>

            {/* Cards da Coluna */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {atendimentosColuna.map(atendimento => (
                <AtendimentoCard
                  key={atendimento.id}
                  {...atendimento}
                  onClick={() => onSelectAtendimento(atendimento)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
