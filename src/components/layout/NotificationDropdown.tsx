
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Novo atendimento',
    message: 'Cliente João iniciou um novo chat',
    type: 'info',
    time: '2 min',
    read: false
  },
  {
    id: '2',
    title: 'Bot configurado',
    message: 'ChatBot foi atualizado com sucesso',
    type: 'success',
    time: '15 min',
    read: false
  },
  {
    id: '3',
    title: 'Usuário offline',
    message: 'Maria ficou offline no setor vendas',
    type: 'warning',
    time: '1h',
    read: true
  }
];

export function NotificationDropdown() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-6">
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-96 overflow-y-auto">
          {mockNotifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="p-0">
              <div className={`w-full p-3 border-l-2 ${
                notification.read ? 'border-l-transparent' : 'border-l-blue-500'
              } hover:bg-gray-50`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        notification.read ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-400 mt-1">
                        {notification.time} atrás
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
