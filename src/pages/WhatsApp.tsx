
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';

export default function WhatsApp() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Smartphone className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp</h1>
          <p className="text-gray-600">Gerencie suas conexões WhatsApp</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conexões WhatsApp</CardTitle>
          <CardDescription>
            Configure e monitore suas instâncias WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Configurações WhatsApp em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
