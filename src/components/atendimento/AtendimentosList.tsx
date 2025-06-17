
import { Clock, MessageCircle, User, Tag, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  tempoAberto?: string;
  transferencia?: {
    de: string;
    motivo: string;
    dataTransferencia: string;
  };
}

interface AtendimentosListProps {
  atendimentos: Atendimento[];
  onSelectAtendimento: (atendimento: Atendimento) => void;
  selectedAtendimento?: Atendimento | null;
  isMobile?: boolean;
}

export function AtendimentosList({ 
  atendimentos, 
  onSelectAtendimento, 
  selectedAtendimento,
  isMobile = false 
}: AtendimentosListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novos': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em-atendimento': return 'bg-green-100 text-green-800 border-green-200';
      case 'aguardando-cliente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'finalizados': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'novos': return 'Novo';
      case 'em-atendimento': return 'Em Atendimento';
      case 'aguardando-cliente': return 'Aguardando Cliente';
      case 'finalizados': return 'Finalizado';
      default: return status;
    }
  };

  const getPriorityIcon = (tags: string[] = []) => {
    if (tags.includes('Urgente') || tags.includes('urgente')) {
      return '🔴';
    }
    return '';
  };

  if (atendimentos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-amplie p-8 text-center">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum atendimento encontrado</h3>
        <p className="text-sm text-gray-500">
          Não há atendimentos no momento. Novos atendimentos aparecerão aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-amplie overflow-hidden">
      <ScrollArea className="h-full max-h-[600px]">
        <div className="divide-y divide-gray-100">
          {atendimentos.map((atendimento) => (
            <div
              key={atendimento.id}
              onClick={() => onSelectAtendimento(atendimento)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedAtendimento?.id === atendimento.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
              }`}
            >
              {/* Cabeçalho com cliente e status */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {getPriorityIcon(atendimento.tags)} {atendimento.cliente}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{atendimento.telefone}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                  <Badge variant="outline" className={`text-xs ${getStatusColor(atendimento.status)}`}>
                    {getStatusText(atendimento.status)}
                  </Badge>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {atendimento.tempo}
                  </span>
                </div>
              </div>

              {/* Alerta de transferência se houver */}
              {atendimento.transferencia && (
                <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-800">
                      Transferido por {atendimento.transferencia.de}
                    </span>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">{atendimento.transferencia.motivo}</p>
                </div>
              )}

              {/* Última mensagem */}
              <div className="mb-3">
                <p className="text-sm text-gray-700 line-clamp-2">{atendimento.ultimaMensagem}</p>
              </div>

              {/* Footer com informações adicionais */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {atendimento.setor}
                  </span>
                  {atendimento.agente && (
                    <span>Agente: {atendimento.agente}</span>
                  )}
                  {atendimento.tempoAberto && (
                    <span>Aberto: {atendimento.tempoAberto}</span>
                  )}
                </div>
                
                {/* Tags */}
                {atendimento.tags && atendimento.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>{atendimento.tags.slice(0, 2).join(', ')}</span>
                    {atendimento.tags.length > 2 && <span>+{atendimento.tags.length - 2}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
