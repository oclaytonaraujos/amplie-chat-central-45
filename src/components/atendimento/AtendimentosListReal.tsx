
import { MessageSquare, User, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AtendimentoCard } from './AtendimentoCard';
import { useAtendimentoReal } from '@/hooks/useAtendimentoReal';
import { Loader2 } from 'lucide-react';

interface Atendimento {
  id: string;
  cliente: string;
  telefone: string;
  ultimaMensagem: string;
  tempo: string;
  setor: string;
  agente?: string;
  tags?: string[];
  status: 'ativo' | 'em-atendimento' | 'pendente' | 'finalizado';
  transferencia?: {
    de: string;
    motivo: string;
    dataTransferencia: string;
  };
}

interface AtendimentosListRealProps {
  onSelectAtendimento: (atendimento: Atendimento) => void;
  selectedAtendimento?: Atendimento | null;
  isMobile?: boolean;
}

export function AtendimentosListReal({ 
  onSelectAtendimento, 
  selectedAtendimento,
  isMobile = false
}: AtendimentosListRealProps) {
  const { conversas, loading } = useAtendimentoReal();

  // Transformar conversas do Supabase para o formato esperado
  const atendimentos: Atendimento[] = conversas.map(conversa => ({
    id: conversa.id,
    cliente: conversa.contatos?.nome || 'Cliente sem nome',
    telefone: conversa.contatos?.telefone || '',
    ultimaMensagem: 'Última mensagem...',
    tempo: new Date(conversa.updated_at || '').toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    setor: conversa.setor || 'Geral',
    agente: conversa.profiles?.nome,
    tags: conversa.tags || [],
    status: conversa.status as 'ativo' | 'em-atendimento' | 'pendente' | 'finalizado',
  }));

  // Filtrar por status
  const atendimentosNovos = atendimentos.filter(a => a.status === 'ativo');
  const atendimentosEmAndamento = atendimentos.filter(a => a.status === 'em-atendimento');
  const atendimentosPendentes = atendimentos.filter(a => a.status === 'pendente');

  const handleSelectAtendimento = (atendimento: Atendimento) => {
    onSelectAtendimento(atendimento);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando atendimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Novos Atendimentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
              Novos Atendimentos
            </h3>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {atendimentosNovos.length}
            </Badge>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-4 space-y-3">
            {atendimentosNovos.length > 0 ? (
              atendimentosNovos.map((atendimento) => (
                <div 
                  key={atendimento.id}
                  className={`cursor-pointer transition-all ${
                    selectedAtendimento?.id === atendimento.id 
                      ? 'ring-2 ring-green-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => handleSelectAtendimento(atendimento)}
                >
                  <AtendimentoCard {...atendimento} onClick={() => {}} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum novo atendimento</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Atendimentos em Andamento */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              Em Atendimento
            </h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {atendimentosEmAndamento.length}
            </Badge>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-4 space-y-3">
            {atendimentosEmAndamento.length > 0 ? (
              atendimentosEmAndamento.map((atendimento) => (
                <div 
                  key={atendimento.id}
                  className={`cursor-pointer transition-all ${
                    selectedAtendimento?.id === atendimento.id 
                      ? 'ring-2 ring-blue-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => handleSelectAtendimento(atendimento)}
                >
                  <AtendimentoCard {...atendimento} onClick={() => {}} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum atendimento em andamento</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Atendimentos Pendentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-orange-50">
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
                  onClick={() => handleSelectAtendimento(atendimento)}
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
