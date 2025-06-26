
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Relatorios() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Visualize estatísticas e relatórios</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Relatórios</CardTitle>
          <CardDescription>
            Análises e estatísticas detalhadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Relatórios em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
