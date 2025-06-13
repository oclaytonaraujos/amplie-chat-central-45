
import { createContext, useContext, useReducer } from 'react';

export interface SystemState {
  atendimentos: {
    novos: number;
    emAtendimento: number;
    aguardandoCliente: number;
    finalizados: number;
    total: number;
  };
  metrics: {
    atendimentosAbertos: number;
    finalizadosHoje: number;
    tempoMedioEspera: string;
    tempoMedioAtendimento: string;
  };
  agentes: Array<{
    nome: string;
    atendimentos: number;
    setor: string;
  }>;
  setores: Array<{
    nome: string;
    valor: number;
    cor: string;
  }>;
  notificacoes: {
    count: number;
    items: Array<{
      id: number;
      titulo: string;
      tempo: string;
      lida: boolean;
    }>;
  };
  lastUpdate: number;
}

type SystemAction = 
  | { type: 'UPDATE_ATENDIMENTOS'; payload: SystemState['atendimentos'] }
  | { type: 'UPDATE_METRICS'; payload: SystemState['metrics'] }
  | { type: 'UPDATE_AGENTES'; payload: SystemState['agentes'] }
  | { type: 'UPDATE_SETORES'; payload: SystemState['setores'] }
  | { type: 'UPDATE_NOTIFICACOES'; payload: SystemState['notificacoes'] }
  | { type: 'FULL_UPDATE'; payload: Partial<SystemState> };

const initialState: SystemState = {
  atendimentos: {
    novos: 12,
    emAtendimento: 18,
    aguardandoCliente: 8,
    finalizados: 4,
    total: 42
  },
  metrics: {
    atendimentosAbertos: 42,
    finalizadosHoje: 18,
    tempoMedioEspera: '2m 34s',
    tempoMedioAtendimento: '8m 12s'
  },
  agentes: [
    { nome: 'Ana Silva', atendimentos: 23, setor: 'Vendas' },
    { nome: 'Carlos Santos', atendimentos: 19, setor: 'Suporte' },
    { nome: 'Maria Oliveira', atendimentos: 17, setor: 'Vendas' },
    { nome: 'João Costa', atendimentos: 15, setor: 'Financeiro' }
  ],
  setores: [
    { nome: 'Vendas', valor: 45, cor: '#344ccf' },
    { nome: 'Suporte', valor: 32, cor: '#00d25b' },
    { nome: 'Financeiro', valor: 18, cor: '#ffab00' },
    { nome: 'RH', valor: 5, cor: '#ea5455' }
  ],
  notificacoes: {
    count: 3,
    items: [
      { id: 1, titulo: 'Novo atendimento atribuído', tempo: '2 min', lida: false },
      { id: 2, titulo: 'Cliente respondeu mensagem', tempo: '5 min', lida: false },
      { id: 3, titulo: 'Atendimento transferido', tempo: '10 min', lida: true }
    ]
  },
  lastUpdate: Date.now()
};

function systemReducer(state: SystemState, action: SystemAction): SystemState {
  switch (action.type) {
    case 'UPDATE_ATENDIMENTOS':
      return { 
        ...state, 
        atendimentos: action.payload,
        lastUpdate: Date.now()
      };
    case 'UPDATE_METRICS':
      return { 
        ...state, 
        metrics: action.payload,
        lastUpdate: Date.now()
      };
    case 'UPDATE_AGENTES':
      return { 
        ...state, 
        agentes: action.payload,
        lastUpdate: Date.now()
      };
    case 'UPDATE_SETORES':
      return { 
        ...state, 
        setores: action.payload,
        lastUpdate: Date.now()
      };
    case 'UPDATE_NOTIFICACOES':
      return { 
        ...state, 
        notificacoes: action.payload,
        lastUpdate: Date.now()
      };
    case 'FULL_UPDATE':
      return { 
        ...state, 
        ...action.payload,
        lastUpdate: Date.now()
      };
    default:
      return state;
  }
}

interface SystemContextType {
  state: SystemState;
  dispatch: React.Dispatch<SystemAction>;
  updateAtendimentos: (data: SystemState['atendimentos']) => void;
  updateMetrics: (data: SystemState['metrics']) => void;
  updateAgentes: (data: SystemState['agentes']) => void;
  updateSetores: (data: SystemState['setores']) => void;
  updateNotificacoes: (data: SystemState['notificacoes']) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(systemReducer, initialState);

  const updateAtendimentos = (data: SystemState['atendimentos']) => {
    dispatch({ type: 'UPDATE_ATENDIMENTOS', payload: data });
  };

  const updateMetrics = (data: SystemState['metrics']) => {
    dispatch({ type: 'UPDATE_METRICS', payload: data });
  };

  const updateAgentes = (data: SystemState['agentes']) => {
    dispatch({ type: 'UPDATE_AGENTES', payload: data });
  };

  const updateSetores = (data: SystemState['setores']) => {
    dispatch({ type: 'UPDATE_SETORES', payload: data });
  };

  const updateNotificacoes = (data: SystemState['notificacoes']) => {
    dispatch({ type: 'UPDATE_NOTIFICACOES', payload: data });
  };

  return (
    <SystemContext.Provider value={{
      state,
      dispatch,
      updateAtendimentos,
      updateMetrics,
      updateAgentes,
      updateSetores,
      updateNotificacoes
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystemContext() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystemContext must be used within a SystemProvider');
  }
  return context;
}
