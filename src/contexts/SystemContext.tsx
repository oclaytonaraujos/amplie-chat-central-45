
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Atendimento {
  id: number;
  cliente: string;
  telefone: string;
  ultimaMensagem: string;
  tempo: string;
  setor: string;
  agente?: string;
  tags: string[];
  status: 'novos' | 'em-atendimento' | 'aguardando-cliente' | 'finalizados';
  transferencia?: {
    de: string;
    motivo: string;
    dataTransferencia: string;
  };
}

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

interface DashboardMetrics {
  atendimentosEmAberto: number;
  finalizadosHoje: number;
  tempoMedioEspera: string;
  tempoMedioAtendimento: string;
  statusTickets: {
    novos: number;
    emAtendimento: number;
    aguardandoCliente: number;
    finalizados: number;
  };
}

interface SystemContextType {
  atendimentos: Atendimento[];
  contatos: Contato[];
  dashboardMetrics: DashboardMetrics;
  updateAtendimento: (atendimento: Atendimento) => void;
  addAtendimento: (atendimento: Atendimento) => void;
  finalizarAtendimento: (atendimentoId: number) => void;
  addContato: (contato: Contato) => void;
  updateContato: (contato: Contato) => void;
  isNewContact: (telefone: string) => boolean;
  refreshMetrics: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
  // Estados iniciais mockados (em produção viriam de APIs)
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([
    {
      id: 1,
      cliente: 'João Silva',
      telefone: '+55 11 99999-9999',
      ultimaMensagem: 'Preciso de ajuda com meu pedido #12345',
      tempo: '5 min',
      setor: 'Suporte',
      agente: 'Ana Silva',
      tags: ['Pedido', 'Urgente'],
      status: 'em-atendimento',
      transferencia: {
        de: 'Carlos Santos',
        motivo: 'Cliente solicitou falar com supervisor',
        dataTransferencia: '14:25'
      }
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      telefone: '+55 11 88888-8888',
      ultimaMensagem: 'Gostaria de mais informações sobre o plano premium',
      tempo: '12 min',
      setor: 'Vendas',
      tags: ['Novo Cliente'],
      status: 'novos'
    }
  ]);

  const [contatos, setContatos] = useState<Contato[]>([
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
      atendentesAssociados: [{
        setor: 'Vendas',
        atendente: 'Ana Silva'
      }]
    }
  ]);

  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    atendimentosEmAberto: 0,
    finalizadosHoje: 0,
    tempoMedioEspera: '2m 34s',
    tempoMedioAtendimento: '8m 12s',
    statusTickets: {
      novos: 0,
      emAtendimento: 0,
      aguardandoCliente: 0,
      finalizados: 0
    }
  });

  const refreshMetrics = useCallback(() => {
    const novos = atendimentos.filter(a => a.status === 'novos').length;
    const emAtendimento = atendimentos.filter(a => a.status === 'em-atendimento').length;
    const aguardandoCliente = atendimentos.filter(a => a.status === 'aguardando-cliente').length;
    const finalizados = atendimentos.filter(a => a.status === 'finalizados').length;

    setDashboardMetrics(prev => ({
      ...prev,
      atendimentosEmAberto: novos + emAtendimento + aguardandoCliente,
      finalizadosHoje: finalizados,
      statusTickets: {
        novos,
        emAtendimento,
        aguardandoCliente,
        finalizados
      }
    }));
  }, [atendimentos]);

  const updateAtendimento = useCallback((atendimento: Atendimento) => {
    setAtendimentos(prev => 
      prev.map(a => a.id === atendimento.id ? atendimento : a)
    );
    refreshMetrics();
  }, [refreshMetrics]);

  const addAtendimento = useCallback((atendimento: Atendimento) => {
    setAtendimentos(prev => [...prev, atendimento]);
    refreshMetrics();
  }, [refreshMetrics]);

  const finalizarAtendimento = useCallback((atendimentoId: number) => {
    setAtendimentos(prev => 
      prev.map(a => 
        a.id === atendimentoId 
          ? { ...a, status: 'finalizados' as const }
          : a
      )
    );
    refreshMetrics();
  }, [refreshMetrics]);

  const addContato = useCallback((contato: Contato) => {
    setContatos(prev => [...prev, contato]);
  }, []);

  const updateContato = useCallback((contato: Contato) => {
    setContatos(prev => 
      prev.map(c => c.id === contato.id ? contato : c)
    );
  }, []);

  const isNewContact = useCallback((telefone: string) => {
    return !contatos.some(c => c.telefone === telefone);
  }, [contatos]);

  // Atualizar métricas quando atendimentos mudarem
  React.useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  const value: SystemContextType = {
    atendimentos,
    contatos,
    dashboardMetrics,
    updateAtendimento,
    addAtendimento,
    finalizarAtendimento,
    addContato,
    updateContato,
    isNewContact,
    refreshMetrics
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};
