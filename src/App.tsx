
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Kanban from '@/pages/Kanban';
import Contatos from '@/pages/Contatos';
import Chamadas from '@/pages/Chamadas';
import Relatorios from '@/pages/Relatorios';
import ChatBot from '@/pages/ChatBot';
import WhatsApp from '@/pages/WhatsApp';
import Manual from '@/pages/Manual';
import Configuracoes from '@/pages/Configuracoes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout title="Dashboard">
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/kanban" element={
                  <ProtectedRoute>
                    <Layout title="Kanban">
                      <Kanban />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/contatos" element={
                  <ProtectedRoute>
                    <Layout title="Contatos">
                      <Contatos />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/chamadas" element={
                  <ProtectedRoute>
                    <Layout title="Chamadas">
                      <Chamadas />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/relatorios" element={
                  <ProtectedRoute>
                    <Layout title="Relatórios">
                      <Relatorios />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/chatbot" element={
                  <ProtectedRoute>
                    <Layout title="ChatBot">
                      <ChatBot />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/whatsapp" element={
                  <ProtectedRoute>
                    <Layout title="WhatsApp">
                      <WhatsApp />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/manual" element={
                  <ProtectedRoute>
                    <Layout title="Manual">
                      <Manual />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes" element={
                  <ProtectedRoute>
                    <Layout title="Configurações">
                      <Configuracoes />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Toaster />
            <SonnerToaster position="top-right" />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
