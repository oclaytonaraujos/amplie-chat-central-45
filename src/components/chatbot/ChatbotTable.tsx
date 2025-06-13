
import { Bot, Edit, Trash2, Power, PowerOff, MessageCircle, ArrowRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Chatbot {
  id: number;
  nome: string;
  status: string;
  ultimaEdicao: string;
  interacoes: number;
  transferencias: number;
}

interface ChatbotTableProps {
  chatbots: Chatbot[];
  onEdit: (chatbot: Chatbot) => void;
  onDuplicate: (chatbotId: number) => void;
  onToggleStatus: (chatbotId: number) => void;
  onDelete: (chatbotId: number) => void;
}

export function ChatbotTable({ chatbots, onEdit, onDuplicate, onToggleStatus, onDelete }: ChatbotTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-amplie overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fluxo</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Última Edição</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Métricas</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {chatbots.map((chatbot) => (
              <tr key={chatbot.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{chatbot.nome}</p>
                      <p className="text-sm text-gray-500">ID: #{chatbot.id.toString().padStart(3, '0')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={chatbot.status === 'Ativo' ? 'default' : 'secondary'}
                    className={chatbot.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {chatbot.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{chatbot.ultimaEdicao}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{chatbot.interacoes} interações</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{chatbot.transferencias} transferências</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onToggleStatus(chatbot.id)}
                      className={chatbot.status === 'Ativo' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {chatbot.status === 'Ativo' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(chatbot)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(chatbot.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onDelete(chatbot.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
