
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SystemProvider } from "@/contexts/SystemContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Atendimento from "./pages/Atendimento";
import Contatos from "./pages/Contatos";
import Kanban from "./pages/Kanban";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SystemProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/atendimento" element={<Atendimento />} />
              <Route path="/contatos" element={<Contatos />} />
              <Route path="/kanban" element={<Kanban />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </SystemProvider>
  </QueryClientProvider>
);

export default App;
