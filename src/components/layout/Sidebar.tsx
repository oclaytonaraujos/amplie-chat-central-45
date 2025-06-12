
import {
  BarChart3,
  Building2,
  Bot,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Monitor,
  Settings,
  Trello,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";

interface MenuItem {
  name: string;
  path: string;
  icon: any;
  description: string;
}

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ isMobile = false, isOpen = true, onClose, onCollapsedChange }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: BarChart3,
      description: 'Visão geral do sistema'
    },
    {
      name: 'Usuários',
      path: '/usuarios',
      icon: Users,
      description: 'Gerencie usuários e permissões'
    },
    {
      name: 'Contatos',
      path: '/clientes',
      icon: UserCheck,
      description: 'Base de dados de contatos'
    },
    {
      name: 'Atendimento',
      path: '/atendimento',
      icon: MessageCircle,
      description: 'Gerencie conversas e atendimentos'
    },
    {
      name: 'Kanban',
      path: '/kanban',
      icon: Trello,
      description: 'Visualização em kanban'
    },
    {
      name: 'ChatBot',
      path: '/chatbot',
      icon: Bot,
      description: 'Configure o bot de atendimento'
    },
    {
      name: 'Chat Interno',
      path: '/chat-interno',
      icon: MessageSquare,
      description: 'Comunicação da equipe'
    },
    {
      name: 'Painel',
      path: '/painel',
      icon: Monitor,
      description: 'Painel de controle'
    },
    {
      name: 'Setores',
      path: '/setores',
      icon: Building2,
      description: 'Gerencie setores da empresa'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 py-4 w-64 border-r">
      <div className="px-4">
        <Button variant="outline" className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Menu
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={`w-full justify-start px-4 ${
              location.pathname === item.path ? "font-bold" : ""
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </Button>
        ))}
      </div>
      <Separator />
      <div className="mt-auto px-4">
        <Collapsible className="w-full space-y-2">
          <CollapsibleTrigger className="w-full flex items-center justify-between rounded-md border p-2">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                Geral
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Aparência
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Notificações
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
