
import { useState, useEffect } from 'react';
import { Search, Bell, Settings, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title: string;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showMenuButton = false, onMenuClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out
      ${showMenuButton ? 'left-0 mx-4' : 'left-64 ml-4 mr-4'}
      mt-4
      ${isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50' 
        : 'bg-transparent border-transparent'
      }
      rounded-xl px-4 md:px-6 py-4
    `}>
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Settings - Hidden on small mobile */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 bg-gradient-to-r from-amplie-primary to-amplie-primary-light rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="sm:hidden">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
