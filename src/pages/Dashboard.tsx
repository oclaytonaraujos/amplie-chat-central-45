
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Timer,
  Users,
  TrendingUp,
  Building2,
  Activity
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { useSystemContext } from '@/contexts/SystemContext';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const atendimentosData = [
  { nome: 'Seg', atendimentos: 45 },
  { nome: 'Ter', atendimentos: 38 },
  { nome: 'Qua', atendimentos: 52 },
  { nome: 'Qui', atendimentos: 41 },
  { nome: 'Sex', atendimentos: 67 },
  { nome: 'Sáb', atendimentos: 23 },
  { nome: 'Dom', atendimentos: 18 }
];

export default function Dashboard() {
  const { state } = useSystemContext();
  const { lastUpdate, isConnected } = useRealtimeData();

  return (
    <div className="p-6 space-y-6">
      {/* Indicador de conexão em tempo real */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Dados em tempo real' : 'Desconectado'}
          </span>
          <span className="text-xs text-gray-400">
            Última atualização: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Atendimentos em Aberto"
          value={state.metrics.atendimentosAbertos}
          subtitle="Aguardando resposta"
          icon={<MessageSquare className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        
        <MetricCard
          title="Finalizados Hoje"
          value={state.metrics.finalizadosHoje}
          subtitle="Meta: 25 atendimentos"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-r from-green-500 to-green-600"
          trend={{ value: 8, isPositive: true }}
        />
        
        <MetricCard
          title="Tempo Médio de Espera"
          value={state.metrics.tempoMedioEspera}
          subtitle="Meta: < 3 minutos"
          icon={<Clock className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-r from-orange-500 to-orange-600"
          trend={{ value: 5, isPositive: false }}
        />
        
        <MetricCard
          title="Tempo Médio de Atendimento"
          value={state.metrics.tempoMedioAtendimento}
          subtitle="Meta: < 10 minutos"
          icon={<Timer className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={{ value: 15, isPositive: false }}
        />
      </div>

      {/* Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Atendimentos por Dia */}
        <ChartCard
          title="Atendimentos por Dia"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          iconColor="bg-gradient-to-r from-indigo-500 to-indigo-600"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={atendimentosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="atendimentos" fill="#344ccf" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Atendimentos por Setor */}
        <ChartCard
          title="Atendimentos por Setor"
          icon={<Building2 className="w-5 h-5 text-white" />}
          iconColor="bg-gradient-to-r from-teal-500 to-teal-600"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={state.setores}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="valor"
                label={({ nome, valor }) => `${nome} (${valor})`}
              >
                {state.setores.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Status do Kanban e Top Agentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini Kanban */}
        <div className="bg-white rounded-xl shadow-amplie p-6 hover:shadow-amplie-hover transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Status dos Tickets</h3>
            <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <p className="text-2xl font-bold text-blue-600">{state.atendimentos.novos}</p>
              <p className="text-sm text-gray-600">Novos</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
              <p className="text-2xl font-bold text-yellow-600">{state.atendimentos.emAtendimento}</p>
              <p className="text-sm text-gray-600">Em Atendimento</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
              <p className="text-2xl font-bold text-orange-600">{state.atendimentos.aguardandoCliente}</p>
              <p className="text-sm text-gray-600">Aguardando Cliente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
              <p className="text-2xl font-bold text-green-600">{state.atendimentos.finalizados}</p>
              <p className="text-sm text-gray-600">Finalizados</p>
            </div>
          </div>
        </div>

        {/* Top Agentes */}
        <div className="bg-white rounded-xl shadow-amplie p-6 hover:shadow-amplie-hover transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Agentes Hoje</h3>
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {state.agentes.map((agente, index) => (
              <div key={agente.nome} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{agente.nome}</p>
                    <p className="text-sm text-gray-500">{agente.setor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{agente.atendimentos}</p>
                  <p className="text-sm text-gray-500">atendimentos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
