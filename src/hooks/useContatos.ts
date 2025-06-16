
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Contato {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  empresa?: string;
  tags?: string[];
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export function useContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadContatos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar contatos:', error);
        toast({
          title: "Erro ao carregar contatos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setContatos(data || []);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarContato = async (contato: Omit<Contato, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('contatos')
        .insert([contato])
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao criar contato",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setContatos(prev => [data, ...prev]);
      toast({
        title: "Contato criado",
        description: `${contato.nome} foi adicionado com sucesso.`,
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      return null;
    }
  };

  const editarContato = async (contato: Contato) => {
    try {
      const { data, error } = await supabase
        .from('contatos')
        .update({
          nome: contato.nome,
          telefone: contato.telefone,
          email: contato.email,
          empresa: contato.empresa,
          tags: contato.tags,
          observacoes: contato.observacoes,
        })
        .eq('id', contato.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao editar contato",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setContatos(prev => prev.map(c => c.id === contato.id ? data : c));
      toast({
        title: "Contato atualizado",
        description: `As informações de ${contato.nome} foram atualizadas.`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao editar contato:', error);
      return false;
    }
  };

  const excluirContato = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir contato",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      const contato = contatos.find(c => c.id === id);
      setContatos(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Contato excluído",
        description: `${contato?.nome} foi removido do sistema.`,
        variant: "destructive"
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      return false;
    }
  };

  useEffect(() => {
    loadContatos();
  }, []);

  return {
    contatos,
    loading,
    criarContato,
    editarContato,
    excluirContato,
    loadContatos,
  };
}
