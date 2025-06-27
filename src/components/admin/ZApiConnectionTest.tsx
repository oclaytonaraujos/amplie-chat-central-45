
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, CheckCircle, XCircle, QrCode } from 'lucide-react';
import { useZApiReal } from '@/hooks/useZApiReal';
import { useToast } from '@/hooks/use-toast';

export default function ZApiConnectionTest() {
  const { config, loading, conectando, obterQRCode, verificarStatus, enviarMensagem } = useZApiReal();
  const [qrCode, setQrCode] = useState<string>('');
  const [status, setStatus] = useState<any>(null);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Teste de conexão Z-API');
  const [sendingTest, setSendingTest] = useState(false);
  const { toast } = useToast();

  const handleGetQRCode = async () => {
    try {
      const response = await obterQRCode();
      if (response.value && response.qrcode) {
        setQrCode(response.qrcode);
        toast({
          title: "QR Code obtido",
          description: "Escaneie o QR Code com seu WhatsApp",
        });
      } else {
        toast({
          title: "Erro",
          description: response.message || "Não foi possível obter o QR Code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      toast({
        title: "Erro",
        description: "Erro ao obter QR Code",
        variant: "destructive",
      });
    }
  };

  const handleCheckStatus = async () => {
    try {
      const response = await verificarStatus();
      setStatus(response);
      toast({
        title: "Status verificado",
        description: `Status: ${response.status || response.message}`,
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar status",
        variant: "destructive",
      });
    }
  };

  const handleSendTest = async () => {
    if (!testPhone || !testMessage) {
      toast({
        title: "Erro",
        description: "Preencha o telefone e a mensagem",
        variant: "destructive",
      });
      return;
    }

    setSendingTest(true);
    try {
      const success = await enviarMensagem(testPhone, testMessage);
      if (success) {
        toast({
          title: "Mensagem enviada",
          description: "Mensagem de teste enviada com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha ao enviar mensagem de teste",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem de teste",
        variant: "destructive",
      });
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando configurações...</span>
        </CardContent>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma configuração Z-API</h3>
          <p className="text-gray-500">Configure uma instância Z-API primeiro na aba Z-API</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Teste de Conexão Z-API
          </CardTitle>
          <CardDescription>
            Teste a conexão com a instância Z-API configurada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Instância ID:</p>
              <p className="text-sm text-gray-600 font-mono">{config.instance_id}</p>
            </div>
            <Badge variant={config.ativo ? "default" : "secondary"}>
              {config.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCheckStatus} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Verificar Status
            </Button>
            <Button onClick={handleGetQRCode} disabled={conectando}>
              {conectando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Obtendo...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Obter QR Code
                </>
              )}
            </Button>
          </div>

          {status && (
            <Alert>
              <div className="flex items-center space-x-2">
                {status.value ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  <strong>Status:</strong> {status.status || status.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {qrCode && (
            <div className="text-center">
              <p className="mb-2 font-medium">Escaneie o QR Code com seu WhatsApp:</p>
              <img 
                src={qrCode} 
                alt="QR Code Z-API" 
                className="mx-auto border rounded-lg max-w-64"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teste de Envio de Mensagem</CardTitle>
          <CardDescription>
            Envie uma mensagem de teste para verificar se tudo está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Telefone (com código do país):
            </label>
            <input
              type="text"
              placeholder="Ex: 5511999999999"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mensagem:
            </label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={handleSendTest} disabled={sendingTest}>
            {sendingTest ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Mensagem Teste'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
