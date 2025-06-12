
import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanFilters } from '@/components/kanban/KanbanFilters';

// Dados de exemplo expandidos com mais departamentos e status
const atendimentosKanban = [
  {
    id: 1,
    cliente: 'João Silva',
    telefone: '+55 11 99999-9999',
    ultimaMensagem: 'Preciso de ajuda com meu pedido #12345',
    tempo: '5 min',
    setor: 'Suporte',
    agente: 'Ana Silva',
    tags: ['Pedido', 'Urgente'],
    status: 'em-atendimento' as const,
    tempoAberto: '25 min'
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    telefone: '+55 11 88888-8888',
    ultimaMensagem: 'Gostaria de mais informações sobre o plano premium',
    tempo: '12 min',
    setor: 'Vendas',
    tags: ['Novo Cliente'],
    status: 'novos' as const,
    tempoAberto: '12 min'
  },
  {
    id: 3,
    cliente: 'Pedro Almeida',
    telefone: '+55 11 77777-7777',
    ultimaMensagem: 'Aguardando retorno sobre orçamento',
    tempo: '30 min',
    setor: 'Vendas',
    agente: 'Carlos Oliveira',
    status: 'aguardando-cliente' as const,
    tempoAberto: '2 horas'
  },
  {
    id: 4,
    cliente: 'Ana Pereira',
    telefone: '+55 11 66666-6666',
    ultimaMensagem: 'O problema foi resolvido, muito obrigado!',
    tempo: '1 hora',
    setor: 'Suporte',
    agente: 'Marcos Silva',
    status: 'finalizados' as const,
    tempoAberto: '45 min'
  },
  {
    id: 5,
    cliente: 'Roberto Gomes',
    telefone: '+55 11 55555-5555',
    ultimaMensagem: 'Preciso trocar o produto que comprei',
    tempo: '2 min',
    setor: 'Suporte',
    tags: ['Troca', 'Urgente'],
    status: 'novos' as const,
    tempoAberto: '2 min'
  },
  {
    id: 6,
    cliente: 'Fernanda Lima',
    telefone: '+55 11 44444-4444',
    ultimaMensagem: 'Vou analisar a proposta e retorno amanhã',
    tempo: '3 horas',
    setor: 'Financeiro',
    agente: 'Julia Santos',
    status: 'aguardando-cliente' as const,
    tempoAberto: '1 dia'
  },
  {
    id: 7,
    cliente: 'Ricardo Costa',
    telefone: '+55 11 33333-3333',
    ultimaMensagem: 'Quando posso agendar uma reunião?',
    tempo: '1 hora',
    setor: 'Comercial',
    tags: ['Reunião'],
    status: 'novos' as const,
    tempoAberto: '1 hora'
  },
  {
    id: 8,
    cliente: 'Luciana Oliveira',
    telefone: '+55 11 22222-2222',
    ultimaMensagem: 'Problema resolvido com sucesso',
    tempo: '2 horas',
    setor: 'Técnico',
    agente: 'Paulo Henrique',
    status: 'finalizados' as const,
    tempoAberto: '3 horas'
  }
];

export default function Kanban() {
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('todos');
  
  // Extrair departamentos únicos
  const departamentos = Array.from(new Set(atendimentosKanban.map(a => a.setor)));
  
  // Filtrar atendimentos
  const atendimentosFiltrados = departamentoSelecionado === 'todos' 
    ? atendimentosKanban 
    : atendimentosKanban.filter(a => a.setor === departamentoSelecionado);

  const handleSelectAtendimento = (atendimento: any) => {
    console.log('Atendimento selecionado:', atendimento);
    // Aqui seria implementada a navegação para o chat específico
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filtros */}
      <KanbanFilters
        departamentoSelecionado={departamentoSelecionado}
        onDepartamentoChange={setDepartamentoSelecionado}
        departamentos={departamentos}
        totalAtendimentos={atendimentosFiltrados.length}
      />

      {/* Kanban Board */}
      <KanbanBoard
        atendimentos={atendimentosFiltrados}
        onSelectAtendimento={handleSelectAtendimento}
        usuarioLogado="Ana Silva"
        isAdmin={false} // Aqui viria da autenticação real
        departamentoSelecionado={departamentoSelecionado === 'todos' ? undefined : departamentoSelecionado}
      />
    </div>
  );
}
