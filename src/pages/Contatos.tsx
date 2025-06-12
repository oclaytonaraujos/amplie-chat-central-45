
import { useState } from 'react';
import { UserCheck, Search, Filter, Eye, MessageSquare, Edit, Trash2, Plus, Tag, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContatoDetalhes } from '@/components/contatos/ContatoDetalhes';
import { NovoContatoDialog } from '@/components/contatos/NovoContatoDialog';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  ultimoAtendente: string;
  setorUltimoAtendimento: string;
  dataUltimaInteracao: string;
  tags: string[];
  status: 'ativo' | 'inativo' | 'bloqueado';
  totalAtendimentos: number;
  atendentesAssociados: {
    setor: string;
    atendente: string;
  }[];
}

// Dados mock para demonstração
const contatosMock: Contato[] = [
  {
    id: 1,
    nome: 'João Silva',
    telefone: '+55 11 99999-9999',
    email: 'joao@email.com',
    ultimoAtendente: 'Ana Silva',
    setorUltimoAtendimento: 'Vendas',
    dataUltimaInteracao: '2024-06-12 14:30',
    tags: ['VIP', 'Interessado'],
    status: 'ativo',
    totalAtendimentos: 5,
    atendentesAssociados: [
      {
        setor: 'Vendas',
        atendente: 'Ana Silva'
      },
      {
        setor: 'Suporte',
        atendente: 'Carlos Santos'
      }
    ]
  },
  {
    id: 2,
    nome: 'Maria Santos',
    telefone: '+55 11 88888-8888',
    email: 'maria@email.com',
    ultimoAtendente: 'Carlos Santos',
    setorUltimoAtendimento: 'Suporte',
    dataUltimaInteracao: '2024-06-12 13:15',
    tags: ['Problema Recorrente'],
    status: 'ativo',
    totalAtendimentos: 12,
    atendentesAssociados: [
      {
        setor: 'Suporte',
        atendente: 'Carlos Santos'
      }
    ]
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    telefone: '+55 11 77777-7777',
    ultimoAtendente: 'Ana Silva',
    setorUltimoAtendimento: 'Vendas',
    dataUltimaInteracao: '2024-06-12 12:00',
    tags: ['Novo Contato'],
    status: 'ativo',
    totalAtendimentos: 1,
    atendentesAssociados: [
      {
        setor: 'Vendas',
        atendente: 'Ana Silva'
      }
    ]
  }
];

const setores = ['Todos', 'Vendas', 'Suporte', 'Financeiro', 'Técnico'];
const todasTags = ['VIP', 'Interessado', 'Problema Recorrente', 'Novo Contato'];

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>(contatosMock);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'meus'>('todos');
  const [pesquisa, setPesquisa] = useState('');
  const [setorSelecionado, setSetorSelecionado] = useState('Todos');
  const [tagSelecionada, setTagSelecionada] = useState('Todas');
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
  const [showNovoContato, setShowNovoContato] = useState(false);
  const [usuarioLogado] = useState('Ana Silva'); // Mock do usuário logado

  // Filtrar contatos baseado nos critérios
  const contatosFiltrados = contatos.filter(contato => {
    // Filtro de tipo (todos/meus)
    if (filtroTipo === 'meus') {
      const temAssociacao = contato.atendentesAssociados.some(assoc => assoc.atendente === usuarioLogado);
      if (!temAssociacao) return false;
    }

    // Filtro de pesquisa
    if (pesquisa) {
      const termoPesquisa = pesquisa.toLowerCase();
      if (
        !contato.nome.toLowerCase().includes(termoPesquisa) &&
        !contato.telefone.includes(termoPesquisa) &&
        !contato.email?.toLowerCase().includes(termoPesquisa)
      ) {
        return false;
      }
    }

    // Filtro de setor
    if (setorSelecionado !== 'Todos' && contato.setorUltimoAtendimento !== setorSelecionado) {
      return false;
    }

    // Filtro de tag
    if (tagSelecionada !== 'Todas' && !contato.tags.includes(tagSelecionada)) {
      return false;
    }

    // Filtro de status
    if (statusSelecionado !== 'Todos' && contato.status !== statusSelecionado) {
      return false;
    }

    return true;
  });

  const handleIniciarConversa = (contato: Contato) => {
    console.log('Iniciando conversa com:', contato.nome);
    // Implementar navegação para chat
  };

  const handleEditarContato = (contato: Contato) => {
    console.log('Editando contato:', contato.nome);
    // Implementar edição
  };

  const handleExcluirContato = (contatoId: number) => {
    setContatos(prev => prev.filter(c => c.id !== contatoId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'bloqueado':
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const abrirCadastroContato = (contato: Contato) => {
    setContatoSelecionado(contato);
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contatos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Contatos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contatos.filter(c => c.atendentesAssociados.some(a => a.atendente === usuarioLogado)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contatos Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contatos.filter(c => c.status === 'ativo').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtro Todos/Meus Contatos */}
          <div className="flex space-x-2">
            <Button
              variant={filtroTipo === 'todos' ? 'default' : 'outline'}
              onClick={() => setFiltroTipo('todos')}
              className="flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Todos os Contatos</span>
            </Button>
            <Button
              variant={filtroTipo === 'meus' ? 'default' : 'outline'}
              onClick={() => setFiltroTipo('meus')}
              className="flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Meus Contatos</span>
            </Button>
          </div>

          {/* Barra de pesquisa e filtros adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar por nome, telefone ou email..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={setorSelecionado} onValueChange={setSetorSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por setor" />
              </SelectTrigger>
              <SelectContent>
                {setores.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tagSelecionada} onValueChange={setTagSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as Tags</SelectItem>
                {todasTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusSelecionado} onValueChange={setStatusSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setShowNovoContato(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contato
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de contatos */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contato</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Último Atendente</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Última Interação</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contatosFiltrados.map((contato) => (
                <TableRow key={contato.id} className="cursor-pointer hover:bg-muted/50" onClick={() => abrirCadastroContato(contato)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contato.nome}</div>
                      <div className="text-sm text-gray-500">
                        {contato.totalAtendimentos} atendimentos
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{contato.telefone}</span>
                      </div>
                      {contato.email && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{contato.email}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{contato.ultimoAtendente}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{contato.setorUltimoAtendimento}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{new Date(contato.dataUltimaInteracao).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contato.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(contato.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" onClick={() => setContatoSelecionado(contato)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleIniciarConversa(contato)}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditarContato(contato)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleExcluirContato(contato.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {contatosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum contato encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalhes do contato */}
      {contatoSelecionado && (
        <Dialog open={!!contatoSelecionado} onOpenChange={() => setContatoSelecionado(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastro do Contato</DialogTitle>
            </DialogHeader>
            <ContatoDetalhes
              contato={contatoSelecionado}
              onClose={() => setContatoSelecionado(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de novo contato */}
      <NovoContatoDialog
        open={showNovoContato}
        onOpenChange={setShowNovoContato}
        onContatoAdicionado={(novoContato) => {
          setContatos(prev => [...prev, {
            ...novoContato,
            id: prev.length + 1
          }]);
        }}
      />
    </div>
  );
}
