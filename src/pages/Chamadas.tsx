
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export default function Chamadas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Phone className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chamadas</h1>
          <p className="text-gray-600">Gerencie suas chamadas telefônicas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Central de Chamadas</CardTitle>
          <CardDescription>
            Sistema de gerenciamento de chamadas em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
