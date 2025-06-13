
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SystemProvider } from '@/contexts/SystemContext';
import { Layout } from '@/components/layout/Layout';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Atendimento from '@/pages/Atendimento';
import Kanban from '@/pages/Kanban';
import ChatInterno from '@/pages/ChatInterno';
import Contatos from '@/pages/Contatos';
import GerenciarEquipe from '@/pages/GerenciarEquipe';
import Usuarios from '@/pages/Usuarios';
import Setores from '@/pages/Setores';
import ChatBot from '@/pages/ChatBot';
import Painel from '@/pages/Painel';
import MeuPerfil from '@/pages/MeuPerfil';
import PlanoFaturamento from '@/pages/PlanoFaturamento';
import NotFound from '@/pages/NotFound';

// Configurações
import ConfiguracoesGerais from '@/pages/configuracoes/ConfiguracoesGerais';
import Aparencia from '@/pages/configuracoes/Aparencia';
import Idioma from '@/pages/configuracoes/Idioma';
import PreferenciasNotificacao from '@/pages/configuracoes/PreferenciasNotificacao';
import ConfiguracoesAvancadas from '@/pages/configuracoes/ConfiguracoesAvancadas';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SystemProvider>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/*"
                  element={
                    <Layout title="Amplie">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/atendimento" element={<Atendimento />} />
                        <Route path="/kanban" element={<Kanban />} />
                        <Route path="/chat-interno" element={<ChatInterno />} />
                        <Route path="/contatos" element={<Contatos />} />
                        <Route path="/gerenciar-equipe" element={<GerenciarEquipe />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/setores" element={<Setores />} />
                        <Route path="/chatbot" element={<ChatBot />} />
                        <Route path="/painel" element={<Painel />} />
                        <Route path="/meu-perfil" element={<MeuPerfil />} />
                        <Route path="/plano-faturamento" element={<PlanoFaturamento />} />
                        
                        {/* Rotas de Configurações */}
                        <Route path="/configuracoes/gerais" element={<ConfiguracoesGerais />} />
                        <Route path="/configuracoes/aparencia" element={<Aparencia />} />
                        <Route path="/configuracoes/idioma" element={<Idioma />} />
                        <Route path="/configuracoes/notificacoes" element={<PreferenciasNotificacao />} />
                        <Route path="/configuracoes/avancadas" element={<ConfiguracoesAvancadas />} />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  }
                />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </TooltipProvider>
      </SystemProvider>
    </QueryClientProvider>
  );
}

export default App;
