
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Grid2X2,
  Settings, 
  Building2,
  Bot
} from 'lucide-react';
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Atendimento from "./pages/Atendimento";
import Kanban from "./pages/Kanban";
import ChatBot from "./pages/ChatBot";
import Painel from "./pages/Painel";
import Setores from "./pages/Setores";
import NotFound from "./pages/NotFound";

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
              description="Bem-vindo ao painel de controle do Amplie Chat"
              icon={LayoutDashboard}
            >
              <Dashboard />
            </Layout>
          } />
          <Route path="/usuarios" element={
            <Layout 
              title="Gestão de Usuários" 
              description="Gerencie os usuários e suas permissões"
              icon={Users}
            >
              <Usuarios />
            </Layout>
          } />
          <Route path="/atendimento" element={
            <Layout 
              title="Atendimento" 
              description="Gerencie os atendimentos e conversas"
              icon={MessageSquare}
            >
              <Atendimento />
            </Layout>
          } />
          <Route path="/kanban" element={
            <Layout 
              title="Kanban" 
              description="Visualize e organize os atendimentos"
              icon={Grid2X2}
            >
              <Kanban />
            </Layout>
          } />
          <Route path="/chatbot" element={
            <Layout 
              title="ChatBot" 
              description="Configure e gerencie o chatbot"
              icon={Bot}
            >
              <ChatBot />
            </Layout>
          } />
          <Route path="/painel" element={
            <Layout 
              title="Painel" 
              description="Configurações gerais do sistema"
              icon={Settings}
            >
              <Painel />
            </Layout>
          } />
          <Route path="/setores" element={
            <Layout 
              title="Setores" 
              description="Gerencie os setores da empresa"
              icon={Building2}
            >
              <Setores />
            </Layout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
