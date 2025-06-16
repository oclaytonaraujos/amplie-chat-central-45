
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando role para usuário:', user.email);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('cargo')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar cargo do usuário:', error);
          setRole(null);
        } else {
          console.log('Cargo encontrado:', data?.cargo);
          setRole(data?.cargo || null);
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar cargo:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  return { 
    role, 
    loading,
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin' || role === 'super_admin'
  };
}
