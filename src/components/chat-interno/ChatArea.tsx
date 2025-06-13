
import { useState } from 'react';
import { Send, Paperclip, Smile, Menu, MoreVertical, Users, User, X, Phone, Video } from 'lucide-react';
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
      case 'online': return 'online';
      case 'ausente': return 'ausente';
      case 'offline': return 'visto por último hoje às';
      default: return 'offline';
    }
  };

  if (!conversa) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500 max-w-sm">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-light mb-4 text-gray-600">WhatsApp Business</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {showMenuButton 
              ? 'Toque no menu para ver as conversas' 
              : 'Envie e receba mensagens sem precisar manter seu telefone conectado.\n\nUse o WhatsApp em até 4 dispositivos vinculados e 1 telefone ao mesmo tempo.'
            }
          </p>
          {showMenuButton && (
            <Button 
              onClick={onOpenSidebar}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white"
            >
              <Menu className="w-4 h-4 mr-2" />
              Ver conversas
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header estilo WhatsApp */}
      <div className="bg-green-600 text-white p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {showMenuButton && (
              <Button variant="ghost" size="icon" onClick={onOpenSidebar} className="h-9 w-9 text-white hover:bg-white hover:bg-opacity-20 flex-shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {conversa.tipo === 'grupo' ? (
                  <Users className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              
              {/* Status indicator */}
              {conversa.tipo === 'individual' && conversa.participantes[0] && (
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-green-600 ${getStatusColor(conversa.participantes[0].status)}`} />
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium truncate">{conversa.nome}</h3>
              {conversa.tipo === 'individual' && conversa.participantes[0] ? (
                <p className="text-sm text-green-100">
                  {getStatusText(conversa.participantes[0].status)}
                  {conversa.participantes[0].status === 'offline' && ' 14:32'}
                </p>
              ) : (
                <p className="text-sm text-green-100">
                  {conversa.participantes.map(p => p.nome.split(' ')[0]).join(', ')}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0">
            {conversa.tipo === 'individual' && (
              <>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white hover:bg-opacity-20">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white hover:bg-opacity-20">
                  <Video className="w-5 h-5" />
                </Button>
              </>
            )}
            {onCloseConversa && showMenuButton && (
              <Button variant="ghost" size="icon" onClick={onCloseConversa} title="Voltar" className="h-9 w-9 text-white hover:bg-white hover:bg-opacity-20">
                <X className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white hover:bg-opacity-20">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Background do chat estilo WhatsApp */}
      <div 
        className="flex-1 relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#e5ddd5'
        }}
      >
        {/* Área de mensagens */}
        <ScrollArea className="h-full p-4">
          <div className="space-y-3">
            {mensagens.map((mensagem) => {
              const isOwnMessage = mensagem.autor.nome === 'Você';
              
              return (
                <div key={mensagem.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%]`}>
                    {/* Nome do autor (apenas para mensagens de outros em grupos) */}
                    {!isOwnMessage && conversa.tipo === 'grupo' && (
                      <div className="flex items-center space-x-2 mb-1 ml-2">
                        <span className="text-xs font-medium text-gray-600">{mensagem.autor.nome}</span>
                      </div>
                    )}
                    
                    {/* Balão da mensagem estilo WhatsApp */}
                    <div className={`relative px-3 py-2 rounded-lg shadow-sm ${
                      isOwnMessage 
                        ? 'bg-green-500 text-white ml-auto' 
                        : 'bg-white text-gray-900'
                    }`}>
                      {/* Pontinha do balão */}
                      <div className={`absolute top-0 w-0 h-0 ${
                        isOwnMessage 
                          ? 'right-0 transform translate-x-2 border-l-8 border-l-green-500 border-t-8 border-t-transparent'
                          : 'left-0 transform -translate-x-2 border-r-8 border-r-white border-t-8 border-t-transparent'
                      }`} />
                      
                      <p className="text-sm break-words leading-relaxed">{mensagem.texto}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1`}>
                        <p className={`text-xs ${
                          isOwnMessage ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {mensagem.tempo}
                        </p>
                        {isOwnMessage && (
                          <div className="flex space-x-1">
                            <div className="w-4 h-3 flex items-end space-x-0.5">
                              <div className="w-1 h-1 bg-green-100 rounded-full"></div>
                              <div className="w-1 h-2 bg-green-100 rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Input de mensagem estilo WhatsApp */}
      <div className="p-3 bg-gray-100 flex-shrink-0">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-gray-700 flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Digite uma mensagem"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEnviarMensagem();
                }
              }}
              className="rounded-full border-gray-300 bg-white pr-12 h-10"
              style={{ fontSize: '16px' }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleEnviarMensagem}
            disabled={!novaMensagem.trim()}
            className="bg-green-500 hover:bg-green-600 text-white h-10 w-10 rounded-full p-0 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
