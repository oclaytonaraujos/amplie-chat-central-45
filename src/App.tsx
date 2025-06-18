
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ThemeProvider } from '@/hooks/useTheme';
import { Layout } from '@/components/layout/Layout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Kanban from '@/pages/Kanban';
import Contatos from '@/pages/Contatos';
import ChatBot from '@/pages/ChatBot';
import Manual from '@/pages/Manual';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Navigate to="/" replace />} />
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
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/relatorios" element={
                <ProtectedRoute>
                  <Layout title="Relatórios">
                    <Dashboard />
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
                    <Dashboard />
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
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Toaster />
          <SonnerToaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
