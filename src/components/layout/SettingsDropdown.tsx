
import { Settings, User, Shield, Bell, Monitor, Moon, Sun, Globe } from 'lucide-react';
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

export function SettingsDropdown() {
  const navigate = useNavigate();

  const handleNavigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Settings className="w-5 h-5 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white">
        <DropdownMenuLabel>Configurações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigateTo('/configuracoes/conta')} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Configurações da Conta
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigateTo('/configuracoes/privacidade')} className="cursor-pointer">
          <Shield className="mr-2 h-4 w-4" />
          Privacidade e Segurança
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigateTo('/configuracoes/notificacoes')} className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          Preferências de Notificação
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 h-4 w-4" />
            Aparência
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white">
            <DropdownMenuItem onClick={() => handleNavigateTo('/configuracoes/aparencia')} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              Configurar Aparência
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe className="mr-2 h-4 w-4" />
            Idioma
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white">
            <DropdownMenuItem onClick={() => handleNavigateTo('/configuracoes/idioma')} className="cursor-pointer">
              🇧🇷 Configurar Idioma
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigateTo('/configuracoes/avancadas')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Configurações Avançadas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
