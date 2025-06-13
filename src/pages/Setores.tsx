import { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const setoresData = [
  {
    id: 1,
    nome: 'Vendas',
    agentes: 5,
    atendimentosAtivos: 12,
    cor: 'bg-blue-500'
  },
  {
    id: 2,
    nome: 'Suporte Técnico',
    agentes: 3,
    atendimentosAtivos: 8,
    cor: 'bg-green-500'
  },
  {
    id: 3,
    nome: 'Financeiro',
    agentes: 2,
    atendimentosAtivos: 4,
    cor: 'bg-yellow-500'
  },
  {
    id: 4,
    nome: 'Recursos Humanos',
    agentes: 1,
    atendimentosAtivos: 1,
    cor: 'bg-purple-500'
  }
];

export default function Setores() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSetores = setoresData.filter(setor =>
    setor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header com botão de ação */}
      <div className="flex items-center justify-end">
        <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
          <Plus className="w-4 h-4 mr-2" />
          Novo Setor
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-amplie p-6">
        <Input
          placeholder="Pesquisar setores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Setores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSetores.map((setor) => (
          <div key={setor.id} className="bg-white rounded-xl shadow-amplie p-6 hover:shadow-amplie-hover transition-all duration-300">
            {/* Header do Card */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${setor.cor} rounded-lg flex items-center justify-center`}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{setor.nome}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Agentes</span>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  {setor.agentes}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Atendimentos Ativos</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${setor.atendimentosAtivos > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {setor.atendimentosAtivos}
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Capacidade</span>
                <span>{setor.atendimentosAtivos}/20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${setor.cor} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(setor.atendimentosAtivos / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button variant="outline" className="w-full text-sm">
                Ver Detalhes
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State para busca */}
      {filteredSetores.length === 0 && (
        <div className="bg-white rounded-xl shadow-amplie p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum setor encontrado</h3>
          <p className="text-gray-500 mb-6">Não encontramos setores com os critérios de busca.</p>
          <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Setor
          </Button>
        </div>
      )}
    </div>
  );
}
