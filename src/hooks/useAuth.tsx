
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Função para criar usuário super admin
const createSuperAdmin = async () => {
  try {
    console.log('Criando usuário super admin...');
    
    const { data, error } = await supabase.auth.signUp({
      email: 'amplie-admin@ampliemarketing.com',
      password: 'Amplie123@',
      options: {
        data: {
          nome: 'Amplie Admin'
        }
      }
    });

    if (error) {
      console.error('Erro ao criar super admin:', error);
      return;
    }

    console.log('Super admin criado com sucesso:', data);
  } catch (error) {
    console.error('Erro inesperado ao criar super admin:', error);
  }
};

// Função para criar perfil do usuário quando necessário
const createUserProfile = async (user: User) => {
  try {
    console.log('Iniciando criação de perfil para:', user.email);
    
    // Verificar se o perfil já existe
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil existente:', profileError);
      return;
    }

    if (existingProfile) {
      console.log('Perfil já existe para o usuário');
      return;
    }

    // Buscar a empresa Amplie Marketing
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('id')
      .eq('email', 'ampliemarketing.mkt@gmail.com')
      .single();

    if (empresaError) {
      console.error('Erro ao buscar empresa:', empresaError);
      // Se não encontrar a empresa, vamos criar uma empresa padrão
      const { data: novaEmpresa, error: criarEmpresaError } = await supabase
        .from('empresas')
        .insert({
          nome: 'Amplie Marketing',
          email: 'ampliemarketing.mkt@gmail.com'
        })
        .select()
        .single();

      if (criarEmpresaError) {
        console.error('Erro ao criar empresa:', criarEmpresaError);
        return;
      }
      
      console.log('Empresa criada:', novaEmpresa);
      
      // Usar a nova empresa
      await createProfile(user, novaEmpresa.id);
    } else {
      console.log('Empresa encontrada:', empresa);
      await createProfile(user, empresa.id);
    }
  } catch (error) {
    console.error('Erro geral ao processar criação de perfil:', error);
  }
};

const createProfile = async (user: User, empresaId: string) => {
  if (!user.email) {
    console.error('Usuário sem email, não é possível criar perfil');
    return;
  }

  // Determinar se é o usuário admin
  const isAdmin = user.email === 'ampliemarketing.mkt@gmail.com';
  const isSuperAdmin = user.email === 'amplie-admin@ampliemarketing.com';
  
  // Criar o perfil do usuário
  const profileData = {
    id: user.id,
    nome: isSuperAdmin ? 'Amplie Admin' : isAdmin ? 'Administrador' : user.email.split('@')[0] || 'Usuário',
    email: user.email,
    empresa_id: empresaId,
    cargo: isSuperAdmin ? 'super_admin' : isAdmin ? 'admin' : 'usuario',
    setor: isSuperAdmin || isAdmin ? 'Administração' : 'Geral',
    status: 'online'
  };

  console.log('Criando perfil com dados:', profileData);

  const { error } = await supabase
    .from('profiles')
    .insert(profileData);

  if (error) {
    console.error('Erro ao criar perfil:', error);
  } else {
    console.log('Perfil criado com sucesso para:', user.email);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Configurando auth listener...');
    
    // Criar super admin na inicialização (apenas uma vez)
    const initializeSuperAdmin = async () => {
      try {
        // Verificar se super admin já existe
        const { data: users, error } = await supabase.auth.admin.listUsers();
        
        if (!error) {
          const superAdminExists = users.users.some(u => u.email === 'amplie-admin@ampliemarketing.com');
          
          if (!superAdminExists) {
            await createSuperAdmin();
          }
        }
      } catch (error) {
        console.log('Tentando criar super admin via signup:', error);
        // Se não conseguir via admin, tentar via signup normal
        await createSuperAdmin();
      }
    };
    
    initializeSuperAdmin();
    
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Se o usuário acabou de fazer login, criar perfil se necessário
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Usuário fez login, verificando perfil...');
          setTimeout(() => {
            createUserProfile(session.user);
          }, 100);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Erro ao obter sessão:', error);
      }
      
      console.log('Sessão inicial:', session?.user?.email || 'Nenhuma sessão');
      setSession(session);
      setUser(session?.user ?? null);
      
      // Se já há uma sessão ativa, verificar perfil
      if (session?.user) {
        console.log('Sessão ativa encontrada, verificando perfil...');
        setTimeout(() => {
          createUserProfile(session.user);
        }, 100);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('Fazendo logout...');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
