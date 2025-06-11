
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Atendimento from "./pages/Atendimento";
import Kanban from "./pages/Kanban";
import ChatBot from "./pages/ChatBot";
import Painel from "./pages/Painel";
import Setores from "./pages/Setores";
import MeuPerfil from "./pages/MeuPerfil";
import ConfiguracoesGerais from "./pages/configuracoes/ConfiguracoesGerais";
import PrivacidadeSeguranca from "./pages/configuracoes/PrivacidadeSeguranca";
import PreferenciasNotificacao from "./pages/configuracoes/PreferenciasNotificacao";
import Aparencia from "./pages/configuracoes/Aparencia";
import Idioma from "./pages/configuracoes/Idioma";
import ConfiguracoesAvancadas from "./pages/configuracoes/ConfiguracoesAvancadas";
import NotFound from "./pages/NotFound";
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  Trello, 
  Bot, 
  Monitor, 
  Building2,
  User,
  Shield,
  Bell,
  Globe,
  Settings
} from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout 
              title="Dashboard" 
              description="Visão geral do sistema"
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
            >
              <Dashboard />
            </Layout>
          } />
          <Route path="/usuarios" element={
            <Layout 
              title="Usuários" 
              description="Gerencie os usuários e suas permissões"
              icon={<Users className="w-6 h-6 text-green-400" />}
            >
              <Usuarios />
            </Layout>
          } />
          <Route path="/atendimento" element={
            <Layout 
              title="Atendimento" 
              description="Gerencie conversas e atendimentos"
              icon={<MessageCircle className="w-6 h-6 text-purple-400" />}
            >
              <Atendimento />
            </Layout>
          } />
          <Route path="/kanban" element={
            <Layout 
              title="Kanban" 
              description="Visualização em kanban dos atendimentos"
              icon={<Trello className="w-6 h-6 text-orange-400" />}
            >
              <Kanban />
            </Layout>
          } />
          <Route path="/chatbot" element={
            <Layout 
              title="ChatBot" 
              description="Configure e gerencie o bot de atendimento"
              icon={<Bot className="w-6 h-6 text-indigo-400" />}
            >
              <ChatBot />
            </Layout>
          } />
          <Route path="/painel" element={
            <Layout 
              title="Painel" 
              description="Painel de controle e monitoramento"
              icon={<Monitor className="w-6 h-6 text-red-400" />}
            >
              <Painel />
            </Layout>
          } />
          <Route path="/setores" element={
            <Layout 
              title="Setores" 
              description="Gerencie os setores da empresa"
              icon={<Building2 className="w-6 h-6 text-teal-400" />}
            >
              <Setores />
            </Layout>
          } />
          <Route path="/meu-perfil" element={
            <Layout 
              title="Meu Perfil" 
              description="Gerencie suas informações pessoais"
              icon={<User className="w-6 h-6 text-gray-400" />}
            >
              <MeuPerfil />
            </Layout>
          } />
          <Route path="/configuracoes/conta" element={
            <Layout 
              title="Configurações da Conta" 
              description="Gerencie suas informações de conta"
              icon={<User className="w-6 h-6 text-blue-400" />}
            >
              <ConfiguracoesGerais />
            </Layout>
          } />
          <Route path="/configuracoes/privacidade" element={
            <Layout 
              title="Privacidade e Segurança" 
              description="Configure suas preferências de privacidade"
              icon={<Shield className="w-6 h-6 text-green-400" />}
            >
              <PrivacidadeSeguranca />
            </Layout>
          } />
          <Route path="/configuracoes/notificacoes" element={
            <Layout 
              title="Preferências de Notificação" 
              description="Configure como receber notificações"
              icon={<Bell className="w-6 h-6 text-purple-400" />}
            >
              <PreferenciasNotificacao />
            </Layout>
          } />
          <Route path="/configuracoes/aparencia" element={
            <Layout 
              title="Aparência" 
              description="Personalize a aparência da interface"
              icon={<Monitor className="w-6 h-6 text-orange-400" />}
            >
              <Aparencia />
            </Layout>
          } />
          <Route path="/configuracoes/idioma" element={
            <Layout 
              title="Idioma e Região" 
              description="Configure preferências de idioma e localização"
              icon={<Globe className="w-6 h-6 text-indigo-400" />}
            >
              <Idioma />
            </Layout>
          } />
          <Route path="/configuracoes/avancadas" element={
            <Layout 
              title="Configurações Avançadas" 
              description="Configurações técnicas e avançadas"
              icon={<Settings className="w-6 h-6 text-red-400" />}
            >
              <ConfiguracoesAvancadas />
            </Layout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
