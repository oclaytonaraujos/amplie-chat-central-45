
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Timer,
  Users,
  TrendingUp,
  Building2,
  Activity,
  BarChart3,
  Wallet,
  UserPlus
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const weeklyData = [
  { day: 'M', value: 45 },
  { day: 'T', value: 15 },
  { day: 'W', value: 10 },
  { day: 'T', value: 20 },
  { day: 'F', value: 50 },
  { day: 'S', value: 5 },
  { day: 'S', value: 35 }
];

const salesData = [
  { month: 'Apr', value: 50 },
  { month: 'May', value: 100 },
  { month: 'Jun', value: 250 },
  { month: 'Jul', value: 300 },
  { month: 'Aug', value: 500 },
  { month: 'Sep', value: 250 },
  { month: 'Oct', value: 150 },
  { month: 'Nov', value: 400 },
  { month: 'Dec', value: 500 }
];

const tasksData = [
  { month: 'Apr', value: 100 },
  { month: 'May', value: 50 },
  { month: 'Jun', value: 250 },
  { month: 'Jul', value: 200 },
  { month: 'Aug', value: 500 },
  { month: 'Sep', value: 300 },
  { month: 'Oct', value: 250 },
  { month: 'Nov', value: 350 },
  { month: 'Dec', value: 500 }
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Bookings"
          value="281"
          icon={<MessageSquare className="w-6 h-6 text-white" />}
          iconColor="bg-gray-700"
          trend={{ value: 55, isPositive: true, period: "than last week" }}
        />
        
        <MetricCard
          title="Today's Users"
          value="2,300"
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          iconColor="bg-blue-500"
          trend={{ value: 3, isPositive: true, period: "than last month" }}
        />
        
        <MetricCard
          title="Revenue"
          value="34k"
          icon={<Wallet className="w-6 h-6 text-white" />}
          iconColor="bg-green-500"
          trend={{ value: 1, isPositive: true, period: "than yesterday" }}
        />
        
        <MetricCard
          title="Followers"
          value="+91"
          icon={<UserPlus className="w-6 h-6 text-white" />}
          iconColor="bg-pink-500"
          trend={{ value: 0, isPositive: true, period: "Just updated" }}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Website Views */}
        <ChartCard
          title="Website Views"
          subtitle="Last Campaign Performance"
          chartBackground="bg-blue-500"
          timestamp="campaign sent 2 days ago"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <Bar 
                dataKey="value" 
                fill="rgba(255,255,255,0.8)" 
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'white', fontSize: 12 }}
              />
              <YAxis hide />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily Sales */}
        <ChartCard
          title="Daily Sales"
          subtitle="(+15%) increase in today sales."
          chartBackground="bg-green-500"
          timestamp="updated 4 min ago"
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="white" 
                strokeWidth={3}
                dot={{ fill: 'white', r: 4 }}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'white', fontSize: 10 }}
              />
              <YAxis hide />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Completed Tasks */}
        <ChartCard
          title="Completed Tasks"
          subtitle="Last Campaign Performance"
          chartBackground="bg-gray-800"
          timestamp="just updated"
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tasksData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="white" 
                strokeWidth={3}
                dot={{ fill: 'white', r: 4 }}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'white', fontSize: 10 }}
              />
              <YAxis hide />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Status do Kanban e Top Agentes - mantendo design original do Amplie Chat */}
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
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Novos</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
              <p className="text-2xl font-bold text-yellow-600">18</p>
              <p className="text-sm text-gray-600">Em Atendimento</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-sm text-gray-600">Aguardando Cliente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
              <p className="text-2xl font-bold text-green-600">4</p>
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
            {[
              { nome: 'Ana Silva', atendimentos: 23, setor: 'Vendas' },
              { nome: 'Carlos Santos', atendimentos: 19, setor: 'Suporte' },
              { nome: 'Maria Oliveira', atendimentos: 17, setor: 'Vendas' },
              { nome: 'João Costa', atendimentos: 15, setor: 'Financeiro' }
            ].map((agente, index) => (
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
