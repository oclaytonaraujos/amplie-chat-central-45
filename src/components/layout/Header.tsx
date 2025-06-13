
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from './NotificationDropdown';
import { SettingsDropdown } from './SettingsDropdown';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  sidebarWidth?: number;
}

export function Header({ 
  title, 
  description,
  icon,
  showMenuButton = false, 
  onMenuClick, 
  sidebarWidth = 0 
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      console.log('Header scroll state:', scrolled, 'scrollY:', window.scrollY);
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log('Header render - isScrolled:', isScrolled, 'title:', title);

  return (
    <header 
      className={`
        fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out
        ${showMenuButton ? 'left-0 mx-4' : 'ml-4 mr-4'}
        mt-4
        ${isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-amplie border border-gray-200/50' 
          : 'bg-transparent border-transparent'
        }
        rounded-xl px-4 md:px-6 py-4
      `}
      style={{
        left: showMenuButton ? '16px' : `${sidebarWidth + 16}px`
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Menu button (mobile) + Title with Icon */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick}
              className="md:hidden hover:bg-amplie-primary/10"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </Button>
          )}
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-3 bg-gradient-amplie-light rounded-lg shadow-amplie">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-amplie bg-clip-text text-transparent">
                {title}
              </h1>
              {description ? (
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {description}
                </p>
              ) : (
                <p className="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">
                  Bem-vindo ao painel de controle do Amplie Chat
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <NotificationDropdown />

          {/* Settings */}
          <SettingsDropdown />

          {/* User Menu */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
