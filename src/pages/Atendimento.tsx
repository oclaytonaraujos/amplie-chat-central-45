
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { FilterBar } from '@/components/atendimento/FilterBar';
import { KanbanColumns } from '@/components/atendimento/KanbanColumns';
import { ChatWhatsApp } from '@/components/atendimento/ChatWhatsApp';
import { ClienteInfo } from '@/components/atendimento/ClienteInfo';

// Dados de exemplo
const dadosAtendimentos = [
  {
    id: 1,
    cliente: 'João Silva',
    telefone: '+55 11 99999-9999',
    ultimaMensagem: 'Preciso de ajuda com meu pedido #12345, não chegou ainda',
    tempo: '5 min',
    setor: 'Suporte',
    agente: 'Ana Silva',
    tags: ['Pedido', 'Urgente'],
    status: 'em-atendimento' as const
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    telefone: '+55 11 88888-8888',
    ultimaMensagem: 'Olá, gostaria de mais informações sobre o plano premium',
    tempo: '12 min',
    setor: 'Vendas',
    tags: ['Novo Cliente'],
    status: 'novos' as const
  },
  {
    id: 3,
    cliente: 'Pedro Almeida',
    telefone: '+55 11 77777-7777',
    ultimaMensagem: 'Quando vocês vão lançar o novo produto?',
    tempo: '30 min',
    setor: 'Marketing',
    agente: 'Carlos Oliveira',
    status: 'pendentes' as const
  },
  {
    id: 4,
    cliente: 'Ana Pereira',
    telefone: '+55 11 66666-6666',
    ultimaMensagem: 'O problema foi resolvido, muito obrigado!',
    tempo: '1 hora',
    setor: 'Suporte',
    agente: 'Marcos Silva',
    status: 'finalizados' as const
  },
  {
    id: 5,
    cliente: 'Roberto Gomes',
    telefone: '+55 11 55555-5555',
    ultimaMensagem: 'Preciso trocar o produto que comprei ontem',
    tempo: '2 min',
    setor: 'Suporte',
    tags: ['Troca', 'Urgente'],
    status: 'novos' as const
  },
  {
    id: 6,
    cliente: 'Fernanda Lima',
    telefone: '+55 11 44444-4444',
    ultimaMensagem: 'Obrigado pelo atendimento, foi muito útil!',
    tempo: '3 horas',
    setor: 'Vendas',
    agente: 'Ana Silva',
    status: 'finalizados' as const
  }
];

const mensagensExemplo = [
  { id: 1, texto: 'Olá! Preciso de ajuda com meu pedido #12345', autor: 'cliente' as const, tempo: '14:30' },
  { id: 2, texto: 'Olá João! Claro, vou verificar seu pedido. Um momento por favor.', autor: 'agente' as const, tempo: '14:31', status: 'lido' as const },
  { id: 3, texto: 'Estou vendo aqui no sistema que seu pedido está em separação no estoque e deve ser enviado hoje ainda.', autor: 'agente' as const, tempo: '14:32', status: 'lido' as const },
  { id: 4, texto: 'Perfeito! Muito obrigado pelo atendimento rápido.', autor: 'cliente' as const, tempo: '14:33' },
  { id: 5, texto: 'Você consegue me passar o código de rastreamento?', autor: 'cliente' as const, tempo: '14:34' },
  { id: 6, texto: 'Claro! Assim que o pedido for despachado, o código de rastreamento será enviado automaticamente para o seu email e também para o seu WhatsApp.', autor: 'agente' as const, tempo: '14:35', status: 'lido' as const }
];

const clienteExemplo = {
  id: 1,
  nome: 'João Silva',
  telefone: '+55 11 99999-9999',
  email: 'joao.silva@email.com',
  dataCadastro: '15/03/2023',
  tags: ['Cliente Fiel', 'Premium'],
  historico: [
    { id: 1, data: '10/05/2023', assunto: 'Problema com entrega', status: 'Resolvido' },
    { id: 2, data: '23/06/2023', assunto: 'Troca de produto', status: 'Resolvido' },
    { id: 3, data: '05/09/2023', assunto: 'Dúvida sobre garantia', status: 'Resolvido' }
  ]
};

export default function Atendimento() {
  const [selectedAtendimento, setSelectedAtendimento] = useState<typeof dadosAtendimentos[0] | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list');

  // Em dispositivos móveis, trocar entre lista e chat
  const handleSelectAtendimento = (atendimento: typeof dadosAtendimentos[0]) => {
    setSelectedAtendimento(atendimento);
    if (window.innerWidth < 1024) { // Breakpoint lg
      setViewMode('chat');
    }
  };

  const handleReturnToList = () => {
    setViewMode('list');
  };

  return (
    <div className="p-6 h-[calc(100vh-8rem)]">
      {/* Cabeçalho da página */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Central de Atendimento</h2>
          <p className="text-gray-600">Gerencie as conversas em tempo real</p>
        </div>
      </div>

      {/* Barra de filtros e pesquisa */}
      <FilterBar />

      {/* Conteúdo principal - Lista em dispositivos móveis ou layout completo em desktop */}
      {viewMode === 'list' ? (
        <div className="lg:hidden">
          <KanbanColumns 
            atendimentos={dadosAtendimentos} 
            onSelectAtendimento={handleSelectAtendimento} 
          />
        </div>
      ) : (
        <div className="lg:hidden h-[calc(100vh-16rem)]">
          <ChatWhatsApp 
            cliente={{
              id: selectedAtendimento?.id || 1,
              nome: selectedAtendimento?.cliente || 'Cliente',
              telefone: selectedAtendimento?.telefone || '',
              status: 'online'
            }}
            mensagens={mensagensExemplo}
            onReturnToList={handleReturnToList}
          />
        </div>
      )}

      {/* Layout desktop - sempre visível em telas grandes */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 h-[calc(100vh-18rem)]">
        {/* Colunas Kanban - 7 colunas */}
        <div className="col-span-7 overflow-auto">
          <KanbanColumns 
            atendimentos={dadosAtendimentos} 
            onSelectAtendimento={handleSelectAtendimento} 
          />
        </div>

        {/* Área de chat e informações do cliente - 5 colunas */}
        <div className="col-span-5 grid grid-rows-3 gap-4 h-full">
          {/* Chat do WhatsApp - ocupa 2/3 da altura */}
          <div className="row-span-2">
            {selectedAtendimento ? (
              <ChatWhatsApp 
                cliente={{
                  id: selectedAtendimento.id,
                  nome: selectedAtendimento.cliente,
                  telefone: selectedAtendimento.telefone,
                  status: 'online'
                }}
                mensagens={mensagensExemplo}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-xl border border-dashed border-gray-300">
                <div className="text-center p-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-1">Selecione uma conversa</h3>
                  <p className="text-sm text-gray-500">Clique em uma conversa para iniciar o atendimento</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Informações do cliente - ocupa 1/3 da altura */}
          <div className="row-span-1">
            {selectedAtendimento ? (
              <ClienteInfo cliente={clienteExemplo} />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-xl border border-dashed border-gray-300">
                <div className="text-center">
                  <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Dados do cliente</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
