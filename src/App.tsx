
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
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          } />
          <Route path="/usuarios" element={
            <Layout title="Usuários">
              <Usuarios />
            </Layout>
          } />
          <Route path="/atendimento" element={
            <Layout title="Atendimento">
              <Atendimento />
            </Layout>
          } />
          <Route path="/kanban" element={
            <Layout title="Kanban">
              <Kanban />
            </Layout>
          } />
          <Route path="/painel" element={
            <Layout title="Painel">
              <Painel />
            </Layout>
          } />
          <Route path="/setores" element={
            <Layout title="Setores">
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
