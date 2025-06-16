
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Auth from "@/pages/Auth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Atendimento from "./pages/Atendimento";
import ChatInterno from "./pages/ChatInterno";
import Contatos from "./pages/Contatos";
import Kanban from "./pages/Kanban";
import ChatBot from "./pages/ChatBot";
import Usuarios from "./pages/Usuarios";
import Setores from "./pages/Setores";
import GerenciarEquipe from "./pages/GerenciarEquipe";
import MeuPerfil from "./pages/MeuPerfil";
import PlanoFaturamento from "./pages/PlanoFaturamento";
import Painel from "./pages/Painel";
import NotFound from "./pages/NotFound";
import ConfiguracoesGerais from "./pages/configuracoes/ConfiguracoesGerais";
import ConfiguracoesAvancadas from "./pages/configuracoes/ConfiguracoesAvancadas";
import PreferenciasNotificacao from "./pages/configuracoes/PreferenciasNotificacao";
import Aparencia from "./pages/configuracoes/Aparencia";
import Idioma from "./pages/configuracoes/Idioma";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota de autenticação */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Rota pública inicial */}
            <Route path="/" element={<Index />} />
            
            {/* Rotas protegidas */}
            <Route path="/painel" element={
              <ProtectedRoute>
                <Layout>
                  <Painel />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/atendimento" element={
              <ProtectedRoute>
                <Layout>
                  <Atendimento />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/chat-interno" element={
              <ProtectedRoute>
                <Layout>
                  <ChatInterno />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/contatos" element={
              <ProtectedRoute>
                <Layout>
                  <Contatos />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/kanban" element={
              <ProtectedRoute>
                <Layout>
                  <Kanban />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Layout>
                  <ChatBot />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios" element={
              <ProtectedRoute>
                <Layout>
                  <Usuarios />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/setores" element={
              <ProtectedRoute>
                <Layout>
                  <Setores />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/gerenciar-equipe" element={
              <ProtectedRoute>
                <Layout>
                  <GerenciarEquipe />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/meu-perfil" element={
              <ProtectedRoute>
                <Layout>
                  <MeuPerfil />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/plano-faturamento" element={
              <ProtectedRoute>
                <Layout>
                  <PlanoFaturamento />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/configuracoes/gerais" element={
              <ProtectedRoute>
                <Layout>
                  <ConfiguracoesGerais />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/configuracoes/avancadas" element={
              <ProtectedRoute>
                <Layout>
                  <ConfiguracoesAvancadas />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/configuracoes/notificacoes" element={
              <ProtectedRoute>
                <Layout>
                  <PreferenciasNotificacao />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/configuracoes/aparencia" element={
              <ProtectedRoute>
                <Layout>
                  <Aparencia />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/configuracoes/idioma" element={
              <ProtectedRoute>
                <Layout>
                  <Idioma />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
