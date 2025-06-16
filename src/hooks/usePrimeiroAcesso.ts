
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function usePrimeiroAcesso() {
  const [isPrimeiroAcesso, setIsPrimeiroAcesso] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const verificarPrimeiroAcesso = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Verificar se o usuário já redefiniu a senha
        // Isso pode ser feito verificando se existe um campo específico no perfil
        // ou verificando quando foi a última atualização da senha
        const { data: profile } = await supabase
          .from('profiles')
          .select('created_at, updated_at')
          .eq('id', user.id)
          .single();

        if (profile) {
          // Se created_at e updated_at são muito próximos (menos de 5 minutos),
          // provavelmente é primeiro acesso
          const created = new Date(profile.created_at);
          const updated = new Date(profile.updated_at);
          const diffMinutes = (updated.getTime() - created.getTime()) / (1000 * 60);
          
          setIsPrimeiroAcesso(diffMinutes < 5);
        }
      } catch (error) {
        console.error('Erro ao verificar primeiro acesso:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarPrimeiroAcesso();
  }, [user]);

  const marcarSenhaRedefinida = async () => {
    if (!user) return;

    try {
      // Atualizar o perfil para marcar que a senha foi redefinida
      await supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id);

      setIsPrimeiroAcesso(false);
    } catch (error) {
      console.error('Erro ao marcar senha como redefinida:', error);
    }
  };

  return {
    isPrimeiroAcesso,
    loading,
    marcarSenhaRedefinida
  };
}
