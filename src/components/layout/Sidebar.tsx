
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Grid2X2, Settings, Building2, Bot, MessageCircle, ChevronLeft, ChevronRight, X, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/', color: 'text-blue-400' },
  { title: 'Usuários', icon: Users, href: '/usuarios', color: 'text-green-400' },
  { title: 'Contatos', icon: UserCheck, href: '/contatos', color: 'text-emerald-400' },
  { title: 'Atendimento', icon: MessageSquare, href: '/atendimento', color: 'text-purple-400' },
  { title: 'Kanban', icon: Grid2X2, href: '/kanban', color: 'text-orange-400' },
  { title: 'ChatBot', icon: Bot, href: '/chatbot', color: 'text-indigo-400' },
  { title: 'Chat Interno', icon: MessageCircle, href: '/chat-interno', color: 'text-cyan-400' },
  { title: 'Painel', icon: Settings, href: '/painel', color: 'text-red-400' },
  { title: 'Setores', icon: Building2, href: '/setores', color: 'text-teal-400' }
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  isMobile = false,
  isOpen = false,
  onClose,
  onCollapsedChange
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isCollapsed = isMobile ? false : collapsed;

  // Touch gesture handling for mobile swipe-to-close
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
        setIsDragging(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      setCurrentX(touch.clientX);
      
      // Calculate swipe distance
      const deltaX = touch.clientX - startX;
      
      // Only allow left swipe (negative deltaX) to close
      if (deltaX < 0 && sidebarRef.current) {
        const progress = Math.min(Math.abs(deltaX) / 200, 1);
        sidebarRef.current.style.transform = `translateX(${deltaX}px)`;
        sidebarRef.current.style.opacity = `${1 - progress * 0.5}`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      setIsDragging(false);
      const deltaX = currentX - startX;
      
      // Close sidebar if swiped left more than 100px
      if (deltaX < -100 && onClose) {
        onClose();
      }
      
      // Reset transform
      if (sidebarRef.current) {
        sidebarRef.current.style.transform = '';
        sidebarRef.current.style.opacity = '';
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
      sidebar.addEventListener('touchmove', handleTouchMove, { passive: false });
      sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('touchstart', handleTouchStart);
        sidebar.removeEventListener('touchmove', handleTouchMove);
        sidebar.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobile, isOpen, isDragging, startX, currentX, onClose]);

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
      isMobile ? "w-64 p-3 sm:p-4" : "w-64 p-3 sm:p-4"
    )}>
      <div 
        ref={sidebarRef}
        className={cn(
          "bg-amplie-sidebar flex-1 transition-all duration-300 ease-out relative flex flex-col rounded-2xl shadow-lg h-full transform-gpu",
          isMobile ? "w-full" : isCollapsed ? "w-16" : "w-full",
          isDragging && "transition-none"
        )}
        style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700/30 flex-shrink-0 relative">
          <div className="flex items-center justify-between">
            {/* Mobile close button */}
            {isMobile && (
              <button 
                onClick={onClose}
                className="absolute right-3 sm:right-4 top-3 sm:top-4 p-1.5 rounded-lg hover:bg-amplie-sidebar-hover text-gray-400 hover:text-white transition-colors z-10 touch-manipulation active:scale-95"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {!isCollapsed && (
              <div className="flex items-center space-x-2 pr-8 sm:pr-0">
                <img 
                  src="/lovable-uploads/5b035ca2-6a1b-45db-b6e2-f291736cf358.png" 
                  alt="Logo" 
                  className="h-6 sm:h-8 w-auto" 
                />
              </div>
            )}
            
            {isCollapsed && (
              <div className="w-full flex justify-center">
                <img 
                  src="/lovable-uploads/a2e5cd13-e36f-4dee-b922-d556b4ba1516.png" 
                  alt="Logo Icon" 
                  className="h-8 sm:h-10 w-8 sm:w-10 object-contain" 
                />
              </div>
            )}
          </div>
          
          {/* Toggle button - only show on desktop */}
          {!isMobile && (
            <button 
              onClick={handleToggleCollapse}
              className={cn(
                "p-1.5 rounded-lg hover:bg-amplie-sidebar-hover text-gray-400 hover:text-white transition-all duration-200 touch-manipulation active:scale-95",
                isCollapsed 
                  ? "absolute -right-3 top-1/2 -translate-y-1/2 bg-amplie-sidebar border border-gray-700/30 shadow-lg z-10" 
                  : "absolute right-4 sm:right-6 top-1/2 -translate-y-1/2"
              )}
              style={{ touchAction: 'manipulation' }}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Menu with optimized scrolling */}
        <ScrollArea 
          className="flex-1 px-2 sm:px-3 py-4 sm:py-6"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center rounded-lg transition-all duration-200 group touch-manipulation active:scale-95",
                    isCollapsed 
                      ? "justify-center px-0 py-3 w-full" 
                      : "space-x-3 px-3 py-3",
                    isActive 
                      ? isCollapsed 
                        ? "bg-amplie-sidebar-active text-white shadow-lg w-full" 
                        : "bg-amplie-sidebar-active text-white shadow-lg"
                      : "text-gray-300 hover:bg-amplie-sidebar-hover hover:text-white"
                  )}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isCollapsed && isActive 
                      ? "bg-transparent" 
                      : isActive 
                        ? "bg-white/20" 
                        : "bg-gray-700/30 group-hover:bg-gray-600/50"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5",
                      isActive ? "text-white" : item.color
                    )} />
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm truncate">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-700/30 flex-shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-xs sm:text-sm truncate">Admin User</p>
                <p className="text-xs truncate">Administrador</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
