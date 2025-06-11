
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Grid2X2,
  Settings, 
  Building2,
  Bot,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    color: 'text-blue-400'
  },
  {
    title: 'Usuários',
    icon: Users,
    href: '/usuarios',
    color: 'text-green-400'
  },
  {
    title: 'Atendimento',
    icon: MessageSquare,
    href: '/atendimento',
    color: 'text-purple-400'
  },
  {
    title: 'Kanban',
    icon: Grid2X2,
    href: '/kanban',
    color: 'text-orange-400'
  },
  {
    title: 'ChatBot',
    icon: Bot,
    href: '/chatbot',
    color: 'text-indigo-400'
  },
  {
    title: 'Painel',
    icon: Settings,
    href: '/painel',
    color: 'text-red-400'
  },
  {
    title: 'Setores',
    icon: Building2,
    href: '/setores',
    color: 'text-teal-400'
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="p-4 h-screen">
      <div className={cn(
        "bg-amplie-sidebar h-full transition-all duration-300 ease-in-out relative flex flex-col rounded-2xl shadow-lg",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amplie-primary to-amplie-primary-light rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Amplie Chat</span>
              </div>
            )}
            {collapsed && (
              <div className="w-full flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-amplie-primary to-amplie-primary-light rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-amplie-sidebar-hover text-gray-400 hover:text-white transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 group",
                  collapsed ? "justify-center px-2 py-3" : "space-x-3 px-3 py-3",
                  isActive 
                    ? "bg-amplie-sidebar-active text-white shadow-lg" 
                    : "text-gray-300 hover:bg-amplie-sidebar-hover hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-white/20" : "bg-gray-700/30 group-hover:bg-gray-600/50"
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : item.color)} />
                </div>
                {!collapsed && (
                  <span className="font-medium text-sm">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/30">
          {!collapsed ? (
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-medium">Admin User</p>
                <p className="text-xs">Administrador</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
