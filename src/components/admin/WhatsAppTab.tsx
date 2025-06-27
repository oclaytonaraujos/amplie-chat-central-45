
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Settings } from 'lucide-react';
import ZApiConnectionTest from './ZApiConnectionTest';
import WhatsAppConnectionsReal from '@/components/whatsapp/WhatsAppConnectionsReal';

export default function WhatsAppTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Conexões WhatsApp</h3>
        <p className="text-sm text-gray-600">Monitore e teste as conexões WhatsApp de todas as empresas</p>
      </div>

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Conexões Ativas
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Teste de Conexão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Conexões WhatsApp Ativas</CardTitle>
              <CardDescription>
                Visualize todas as conexões WhatsApp configuradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WhatsAppConnectionsReal />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <ZApiConnectionTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
