
import { MessageSquare, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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

interface AtendimentosListProps {
  atendimentos: Atendimento[];
  onSelectAtendimento: (atendimento: Atendimento) => void;
  selectedAtendimento?: Atendimento | null;
}

export function AtendimentosList({ 
  atendimentos, 
  onSelectAtendimento, 
  selectedAtendimento 
}: AtendimentosListProps) {
  const atendimentosAbertos = atendimentos.filter(a => a.status === 'novos' || a.status === 'em-atendimento');
  const atendimentosPendentes = atendimentos.filter(a => a.status === 'pendentes');

  return (
    <div className="space-y-6">
      {/* Mensagens em Aberto */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
              Mensagens em Aberto
            </h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {atendimentosAbertos.length}
            </Badge>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-4 space-y-3">
            {atendimentosAbertos.length > 0 ? (
              atendimentosAbertos.map((atendimento) => (
                <div 
                  key={atendimento.id}
                  className={`cursor-pointer transition-all ${
                    selectedAtendimento?.id === atendimento.id 
                      ? 'ring-2 ring-blue-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => onSelectAtendimento(atendimento)}
                >
                  <AtendimentoCard {...atendimento} onClick={() => {}} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma mensagem em aberto</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Atendimentos Pendentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              Atendimentos Pendentes
            </h3>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {atendimentosPendentes.length}
            </Badge>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-4 space-y-3">
            {atendimentosPendentes.length > 0 ? (
              atendimentosPendentes.map((atendimento) => (
                <div 
                  key={atendimento.id}
                  className={`cursor-pointer transition-all ${
                    selectedAtendimento?.id === atendimento.id 
                      ? 'ring-2 ring-orange-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => onSelectAtendimento(atendimento)}
                >
                  <AtendimentoCard {...atendimento} onClick={() => {}} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum atendimento pendente</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
