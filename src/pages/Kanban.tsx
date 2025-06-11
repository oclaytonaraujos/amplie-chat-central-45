
import { Grid2X2, Plus, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const colunas = [
  {
    id: 'novos',
    titulo: 'Novos',
    cor: 'bg-blue-50 border-blue-200',
    tickets: [
      { id: 1, cliente: 'Ana Costa', tempo: '2 min', prioridade: 'Alta' },
      { id: 2, cliente: 'Carlos Silva', tempo: '8 min', prioridade: 'Normal' }
    ]
  },
  {
    id: 'atendimento',
    titulo: 'Em Atendimento',
    cor: 'bg-yellow-50 border-yellow-200',
    tickets: [
      { id: 3, cliente: 'Maria Santos', tempo: '15 min', agente: 'João', prioridade: 'Alta' },
      { id: 4, cliente: 'Pedro Oliveira', tempo: '5 min', agente: 'Ana', prioridade: 'Normal' }
    ]
  },
  {
    id: 'aguardando',
    titulo: 'Aguardando Cliente',
    cor: 'bg-orange-50 border-orange-200',
    tickets: [
      { id: 5, cliente: 'Laura Lima', tempo: '1h 20min', agente: 'Carlos', prioridade: 'Baixa' }
    ]
  },
  {
    id: 'finalizados',
    titulo: 'Finalizados',
    cor: 'bg-green-50 border-green-200',
    tickets: [
      { id: 6, cliente: 'Roberto Souza', tempo: 'Hoje', agente: 'Maria', prioridade: 'Normal' },
      { id: 7, cliente: 'Julia Martins', tempo: 'Hoje', agente: 'João', prioridade: 'Alta' }
    ]
  }
];

export default function Kanban() {
  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Normal': return 'bg-blue-100 text-blue-800';
      case 'Baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
            <Grid2X2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kanban de Atendimento</h2>
            <p className="text-gray-600">Visualize o fluxo dos tickets em tempo real</p>
          </div>
        </div>
        <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
        {colunas.map((coluna) => (
          <div key={coluna.id} className={`${coluna.cor} rounded-xl p-4 border-2 border-dashed`}>
            {/* Header da Coluna */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{coluna.titulo}</h3>
              <Badge variant="secondary" className="bg-white">
                {coluna.tickets.length}
              </Badge>
            </div>

            {/* Tickets */}
            <div className="space-y-3">
              {coluna.tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-medium text-gray-900">{ticket.cliente}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getPrioridadeColor(ticket.prioridade)}`}
                    >
                      {ticket.prioridade}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{ticket.tempo}</span>
                    </div>
                    
                    {ticket.agente && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{ticket.agente}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {ticket.cliente.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">#{ticket.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Card */}
            <button className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
              <Plus className="w-4 h-4 mx-auto" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
