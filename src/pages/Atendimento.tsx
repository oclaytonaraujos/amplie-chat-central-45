
import { MessageSquare, Clock, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const conversas = [
  {
    id: 1,
    cliente: 'João Silva',
    telefone: '+55 11 99999-9999',
    status: 'Em Atendimento',
    ultimaMensagem: 'Preciso de ajuda com meu pedido',
    tempo: '5 min',
    agente: 'Ana Silva'
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    telefone: '+55 11 88888-8888',
    status: 'Aguardando',
    ultimaMensagem: 'Olá, gostaria de mais informações',
    tempo: '12 min',
    agente: null
  }
];

const mensagens = [
  { id: 1, texto: 'Olá! Preciso de ajuda com meu pedido #12345', autor: 'cliente', tempo: '14:30' },
  { id: 2, texto: 'Olá João! Claro, vou verificar seu pedido. Um momento por favor.', autor: 'agente', tempo: '14:31' },
  { id: 3, texto: 'Seu pedido está sendo preparado e será enviado hoje.', autor: 'agente', tempo: '14:32' },
  { id: 4, texto: 'Perfeito! Muito obrigado pelo atendimento.', autor: 'cliente', tempo: '14:33' }
];

export default function Atendimento() {
  return (
    <div className="p-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Central de Atendimento</h2>
          <p className="text-gray-600">Gerencie as conversas em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Lista de Conversas */}
        <div className="bg-white rounded-xl shadow-amplie overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Minhas Conversas</h3>
          </div>
          <div className="overflow-y-auto h-full">
            {conversas.map((conversa) => (
              <div key={conversa.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{conversa.cliente}</p>
                    <p className="text-sm text-gray-500">{conversa.telefone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={conversa.status === 'Em Atendimento' ? 'default' : 'secondary'}
                      className={conversa.status === 'Em Atendimento' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {conversa.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{conversa.ultimaMensagem}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{conversa.tempo}</span>
                  </div>
                  {conversa.agente && (
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{conversa.agente}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-amplie flex flex-col">
          {/* Header do Chat */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">João Silva</p>
                  <p className="text-sm text-gray-500">+55 11 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Transferir
                </Button>
                <Button variant="outline" size="sm">
                  Finalizar
                </Button>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {mensagens.map((mensagem) => (
              <div key={mensagem.id} className={`flex ${mensagem.autor === 'agente' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  mensagem.autor === 'agente' 
                    ? 'bg-amplie-primary text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{mensagem.texto}</p>
                  <p className={`text-xs mt-1 ${mensagem.autor === 'agente' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {mensagem.tempo}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
