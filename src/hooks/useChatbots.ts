
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Chatbot {
  id: string;
  empresa_id: string;
  nome: string;
  status: string;
  mensagem_inicial: string;
  fluxo: any[];
  interacoes: number;
  transferencias: number;
  created_at: string;
  updated_at: string;
}

interface FluxoItem {
  id: string;
  tipo: 'mensagem' | 'pergunta' | 'condicional' | 'transferencia';
  conteudo: string;
  opcoes?: string[];
  proximoPasso?: string;
  condicoes?: any;
}

export function useChatbots() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar chatbots
  const loadChatbots = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chatbots' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar chatbots:', error);
        toast({
          title: "Erro ao carregar chatbots",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setChatbots((data as unknown as Chatbot[]) || []);
    } catch (error) {
      console.error('Erro ao carregar chatbots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Criar chatbot
  const criarChatbot = async (dadosChatbot: Omit<Chatbot, 'id' | 'empresa_id' | 'interacoes' | 'transferencias' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      // Buscar empresa_id do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!profile?.empresa_id) {
        toast({
          title: "Erro",
          description: "Empresa não encontrada para o usuário",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('chatbots' as any)
        .insert({
          ...dadosChatbot,
          empresa_id: profile.empresa_id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar chatbot:', error);
        toast({
          title: "Erro ao criar chatbot",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setChatbots(prev => [data as unknown as Chatbot, ...prev]);
      
      toast({
        title: "Chatbot criado",
        description: "Chatbot criado com sucesso!",
      });

      return data as unknown as Chatbot;
    } catch (error) {
      console.error('Erro ao criar chatbot:', error);
      return null;
    }
  };

  // Atualizar chatbot
  const atualizarChatbot = async (id: string, dadosAtualizacao: Partial<Chatbot>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('chatbots' as any)
        .update(dadosAtualizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar chatbot:', error);
        toast({
          title: "Erro ao atualizar chatbot",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setChatbots(prev => 
        prev.map(chatbot => 
          chatbot.id === id ? { ...chatbot, ...data as unknown as Chatbot } : chatbot
        )
      );

      toast({
        title: "Chatbot atualizado",
        description: "Chatbot atualizado com sucesso!",
      });

      return data as unknown as Chatbot;
    } catch (error) {
      console.error('Erro ao atualizar chatbot:', error);
      return null;
    }
  };

  // Deletar chatbot
  const deletarChatbot = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('chatbots' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar chatbot:', error);
        toast({
          title: "Erro ao deletar chatbot",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setChatbots(prev => prev.filter(chatbot => chatbot.id !== id));
      
      toast({
        title: "Chatbot deletado",
        description: "Chatbot deletado com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar chatbot:', error);
      return false;
    }
  };

  // Ativar/Desativar chatbot
  const toggleStatusChatbot = async (id: string) => {
    const chatbot = chatbots.find(c => c.id === id);
    if (!chatbot) return;

    const novoStatus = chatbot.status === 'ativo' ? 'inativo' : 'ativo';
    return await atualizarChatbot(id, { status: novoStatus });
  };

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('chatbots-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chatbots'
        },
        () => {
          console.log('Chatbot atualizado, recarregando...');
          loadChatbots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadChatbots();
    }
  }, [user]);

  return {
    chatbots,
    loading,
    loadChatbots,
    criarChatbot,
    atualizarChatbot,
    deletarChatbot,
    toggleStatusChatbot
  };
}
