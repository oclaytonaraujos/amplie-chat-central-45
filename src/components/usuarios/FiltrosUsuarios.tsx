
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface FiltrosUsuariosProps {
  onFiltrosChange: (filtros: any) => void;
}

const setoresDisponiveis = ['Vendas', 'Suporte', 'Marketing', 'Financeiro', 'RH'];
const papeisDisponiveis = ['Agente', 'Supervisor', 'Gerente', 'Admin'];
const statusDisponiveis = ['Ativo', 'Inativo'];

export function FiltrosUsuarios({ onFiltrosChange }: FiltrosUsuariosProps) {
  const [filtros, setFiltros] = useState({
    setor: '',
    papel: '',
    status: ''
  });

  const aplicarFiltro = (campo: string, valor: string) => {
    // Convert "all" values back to empty strings for filtering logic
    const valorFiltro = valor === 'all' ? '' : valor;
    const novosFiltros = { ...filtros, [campo]: valorFiltro };
    setFiltros(novosFiltros);
    onFiltrosChange(novosFiltros);
  };

  const removerFiltro = (campo: string) => {
    const novosFiltros = { ...filtros, [campo]: '' };
    setFiltros(novosFiltros);
    onFiltrosChange(novosFiltros);
  };

  const limparTodosFiltros = () => {
    const filtrosLimpos = { setor: '', papel: '', status: '' };
    setFiltros(filtrosLimpos);
    onFiltrosChange(filtrosLimpos);
  };

  const filtrosAtivos = Object.entries(filtros).filter(([_, valor]) => valor !== '');

  return (
    <div className="bg-white rounded-xl shadow-amplie p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="font-medium text-gray-700">Filtros</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Select value={filtros.setor || 'all'} onValueChange={(value) => aplicarFiltro('setor', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os setores</SelectItem>
              {setoresDisponiveis.map(setor => (
                <SelectItem key={setor} value={setor}>{setor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={filtros.papel || 'all'} onValueChange={(value) => aplicarFiltro('papel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              {papeisDisponiveis.map(papel => (
                <SelectItem key={papel} value={papel}>{papel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={filtros.status || 'all'} onValueChange={(value) => aplicarFiltro('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {statusDisponiveis.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtrosAtivos.length > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-gray-500">Filtros ativos:</span>
          {filtrosAtivos.map(([campo, valor]) => (
            <Badge key={campo} variant="secondary" className="flex items-center space-x-1">
              <span>{campo}: {valor}</span>
              <button
                onClick={() => removerFiltro(campo)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={limparTodosFiltros}>
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
