
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FilterBar() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar contato ou mensagem..."
            className="pl-10"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="novos">Novos</SelectItem>
              <SelectItem value="em-atendimento">Em Atendimento</SelectItem>
              <SelectItem value="pendentes">Pendentes</SelectItem>
              <SelectItem value="finalizados">Finalizados</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ana">Ana Silva</SelectItem>
              <SelectItem value="carlos">Carlos Santos</SelectItem>
              <SelectItem value="maria">Maria Costa</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="suporte">Suporte</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="reclamacao">Reclamação</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
