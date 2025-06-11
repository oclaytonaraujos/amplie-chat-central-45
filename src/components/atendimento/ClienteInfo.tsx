
import { User, Phone, Clock, Tag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ClienteInfoProps {
  cliente: {
    id: number;
    nome: string;
    telefone: string;
    email?: string;
    dataCadastro?: string;
    tags?: string[];
    historico?: {
      id: number;
      data: string;
      assunto: string;
      status: string;
    }[];
  };
}

export function ClienteInfo({ cliente }: ClienteInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header com info do cliente */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h3 className="font-medium text-lg text-gray-900">{cliente.nome}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Phone className="w-3.5 h-3.5" />
              <span>{cliente.telefone}</span>
            </div>
            
            {cliente.email && (
              <p className="text-sm text-gray-500 mt-1">{cliente.email}</p>
            )}
          </div>
        </div>
        
        {cliente.dataCadastro && (
          <div className="flex items-center mt-3 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 mr-2" />
            Cliente desde {cliente.dataCadastro}
          </div>
        )}
        
        {cliente.tags && cliente.tags.length > 0 && (
          <div className="flex items-center mt-3 space-x-2">
            <Tag className="w-3.5 h-3.5 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {cliente.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Histórico de Atendimentos */}
      {cliente.historico && cliente.historico.length > 0 && (
        <div>
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">Histórico de Atendimentos</h4>
          </div>
          
          <ScrollArea className="h-[280px]">
            <div className="divide-y divide-gray-100">
              {cliente.historico.map((item) => (
                <div key={item.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{item.assunto}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        item.status === 'Resolvido' ? 'bg-green-50 text-green-700 border-green-100' :
                        item.status === 'Pendente' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.data}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
