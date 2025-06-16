
import { Settings, Bell, Monitor, Sun, Globe, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

export function SettingsDropdown() {
  const navigate = useNavigate();
  const { themeSettings, toggleDarkMode } = useTheme();

  const handleNavigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DropdownMenuLabel className="text-gray-900 dark:text-white">Configurações</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
        
        <DropdownMenuItem 
          onClick={toggleDarkMode} 
          className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {themeSettings.theme === 'dark' ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {themeSettings.theme === 'dark' ? 'Modo Claro' : 'Modo Noturno'}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
        
        <DropdownMenuItem 
          onClick={() => handleNavigateTo('/configuracoes/notificacoes')} 
          className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell className="mr-2 h-4 w-4" />
          Preferências de Notificação
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Monitor className="mr-2 h-4 w-4" />
            Aparência
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem 
              onClick={() => handleNavigateTo('/configuracoes/aparencia')} 
              className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sun className="mr-2 h-4 w-4" />
              Configurar Aparência
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Globe className="mr-2 h-4 w-4" />
            Idioma
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem 
              onClick={() => handleNavigateTo('/configuracoes/idioma')} 
              className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🇧🇷 Configurar Idioma
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
