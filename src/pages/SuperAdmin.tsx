
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Settings, Smartphone, BarChart3, Loader2 } from 'lucide-react';
import EmpresasTab from '@/components/admin/EmpresasTab';
import PlanosTab from '@/components/admin/PlanosTab';
import WhatsAppTab from '@/components/admin/WhatsAppTab';
import UsuariosTab from '@/components/admin/UsuariosTab';
import ZApiConfigTab from '@/components/admin/ZApiConfigTab';
import RelatoriosEstatisticasCard from '@/components/admin/RelatoriosEstatisticasCard';
import { useUserRole } from '@/hooks/useUserRole';

export default function SuperAdmin() {
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();

  console.log('SuperAdmin - User:', user?.email);
  console.log('SuperAdmin - isSuperAdmin:', isSuperAdmin);
  console.log('SuperAdmin - authLoading:', authLoading);
  console.log('SuperAdmin - roleLoading:', roleLoading);

  // Aguardar o carregamento completo antes de tomar decisões
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Só redirecionar após ter certeza de que não é super admin
  if (!user || !isSuperAdmin) {
    console.log('Acesso negado - usuário:', user?.email, 'isSuperAdmin:', isSuperAdmin);
    return <Navigate to="/painel" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Super Administrador</h1>
          <p className="text-gray-600 mt-2">Gerencie todas as empresas, usuários e configurações da plataforma</p>
          <div className="mt-2 text-sm text-green-600">
            Acesso autorizado para: {user.email}
          </div>
        </div>

        {/* Estatísticas gerais */}
        <div className="mb-8">
          <RelatoriosEstatisticasCard />
        </div>

        <Tabs defaultValue="empresas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="empresas" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresas
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="planos" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Planos
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="zapi" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Z-API
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="empresas">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Empresas</CardTitle>
                <CardDescription>
                  Gerencie todas as empresas cadastradas na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmpresasTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie usuários de todas as empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsuariosTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planos">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Planos</CardTitle>
                <CardDescription>
                  Configure planos e permissões da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlanosTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle>Conexões WhatsApp</CardTitle>
                <CardDescription>
                  Monitore todas as conexões WhatsApp ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zapi">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Z-API</CardTitle>
                <CardDescription>
                  Gerencie as configurações Z-API de todas as empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ZApiConfigTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios e Análises</CardTitle>
                <CardDescription>
                  Visualize relatórios detalhados da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Relatórios detalhados em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
