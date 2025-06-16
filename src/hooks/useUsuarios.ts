import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  setor?: string;
  cargo?: string;
  status: string;
  avatar_url?: string;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
  permissoes?: string[];
}

interface NovoUsuario {
  nome: string;
  email: string;
  setor: string;
  cargo: string;
  status: string;
  permissoes?: string[];
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      console.log('Carregando usuários...');
      console.log('User:', user?.email);
      console.log('IsSuperAdmin:', isSuperAdmin);
      
      if (isSuperAdmin) {
        console.log('Carregando todos os usuários (super admin)');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar usuários (super admin):', error);
          toast({
            title: "Erro ao carregar usuários",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        console.log('Usuários carregados (super admin):', data?.length);
        setUsuarios(data?.map(u => ({ ...u, permissoes: u.permissoes || [] })) || []);
      } else {
        console.log('Carregando usuários da empresa');
        
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('empresa_id')
          .eq('id', user?.id)
          .single();

        if (!currentProfile?.empresa_id) {
          console.error('Usuário não está associado a uma empresa');
          setUsuarios([]);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('empresa_id', currentProfile.empresa_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar usuários da empresa:', error);
          toast({
            title: "Erro ao carregar usuários",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        console.log('Usuários da empresa carregados:', data?.length);
        setUsuarios(data?.map(u => ({ ...u, permissoes: u.permissoes || [] })) || []);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const criarUsuario = async (usuario: NovoUsuario) => {
    try {
      console.log('Criando usuário:', usuario);
      
      let empresaId;
      
      if (isSuperAdmin && 'empresa_id' in usuario) {
        empresaId = (usuario as any).empresa_id;
      } else {
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
        empresaId = currentProfile.empresa_id;
      }

      const novoId = crypto.randomUUID();

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: novoId,
          nome: usuario.nome,
          email: usuario.email,
          empresa_id: empresaId,
          cargo: usuario.cargo,
          setor: usuario.setor,
          status: usuario.status,
          permissoes: usuario.permissoes || []
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        toast({
          title: "Erro ao criar usuário",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      console.log('Usuário criado com sucesso:', data);
      const novoUsuario = { ...data, permissoes: data.permissoes || [] };
      setUsuarios(prev => [novoUsuario, ...prev]);
      toast({
        title: "Usuário criado",
        description: `${usuario.nome} foi adicionado com sucesso.`,
      });
      return novoUsuario;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar usuário",
        variant: "destructive",
      });
      return null;
    }
  };

  const editarUsuario = async (usuario: Usuario) => {
    try {
      console.log('Editando usuário:', usuario);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          nome: usuario.nome,
          email: usuario.email,
          setor: usuario.setor,
          cargo: usuario.cargo,
          status: usuario.status,
          avatar_url: usuario.avatar_url,
          permissoes: usuario.permissoes || []
        })
        .eq('id', usuario.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao editar usuário:', error);
        toast({
          title: "Erro ao editar usuário",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('Usuário editado com sucesso:', data);
      const usuarioEditado = { ...data, permissoes: data.permissoes || [] };
      setUsuarios(prev => prev.map(u => u.id === usuario.id ? usuarioEditado : u));
      toast({
        title: "Usuário atualizado",
        description: `As informações de ${usuario.nome} foram atualizadas.`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao editar usuário",
        variant: "destructive",
      });
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
    if (user && !roleLoading) {
      loadUsuarios();
    }
  }, [user, isSuperAdmin, roleLoading]);

  return {
    usuarios,
    loading,
    criarUsuario,
    editarUsuario,
    excluirUsuario,
    loadUsuarios,
  };
}
