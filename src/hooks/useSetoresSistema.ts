
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SetorSistema {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export function useSetoresSistema() {
  const [setores, setSetores] = useState<SetorSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSetores();
  }, []);

  const loadSetores = async () => {
    try {
      const { data, error } = await supabase
        .from('setores_sistema')
        .select('*')
        .eq('ativo', true)
        .order('nome');

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
      console.error('Erro inesperado ao carregar setores:', error);
    } finally {
      setLoading(false);
    }
  };

  return { setores, loading, loadSetores };
}
