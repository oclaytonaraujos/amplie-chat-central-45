
import { User, Settings, HelpCircle, LogOut, CreditCard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function ProfileDropdown() {
  const navigate = useNavigate();
  
  const userInfo = {
    name: 'João Silva',
    email: 'joao.silva@amplie.com',
    role: 'Administrador',
    avatar: null
  };

  const handleNavigateToProfile = () => {
    navigate('/meu-perfil');
  };

  const handleNavigateToPlano = () => {
    navigate('/plano-faturamento');
  };

  const handleNavigateToEquipe = () => {
    navigate('/gerenciar-equipe');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="w-8 h-8 bg-gradient-to-r from-amplie-primary to-amplie-primary-light rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white">
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amplie-primary to-amplie-primary-light rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{userInfo.name}</p>
              <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
              <p className="text-xs text-gray-400">{userInfo.role}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleNavigateToProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Meu Perfil
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleNavigateToPlano} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          Plano e Faturamento
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleNavigateToEquipe} className="cursor-pointer">
          <Users className="mr-2 h-4 w-4" />
          Gerenciar Equipe
        </DropdownMenuItem>
        
        <DropdownMenuItem className="sm:hidden">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          Ajuda e Suporte
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
