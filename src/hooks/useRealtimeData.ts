
import { useEffect, useCallback } from 'react';
import { useSystemContext } from '@/contexts/SystemContext';

// Simula WebSocket connection para dados em tempo real
export function useRealtimeData() {
  const { state, updateAtendimentos, updateMetrics, updateAgentes, updateNotificacoes } = useSystemContext();

  // Simula recebimento de dados do servidor
  const simulateDataUpdate = useCallback(() => {
    // Simula variações nos dados
    const variation = () => Math.floor(Math.random() * 5) - 2; // -2 a +2
    const timeVariation = () => Math.floor(Math.random() * 30); // 0 a 30 segundos

    // Atualiza contadores de atendimentos
    const newAtendimentos = {
      novos: Math.max(0, state.atendimentos.novos + variation()),
      emAtendimento: Math.max(0, state.atendimentos.emAtendimento + variation()),
      aguardandoCliente: Math.max(0, state.atendimentos.aguardandoCliente + variation()),
      finalizados: state.atendimentos.finalizados + Math.max(0, variation()),
      total: 0
    };
    newAtendimentos.total = newAtendimentos.novos + newAtendimentos.emAtendimento + newAtendimentos.aguardandoCliente;

    updateAtendimentos(newAtendimentos);

    // Atualiza métricas
    const baseSeconds = 154; // 2m 34s
    const newTempo = baseSeconds + timeVariation();
    const minutes = Math.floor(newTempo / 60);
    const seconds = newTempo % 60;

    const baseAtendimento = 492; // 8m 12s  
    const newAtendimento = baseAtendimento + timeVariation();
    const attMinutes = Math.floor(newAtendimento / 60);
    const attSeconds = newAtendimento % 60;

    updateMetrics({
      atendimentosAbertos: newAtendimentos.total,
      finalizadosHoje: newAtendimentos.finalizados,
      tempoMedioEspera: `${minutes}m ${seconds}s`,
      tempoMedioAtendimento: `${attMinutes}m ${attSeconds}s`
    });

    // Atualiza agentes com variações
    const newAgentes = state.agentes.map(agente => ({
      ...agente,
      atendimentos: Math.max(0, agente.atendimentos + Math.floor(Math.random() * 3) - 1)
    }));
    updateAgentes(newAgentes);

    // Simula novas notificações ocasionalmente
    if (Math.random() < 0.1) { // 10% de chance
      const newNotification = {
        id: Date.now(),
        titulo: 'Nova mensagem recebida',
        tempo: 'agora',
        lida: false
      };
      
      updateNotificacoes({
        count: state.notificacoes.count + 1,
        items: [newNotification, ...state.notificacoes.items.slice(0, 9)] // Mantém apenas 10
      });
    }
  }, [state, updateAtendimentos, updateMetrics, updateAgentes, updateNotificacoes]);

  useEffect(() => {
    // Simula WebSocket updates a cada 3-8 segundos
    const interval = setInterval(() => {
      simulateDataUpdate();
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [simulateDataUpdate]);

  return {
    lastUpdate: state.lastUpdate,
    isConnected: true // Simula conexão ativa
  };
}
