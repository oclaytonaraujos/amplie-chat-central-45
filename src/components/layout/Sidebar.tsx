
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Grid2X2,
  Settings, 
  Building2,
  Bot,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    title: 'Chat Interno',
    icon: MessageCircle,
    href: '/chat-interno',
    color: 'text-cyan-400'
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

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ isMobile = false, isOpen = false, onClose, onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // On mobile, sidebar is always expanded when open
  const isCollapsed = isMobile ? false : collapsed;

  // Notify parent component about collapse state changes
  useEffect(() => {
    if (onCollapsedChange && !isMobile) {
      onCollapsedChange(collapsed);
    }
  }, [collapsed, onCollapsedChange, isMobile]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={cn(
      "h-full flex flex-col",
      isMobile ? "w-64 p-4" : "w-64 p-4"
    )}>
      <div className={cn(
        "bg-amplie-sidebar flex-1 transition-all duration-300 ease-in-out relative flex flex-col rounded-2xl shadow-lg h-full",
        isMobile ? "w-full" : (isCollapsed ? "w-16" : "w-full")
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700/30 flex-shrink-0 relative">
          <div className="flex items-center justify-between">
            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-amplie-sidebar-hover text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/5b035ca2-6a1b-45db-b6e2-f291736cf358.png" 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
              </div>
            )}
            {isCollapsed && (
              <div className="w-full flex justify-center">
                <img 
                  src="/lovable-uploads/a2e5cd13-e36f-4dee-b922-d556b4ba1516.png" 
                  alt="Logo Icon" 
                  className="h-10 w-10 object-contain"
                />
              </div>
            )}
          </div>
          
          {/* Toggle button - only show on desktop */}
          {!isMobile && (
            <button
              onClick={handleToggleCollapse}
              className={cn(
                "p-1.5 rounded-lg hover:bg-amplie-sidebar-hover text-gray-400 hover:text-white transition-colors",
                isCollapsed 
                  ? "absolute -right-3 top-1/2 -translate-y-1/2 bg-amplie-sidebar border border-gray-700/30 shadow-lg z-10" 
                  : "absolute right-6 top-1/2 -translate-y-1/2"
              )}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Menu with ScrollArea */}
        <ScrollArea className="flex-1 px-3 py-6">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center rounded-lg transition-all duration-200 group",
                    isCollapsed 
                      ? "justify-center px-0 py-3 w-full" 
                      : "space-x-3 px-3 py-3",
                    isActive 
                      ? isCollapsed
                        ? "bg-amplie-sidebar-active text-white shadow-lg w-full"
                        : "bg-amplie-sidebar-active text-white shadow-lg"
                      : "text-gray-300 hover:bg-amplie-sidebar-hover hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isCollapsed && isActive 
                      ? "bg-transparent" 
                      : isActive 
                        ? "bg-white/20" 
                        : "bg-gray-700/30 group-hover:bg-gray-600/50"
                  )}>
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : item.color)} />
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/30 flex-shrink-0">
          {!isCollapsed ? (
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
