
import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAtendimentoReal } from '@/hooks/useAtendimentoReal';
import { useToast } from '@/hooks/use-toast';

interface ChatWhatsAppRealProps {
  conversaId: string;
  nomeCliente: string;
  telefoneCliente: string;
}

interface Mensagem {
  id: string;
  conteudo: string;
  created_at: string | null;
  remetente_tipo: string;
  remetente_nome: string | null;
}

export function ChatWhatsAppReal({ 
  conversaId, 
  nomeCliente, 
  telefoneCliente 
}: ChatWhatsAppRealProps) {
  const [novaMensagem, setNovaMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { 
    mensagensConversa, 
    loadMensagensConversa, 
    enviarMensagem,
    atualizarStatusConversa 
  } = useAtendimentoReal();

  const mensagens = mensagensConversa[conversaId] || [];

  // Carregar mensagens da conversa quando o componente monta
  useEffect(() => {
    if (conversaId) {
      loadMensagensConversa(conversaId);
      // Marcar conversa como "em-atendimento" quando abrir
      atualizarStatusConversa(conversaId, 'em-atendimento');
    }
  }, [conversaId]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaMensagem.trim() || enviando) return;

    setEnviando(true);
    
    try {
      const sucesso = await enviarMensagem(conversaId, novaMensagem.trim());
      
      if (sucesso) {
        setNovaMensagem('');
        toast({
          title: "Mensagem enviada",
          description: "Mensagem enviada com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const formatarHorario = (dataString: string | null) => {
    if (!dataString) return '';
    return new Date(dataString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header do Chat */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {nomeCliente.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{nomeCliente}</h3>
            <p className="text-sm text-gray-500">{telefoneCliente}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma mensagem ainda.</p>
              <p className="text-xs mt-1">Envie uma mensagem para iniciar a conversa.</p>
            </div>
          ) : (
            mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex ${
                  mensagem.remetente_tipo === 'agente' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    mensagem.remetente_tipo === 'agente'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{mensagem.conteudo}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${
                      mensagem.remetente_tipo === 'agente' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {mensagem.remetente_nome}
                    </span>
                    <span className={`text-xs ${
                      mensagem.remetente_tipo === 'agente' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatarHorario(mensagem.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Área de Digitação */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleEnviarMensagem} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={enviando}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={!novaMensagem.trim() || enviando}
            className="flex-shrink-0 bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
