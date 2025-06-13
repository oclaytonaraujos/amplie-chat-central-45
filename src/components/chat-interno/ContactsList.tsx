
import { useState } from 'react';
import { Search, ArrowLeft, User, Users, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'ausente';
  cargo: string;
}

interface ContactsListProps {
  usuarios: Usuario[];
  onSelectContact: (usuario: Usuario) => void;
  onBack: () => void;
}

export function ContactsList({ usuarios, onSelectContact, onBack }: ContactsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'contatos' | 'grupos'>('contatos');

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header estilo WhatsApp */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 text-white hover:bg-white hover:bg-opacity-20 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-medium">Nova conversa</h2>
        </div>
        
        {/* Barra de pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar contatos..."
            className="pl-10 bg-white bg-opacity-20 border-none text-white placeholder-gray-200 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Tabs estilo WhatsApp */}
      <div className="flex bg-green-50 border-b">
        <button
          onClick={() => setActiveTab('contatos')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'contatos'
              ? 'text-green-600 border-b-2 border-green-600 bg-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Contatos
        </button>
        <button
          onClick={() => setActiveTab('grupos')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'grupos'
              ? 'text-green-600 border-b-2 border-green-600 bg-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Grupos
        </button>
      </div>

      {/* Conteúdo */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-100">
          {activeTab === 'contatos' ? (
            <>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <div
                    key={usuario.id}
                    onClick={() => onSelectContact(usuario)}
                    className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar estilo WhatsApp */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(usuario.status)}`} />
                      </div>

                      {/* Informações do usuário */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {usuario.nome}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${
                            usuario.status === 'online' ? 'text-green-700 bg-green-50 border-green-200' :
                            usuario.status === 'ausente' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }`}>
                            {getStatusText(usuario.status)}
                          </Badge>
                          <span className="text-xs text-gray-500 truncate">{usuario.cargo}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {usuario.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">
                    {searchTerm ? 'Nenhum contato encontrado' : 'Nenhum contato disponível'}
                  </p>
                </div>
              )}
            </>
          ) : (
            // Tab de grupos estilo WhatsApp
            <div>
              {/* Botão para criar novo grupo */}
              <div className="p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-gray-900">Novo grupo</h3>
                    <p className="text-sm text-gray-500">Criar um grupo com vários contatos</p>
                  </div>
                </div>
              </div>

              {/* Grupos existentes mockados */}
              <div className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-gray-900">Equipe Vendas</h3>
                    <p className="text-sm text-gray-500">Carlos, Maria, Lucia</p>
                  </div>
                </div>
              </div>

              <div className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-gray-900">Suporte Técnico</h3>
                    <p className="text-sm text-gray-500">Ana, João, +3 outros</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
