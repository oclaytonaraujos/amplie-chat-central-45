
import { useState } from 'react';
import { Send, Paperclip, Smile, Menu, MoreVertical, Users, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'ausente';
  cargo: string;
}

interface Conversa {
  id: number;
  tipo: 'individual' | 'grupo';
  nome: string;
  participantes: Usuario[];
  ultimaMensagem?: {
    texto: string;
    autor: string;
    tempo: string;
  };
  mensagensNaoLidas: number;
  avatar?: string;
}

interface Mensagem {
  id: number;
  texto: string;
  autor: Usuario;
  tempo: string;
  tipo: 'texto' | 'imagem' | 'documento' | 'audio';
  anexo?: {
    nome: string;
    url: string;
    tamanho?: string;
  };
}

interface ChatAreaProps {
  conversa: Conversa | null;
  mensagens: Mensagem[];
  onSendMessage: (texto: string) => void;
  onOpenSidebar?: () => void;
  onCloseConversa?: () => void;
  showMenuButton?: boolean;
}

export function ChatArea({
  conversa,
  mensagens,
  onSendMessage,
  onOpenSidebar,
  onCloseConversa,
  showMenuButton = false
}: ChatAreaProps) {
  const [novaMensagem, setNovaMensagem] = useState('');

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;
    onSendMessage(novaMensagem);
    setNovaMensagem('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'ausente': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'ausente': return 'Ausente';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  if (!conversa) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
          <p className="text-sm">Escolha uma conversa existente ou inicie uma nova para começar a conversar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header da conversa */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showMenuButton && (
              <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
                <Menu className="w-5 h-5" />
              </Button>
            )}
            
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                {conversa.tipo === 'grupo' ? (
                  <Users className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              
              {/* Status indicator para conversas individuais */}
              {conversa.tipo === 'individual' && conversa.participantes[0] && (
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversa.participantes[0].status)}`} />
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">{conversa.nome}</h3>
              {conversa.tipo === 'individual' && conversa.participantes[0] ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={`text-xs ${
                    conversa.participantes[0].status === 'online' ? 'text-green-700 bg-green-50 border-green-200' :
                    conversa.participantes[0].status === 'ausente' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                    'text-gray-600 bg-gray-50 border-gray-200'
                  }`}>
                    {getStatusText(conversa.participantes[0].status)}
                  </Badge>
                  <span className="text-xs text-gray-500">{conversa.participantes[0].cargo}</span>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {conversa.participantes.length} participantes
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onCloseConversa && (
              <Button variant="ghost" size="icon" onClick={onCloseConversa} title="Fechar conversa">
                <X className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área de mensagens */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.map((mensagem) => {
            const isOwnMessage = mensagem.autor.nome === 'Você';
            
            return (
              <div key={mensagem.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {/* Avatar e nome (apenas para mensagens de outros) */}
                  {!isOwnMessage && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{mensagem.autor.nome}</span>
                    </div>
                  )}
                  
                  {/* Balão da mensagem */}
                  <div className={`px-4 py-2 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{mensagem.texto}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {mensagem.tempo}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input de mensagem */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem..."
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEnviarMensagem();
                }
              }}
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 hidden sm:flex"
            >
              <Smile className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
          
          <Button
            onClick={handleEnviarMensagem}
            disabled={!novaMensagem.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
