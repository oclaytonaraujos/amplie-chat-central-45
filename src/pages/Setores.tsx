
import { useState } from 'react';
import { Building2, Edit, Trash2, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSetores, type Setor } from '@/hooks/useSetores';
import { NovoSetorDialog } from '@/components/setores/NovoSetorDialog';
import { EditarSetorDialog } from '@/components/setores/EditarSetorDialog';
import { ExcluirSetorDialog } from '@/components/setores/ExcluirSetorDialog';

export default function Setores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [setorParaEditar, setSetorParaEditar] = useState<Setor | null>(null);
  const [setorParaExcluir, setSetorParaExcluir] = useState<Setor | null>(null);
  const { setores } = useSetores();

  const filteredSetores = setores.filter(setor =>
    setor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (setor.descricao && setor.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com botão de ação */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Setores</h1>
          <p className="text-gray-600">Gerencie os setores da sua empresa</p>
        </div>
        <NovoSetorDialog />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-amplie p-6">
        <Input
          placeholder="Pesquisar setores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-amplie p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Setores</p>
              <p className="text-2xl font-bold text-gray-900">{setores.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-amplie p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Agentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {setores.reduce((total, setor) => total + setor.agentes, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-amplie p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Atendimentos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {setores.reduce((total, setor) => total + setor.atendimentosAtivos, 0)}
              </p>
            </div>
          </div>
        </div>
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
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{setor.nome}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant={setor.ativo ? "default" : "secondary"} className="text-xs">
                      {setor.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSetorParaEditar(setor)}
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSetorParaExcluir(setor)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            {/* Descrição */}
            {setor.descricao && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{setor.descricao}</p>
            )}

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
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Atendimentos</span>
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
                <span>{setor.atendimentosAtivos}/{setor.capacidadeMaxima}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${setor.cor} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min((setor.atendimentosAtivos / setor.capacidadeMaxima) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Data de criação */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Criado em {formatarData(setor.criadoEm)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State para busca */}
      {filteredSetores.length === 0 && setores.length > 0 && (
        <div className="bg-white rounded-xl shadow-amplie p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum setor encontrado</h3>
          <p className="text-gray-500 mb-6">Não encontramos setores com os critérios de busca.</p>
        </div>
      )}

      {/* Empty State inicial */}
      {setores.length === 0 && (
        <div className="bg-white rounded-xl shadow-amplie p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum setor cadastrado</h3>
          <p className="text-gray-500 mb-6">Comece criando o primeiro setor da sua empresa.</p>
          <NovoSetorDialog />
        </div>
      )}

      {/* Dialogs */}
      {setorParaEditar && (
        <EditarSetorDialog
          setor={setorParaEditar}
          open={!!setorParaEditar}
          onOpenChange={(open) => !open && setSetorParaEditar(null)}
        />
      )}

      <ExcluirSetorDialog
        setor={setorParaExcluir}
        open={!!setorParaExcluir}
        onOpenChange={(open) => !open && setSetorParaExcluir(null)}
      />
    </div>
  );
}
