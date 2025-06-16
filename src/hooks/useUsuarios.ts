import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  setor?: string;
  cargo?: string;
  status: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Use Supabase's generated insert type for profiles table
type NovoUsuario = Database['public']['Tables']['profiles']['Insert'];

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarUsuario = async (usuario: NovoUsuario) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(usuario)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao criar usuário",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setUsuarios(prev => [data, ...prev]);
      toast({
        title: "Usuário criado",
        description: `${usuario.nome} foi adicionado com sucesso.`,
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return null;
    }
  };

  const editarUsuario = async (usuario: Usuario) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          nome: usuario.nome,
          email: usuario.email,
          setor: usuario.setor,
          cargo: usuario.cargo,
          status: usuario.status,
          avatar_url: usuario.avatar_url,
        })
        .eq('id', usuario.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao editar usuário",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setUsuarios(prev => prev.map(u => u.id === usuario.id ? data : u));
      toast({
        title: "Usuário atualizado",
        description: `As informações de ${usuario.nome} foram atualizadas.`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      return false;
    }
  };

  const excluirUsuario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir usuário",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      const usuario = usuarios.find(u => u.id === id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      toast({
        title: "Usuário excluído",
        description: `${usuario?.nome} foi removido do sistema.`,
        variant: "destructive"
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return false;
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    criarUsuario,
    editarUsuario,
    excluirUsuario,
    loadUsuarios,
  };
}
