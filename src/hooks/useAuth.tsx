
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

// Função para criar perfil do usuário quando necessário
const createUserProfile = async (user: User) => {
  try {
    // Verificar se o perfil já existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      console.log('Perfil já existe para o usuário');
      return;
    }

    // Buscar a empresa Amplie Marketing
    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('email', 'ampliemarketing.mkt@gmail.com')
      .single();

    if (!empresa) {
      console.error('Empresa Amplie Marketing não encontrada');
      return;
    }

    // Determinar se é o usuário admin
    const isAdmin = user.email === 'ampliemarketing.mkt@gmail.com';
    
    // Criar o perfil do usuário
    const profileData = {
      id: user.id,
      nome: isAdmin ? 'Administrador' : user.email?.split('@')[0] || 'Usuário',
      email: user.email || '',
      empresa_id: empresa.id,
      cargo: isAdmin ? 'admin' : 'usuario',
      setor: isAdmin ? 'Administração' : 'Geral',
      status: 'online'
    };

    const { error } = await supabase
      .from('profiles')
      .insert(profileData);

    if (error) {
      console.error('Erro ao criar perfil:', error);
    } else {
      console.log('Perfil criado com sucesso para:', user.email);
    }
  } catch (error) {
    console.error('Erro ao processar criação de perfil:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Se o usuário acabou de fazer login, criar perfil se necessário
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            createUserProfile(session.user);
          }, 100);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Se já há uma sessão ativa, verificar perfil
      if (session?.user) {
        setTimeout(() => {
          createUserProfile(session.user);
        }, 100);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
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
