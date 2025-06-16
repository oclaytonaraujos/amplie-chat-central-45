
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Settings, Smartphone } from 'lucide-react';
import EmpresasTab from '@/components/admin/EmpresasTab';
import PlanosTab from '@/components/admin/PlanosTab';
import WhatsAppTab from '@/components/admin/WhatsAppTab';
import UsuariosTab from '@/components/admin/UsuariosTab';
import { useSupabaseProfile } from '@/hooks/useSupabaseProfile';

export default function SuperAdmin() {
  const { user } = useAuth();
  const { profile, loading } = useSupabaseProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.cargo !== 'super_admin') {
    return <Navigate to="/painel" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Super Administrador</h1>
          <p className="text-gray-600 mt-2">Gerencie todas as empresas, usuários e configurações da plataforma</p>
        </div>

        <Tabs defaultValue="empresas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
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
        </Tabs>
      </div>
    </div>
  );
}
