
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SetorData {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ativo: boolean;
  created_at: string;
}

export function useSetoresData() {
  const [setores, setSetores] = useState<SetorData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSetores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('setores')
        .select('*')
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

  const criarSetor = async (setor: Omit<SetorData, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('setores')
        .insert([setor])
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
    loadSetores();
  }, []);

  return {
    setores,
    loading,
    criarSetor,
    editarSetor,
    excluirSetor,
    loadSetores,
  };
}
