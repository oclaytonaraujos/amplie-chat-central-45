
import { useState } from 'react';
import { Search, Plus, MessageCircle, Users, User, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Usuario, Conversa } from '@/types/chat-interno';

interface ChatSidebarProps {
  conversas: Conversa[];
  conversaSelecionada: Conversa | null;
  onSelectConversa: (conversa: Conversa) => void;
  onNovaConversa: () => void;
  isMobile?: boolean;
}

export function ChatSidebar({
  conversas,
  conversaSelecionada,
  onSelectConversa,
  onNovaConversa,
  isMobile = false
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const conversasFiltradas = conversas.filter(conversa =>
    conversa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversa.ultimaMensagem?.texto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'ausente': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header estilo WhatsApp */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Conversas</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={onNovaConversa}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-none h-9 w-9 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-none h-9 w-9 p-0"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Barra de pesquisa estilo WhatsApp */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar ou iniciar nova conversa"
            className="pl-10 bg-white bg-opacity-20 border-none text-white placeholder-gray-200 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de conversas estilo WhatsApp */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-100">
          {conversasFiltradas.length > 0 ? (
            conversasFiltradas.map((conversa) => (
              <div
                key={conversa.id}
                onClick={() => onSelectConversa(conversa)}
                className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  conversaSelecionada?.id === conversa.id
                    ? 'bg-green-50 border-r-4 border-green-500'
                    : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar estilo WhatsApp */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      {conversa.tipo === 'grupo' ? (
                        <Users className="w-6 h-6 text-white" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    {/* Status indicator para conversas individuais */}
                    {conversa.tipo === 'individual' && conversa.participantes[0] && (
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(conversa.participantes[0].status)}`} />
                    )}
                  </div>

                  {/* Conteúdo da conversa estilo WhatsApp */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {conversa.nome}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {conversa.ultimaMensagem && (
                          <span className="text-xs text-gray-500">
                            {conversa.ultimaMensagem.tempo}
                          </span>
                        )}
                        {conversa.mensagensNaoLidas > 0 && (
                          <Badge className="bg-green-500 text-white text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                            {conversa.mensagensNaoLidas > 99 ? '99+' : conversa.mensagensNaoLidas}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {conversa.ultimaMensagem && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversa.ultimaMensagem.texto}
                      </p>
                    )}
                    
                    {/* Participantes do grupo */}
                    {conversa.tipo === 'grupo' && (
                      <p className="text-xs text-gray-400 mt-1">
                        {conversa.participantes.length} participantes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </p>
              {!searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNovaConversa}
                  className="mt-3 text-green-600 hover:text-green-700"
                >
                  Iniciar nova conversa
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
