
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Push layout on desktop, overlay on mobile */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 ${!sidebarOpen ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out`
          : 'relative z-10'
        }
      `}>
        <Sidebar 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed at top */}
        <div className="fixed top-0 right-0 z-30" style={{
          left: isMobile ? '0' : '5rem',
          width: isMobile ? '100%' : 'calc(100% - 5rem)'
        }}>
          <Header 
            title={title} 
            onMenuClick={() => setSidebarOpen(true)}
            showMenuButton={isMobile}
          />
        </div>
        
        {/* Main content with top padding for fixed header */}
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-24 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
