
import { useState, useEffect } from 'react';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationDropdown } from './NotificationDropdown';
import { SettingsDropdown } from './SettingsDropdown';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  title: string;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  sidebarWidth?: number;
}

export function Header({ title, showMenuButton = false, onMenuClick, sidebarWidth = 0 }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out
        ${showMenuButton ? 'left-0 mx-4' : 'ml-4 mr-4'}
        mt-4
        ${isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50' 
          : 'bg-transparent border-transparent'
        }
        rounded-xl px-4 md:px-6 py-4
      `}
      style={{
        left: showMenuButton ? '16px' : `${sidebarWidth + 16}px`
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Menu button (mobile) + Title */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </Button>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">
              Bem-vindo ao painel de controle do Amplie Chat
            </p>
          </div>
        </div>

        {/* Right side - Search and Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar..."
              className="pl-10 w-64 lg:w-80 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Settings - Hidden on small mobile */}
          <SettingsDropdown />

          {/* User Menu */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
