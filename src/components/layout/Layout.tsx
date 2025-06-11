
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
}

export function Layout({ children, title, description, icon, iconColor }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const getSidebarWidth = () => {
    if (isMobile) return 0;
    if (sidebarCollapsed) return 80; // Width when collapsed (64px + padding)
    return 256; // Width when expanded (240px + padding)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Fixed Sidebar - Always visible on desktop */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 ${!sidebarOpen ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out`
          : 'fixed inset-y-0 left-0 z-30'
        }
      `}>
        <Sidebar 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>
      
      {/* Main content - Adjust margin based on sidebar state */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          !isMobile ? `ml-[${getSidebarWidth()}px]` : ''
        }`}
        style={{
          marginLeft: !isMobile ? `${getSidebarWidth()}px` : '0'
        }}
      >
        {/* Fixed Header with dynamic left positioning */}
        <Header 
          title={title}
          description={description}
          icon={icon}
          iconColor={iconColor}
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={isMobile}
          sidebarWidth={getSidebarWidth()}
        />
        
        {/* Main content with top padding to account for fixed header */}
        <main className="flex-1 p-4 md:p-6 pt-24 md:pt-28 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
