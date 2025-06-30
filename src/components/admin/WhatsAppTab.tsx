
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Unplug, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppConnectionsReal } from '@/components/whatsapp/WhatsAppConnectionsReal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WhatsAppConnection {
  id: string;
  nome: string;
  numero: string;
  status: string;
  empresa_id: string;
  ultimo_ping: string;
  ativo: boolean;
  empresas?: {
    nome: string;
  };
}

export default function WhatsAppTab() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .select(`
          *,
          empresas (nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Erro ao buscar conexões:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conexões WhatsApp",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const forceDisconnect = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_connections')
        .update({ 
          status: 'desconectado',
          ativo: false
        })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conexão desconectada com sucesso",
      });

      fetchConnections();
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast({
        title: "Erro",
        description: "Erro ao desconectar conexão",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'conectado': { variant: 'default' as const, label: 'Conectado' },
      'desconectado': { variant: 'secondary' as const, label: 'Desconectado' },
      'pendente': { variant: 'outline' as const, label: 'Pendente' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: 'secondary' as const, label: status };
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center">Carregando conexões WhatsApp...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Conexões WhatsApp Ativas</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowConnectionTest(!showConnectionTest)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showConnectionTest ? 'Ocultar' : 'Mostrar'} Teste de Conexão
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Smartphone className="h-4 w-4" />
            {connections.length} conexões totais
          </div>
        </div>
      </div>

      {showConnectionTest && (
        <Card>
          <CardHeader>
            <CardTitle>Teste de Conexão Z-API</CardTitle>
            <CardDescription>
              Teste a conectividade com a Z-API e conecte seu WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WhatsAppConnectionsReal />
          </CardContent>
        </Card>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Ping</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Nenhuma conexão WhatsApp encontrada
                </TableCell>
              </TableRow>
            ) : (
              connections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">{connection.nome}</TableCell>
                  <TableCell>{connection.numero}</TableCell>
                  <TableCell>{connection.empresas?.nome || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(connection.status)}</TableCell>
                  <TableCell>
                    {connection.ultimo_ping ? 
                      new Date(connection.ultimo_ping).toLocaleString('pt-BR') : 
                      'Nunca'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {connection.status === 'conectado' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => forceDisconnect(connection.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Unplug className="h-4 w-4 mr-1" />
                          Desconectar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
