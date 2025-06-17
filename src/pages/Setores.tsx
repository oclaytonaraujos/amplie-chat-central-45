
import { useState } from 'react';
import { Building2, Edit, Trash2, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSetoresQuery } from '@/hooks/useSetoresQuery';
import { NovoSetorDialog } from '@/components/setores/NovoSetorDialog';
import { EditarSetorDialog } from '@/components/setores/EditarSetorDialog';
import { ExcluirSetorDialog } from '@/components/setores/ExcluirSetorDialog';
import { Loader2 } from 'lucide-react';
import { type SetorData } from '@/services/setoresService';

export default function Setores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [setorParaEditar, setSetorParaEditar] = useState<SetorData | null>(null);
  const [setorParaExcluir, setSetorParaExcluir] = useState<SetorData | null>(null);
  
  const { data: setores = [], isLoading, error } = useSetoresQuery();

  const filteredSetores = setores.filter(setor =>
    setor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (setor.descricao && setor.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatarData = (data: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(data));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando setores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar setores</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      {/* Header com botão de ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">Setores</h1>
          <p className="text-sm md:text-base text-gray-600 break-words">Gerencie os setores da sua empresa</p>
        </div>
        <div className="flex-shrink-0">
          <NovoSetorDialog />
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-amplie p-4 md:p-6">
        <Input
          placeholder="Pesquisar setores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-amplie p-4 md:p-6 min-w-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 break-words">Total de Setores</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{setores.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-amplie p-4 md:p-6 min-w-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 break-words">Setores Ativos</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {setores.filter(s => s.ativo).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-amplie p-4 md:p-6 min-w-0 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 break-words">Setores Inativos</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {setores.filter(s => !s.ativo).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Setores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredSetores.map((setor) => (
          <div key={setor.id} className="bg-white rounded-xl shadow-amplie p-4 md:p-6 hover:shadow-amplie-hover transition-all duration-300 min-w-0 flex flex-col">
            {/* Header do Card */}
            <div className="flex items-start justify-between mb-4 gap-2">
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" 
                  style={{ backgroundColor: setor.cor }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 break-words text-sm md:text-base leading-tight">{setor.nome}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={setor.ativo ? "default" : "secondary"} className="text-xs flex-shrink-0">
                      {setor.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSetorParaEditar(setor)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSetorParaExcluir(setor)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            {/* Capacidade */}
            <div className="mb-4 min-w-0">
              <p className="text-xs text-gray-500">Capacidade</p>
              <p className="text-sm font-medium">
                {setor.agentes_ativos}/{setor.capacidade_maxima} agentes
              </p>
            </div>

            {/* Descrição */}
            {setor.descricao && (
              <div className="mb-4 min-w-0">
                <p className="text-xs md:text-sm text-gray-600 break-words line-clamp-3 leading-relaxed">{setor.descricao}</p>
              </div>
            )}

            {/* Data de criação */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 break-words">
                Criado em {formatarData(setor.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State para busca */}
      {filteredSetores.length === 0 && setores.length > 0 && (
        <div className="bg-white rounded-xl shadow-amplie p-8 md:p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 break-words">Nenhum setor encontrado</h3>
          <p className="text-sm md:text-base text-gray-500 mb-6 break-words">Não encontramos setores com os critérios de busca.</p>
        </div>
      )}

      {/* Empty State inicial */}
      {setores.length === 0 && (
        <div className="bg-white rounded-xl shadow-amplie p-8 md:p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 break-words">Nenhum setor cadastrado</h3>
          <p className="text-sm md:text-base text-gray-500 mb-6 break-words">Comece criando o primeiro setor da sua empresa.</p>
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
