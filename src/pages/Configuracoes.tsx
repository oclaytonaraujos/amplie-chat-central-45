
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Personalize as configurações da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Configurações em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
