
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface SetorData {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ativo: boolean;
  empresa_id?: string;
  created_at: string;
}

export function useSetoresData() {
  const [setores, setSetores] = useState<SetorData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadSetores = async () => {
    try {
      setLoading(true);
      
      // Primeiro, obter a empresa_id do usuário atual
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user?.id)
        .single();

      if (!currentProfile?.empresa_id) {
        console.error('Usuário não está associado a uma empresa');
        return;
      }

      const { data, error } = await supabase
        .from('setores')
        .select('*')
        .eq('empresa_id', currentProfile.empresa_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar setores:', error);
        toast({
          title: "Erro ao carregar setores",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSetores(data || []);
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarSetor = async (setor: Omit<SetorData, 'id' | 'created_at' | 'empresa_id'>) => {
    try {
      // Obter a empresa_id do usuário atual
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user?.id)
        .single();

      if (!currentProfile?.empresa_id) {
        toast({
          title: "Erro",
          description: "Usuário não está associado a uma empresa.",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('setores')
        .insert([{
          ...setor,
          empresa_id: currentProfile.empresa_id
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao criar setor",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setSetores(prev => [data, ...prev]);
      toast({
        title: "Setor criado",
        description: `${setor.nome} foi criado com sucesso.`,
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar setor:', error);
      return null;
    }
  };

  const editarSetor = async (setor: SetorData) => {
    try {
      const { data, error } = await supabase
        .from('setores')
        .update({
          nome: setor.nome,
          descricao: setor.descricao,
          cor: setor.cor,
          ativo: setor.ativo,
        })
        .eq('id', setor.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao editar setor",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setSetores(prev => prev.map(s => s.id === setor.id ? data : s));
      toast({
        title: "Setor atualizado",
        description: `${setor.nome} foi atualizado com sucesso.`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao editar setor:', error);
      return false;
    }
  };

  const excluirSetor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('setores')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir setor",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      const setor = setores.find(s => s.id === id);
      setSetores(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Setor excluído",
        description: `${setor?.nome} foi removido do sistema.`,
        variant: "destructive"
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir setor:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadSetores();
    }
  }, [user]);

  return {
    setores,
    loading,
    criarSetor,
    editarSetor,
    excluirSetor,
    loadSetores,
  };
}
