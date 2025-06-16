import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, AlertTriangle } from 'lucide-react';
export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  useEffect(() => {
    console.log('Auth page carregada');
    // Verificar se o usuário já está autenticado
    const checkUser = async () => {
      console.log('Verificando usuário existente...');
      const {
        data: {
          session
        },
        error
      } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        return;
      }
      if (session) {
        console.log('Usuário já autenticado:', session.user.email);
        const from = location.state?.from?.pathname || '/painel';
        navigate(from, {
          replace: true
        });
      } else {
        console.log('Nenhuma sessão ativa encontrada');
      }
    };
    checkUser();
  }, [navigate, location]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentando fazer login com:', email);
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log('Resultado do login:', {
        data,
        error
      });
      if (error) {
        console.error('Erro no login:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Credenciais inválidas",
            description: "Email ou senha incorretos.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        console.log('Login bem-sucedido, verificando perfil...');

        // Aguardar um pouco para o perfil ser criado
        setTimeout(async () => {
          try {
            const {
              data: profile,
              error: profileError
            } = await supabase.from('profiles').select('empresa_id').eq('id', data.user?.id).single();
            console.log('Perfil encontrado:', profile);
            if (profileError) {
              console.error('Erro ao buscar perfil:', profileError);
              toast({
                title: "Erro",
                description: "Erro ao verificar perfil do usuário.",
                variant: "destructive"
              });
              return;
            }
            if (!profile?.empresa_id) {
              console.log('Usuário sem empresa associada');
              await supabase.auth.signOut();
              toast({
                title: "Acesso negado",
                description: "Usuário não está associado a nenhuma empresa. Entre em contato com o administrador.",
                variant: "destructive"
              });
              return;
            }
            console.log('Redirecionando para painel...');
            const from = location.state?.from?.pathname || '/painel';
            navigate(from, {
              replace: true
            });
          } catch (profileCheckError) {
            console.error('Erro ao verificar perfil:', profileCheckError);
            toast({
              title: "Erro",
              description: "Erro ao verificar dados do usuário.",
              variant: "destructive"
            });
          }
        }, 1000); // Aguardar 1 segundo para o perfil ser criado
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Amplie Chat</CardTitle>
          <CardDescription>
            Faça login para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </> : 'Entrar'}
            </Button>
          </form>
          
          
        </CardContent>
      </Card>
    </div>;
}