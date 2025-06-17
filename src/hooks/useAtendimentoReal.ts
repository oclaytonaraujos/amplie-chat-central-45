
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Conversa {
  id: string;
  agente_id: string | null;
  canal: string | null;
  contato_id: string | null;
  created_at: string | null;
  empresa_id: string | null;
  prioridade: string | null;
  setor: string | null;
  status: string | null;
  tags: string[] | null;
  updated_at: string | null;
  contatos?: {
    id: string;
    nome: string;
    telefone: string | null;
    email: string | null;
  } | null;
  profiles?: {
    id: string;
    nome: string;
    email: string;
  } | null;
  mensagens?: {
    id: string;
    conteudo: string;
    created_at: string | null;
    remetente_tipo: string;
    remetente_nome: string | null;
  }[];
}

interface Mensagem {
  id: string;
  conteudo: string;
  conversa_id: string | null;
  created_at: string | null;
  lida: boolean | null;
  metadata: any;
  remetente_id: string | null;
  remetente_nome: string | null;
  remetente_tipo: string;
  tipo_mensagem: string | null;
}

export function useAtendimentoReal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagensConversa, setMensagensConversa] = useState<Record<string, Mensagem[]>>({});

  // Carregar conversas do Supabase
  const loadConversas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar empresa_id do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!profile?.empresa_id) {
        console.error('Empresa não encontrada para o usuário');
        return;
      }

      const { data, error } = await supabase
        .from('conversas')
        .select(`
          *,
          contatos (
            id,
            nome,
            telefone,
            email
          ),
          profiles (
            id,
            nome,
            email
          )
        `)
        .eq('empresa_id', profile.empresa_id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar conversas:', error);
        toast({
          title: "Erro ao carregar conversas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setConversas(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar mensagens de uma conversa específica
  const loadMensagensConversa = async (conversaId: string) => {
    try {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        return;
      }

      setMensagensConversa(prev => ({
        ...prev,
        [conversaId]: data || []
      }));
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  // Enviar mensagem
  const enviarMensagem = async (conversaId: string, conteudo: string) => {
    if (!user) return false;

    try {
      // Buscar dados do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', user.id)
        .single();

      // Inserir mensagem no banco
      const { data, error } = await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversaId,
          conteudo,
          remetente_id: user.id,
          remetente_nome: profile?.nome || 'Agente',
          remetente_tipo: 'agente',
          tipo_mensagem: 'texto'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir mensagem:', error);
        toast({
          title: "Erro ao enviar mensagem",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // TODO: Integrar com Z-API para enviar via WhatsApp
      console.log('Mensagem inserida no banco:', data);
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  };

  // Atualizar status da conversa
  const atualizarStatusConversa = async (conversaId: string, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from('conversas')
        .update({ 
          status: novoStatus,
          agente_id: user?.id 
        })
        .eq('id', conversaId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  };

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscription para conversas
    const conversasChannel = supabase
      .channel('conversas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversas'
        },
        (payload) => {
          console.log('Conversa atualizada:', payload);
          loadConversas();
        }
      )
      .subscribe();

    // Subscription para mensagens
    const mensagensChannel = supabase
      .channel('mensagens-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens'
        },
        (payload) => {
          console.log('Nova mensagem:', payload);
          const novaMensagem = payload.new as Mensagem;
          if (novaMensagem.conversa_id) {
            setMensagensConversa(prev => ({
              ...prev,
              [novaMensagem.conversa_id!]: [
                ...(prev[novaMensagem.conversa_id!] || []),
                novaMensagem
              ]
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversasChannel);
      supabase.removeChannel(mensagensChannel);
    };
  }, [user]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadConversas();
    }
  }, [user]);

  return {
    conversas,
    loading,
    mensagensConversa,
    loadMensagensConversa,
    enviarMensagem,
    atualizarStatusConversa,
    loadConversas
  };
}
