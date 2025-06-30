
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ExternalLink, Zap } from 'lucide-react';
import { WhatsAppConnectionsReal } from '@/components/whatsapp/WhatsAppConnectionsReal';
import { N8nConfigDialog } from '@/components/admin/N8nConfigDialog';
import { WebhookConfig } from '@/components/admin/WebhookConfig';

export function WhatsAppTab() {
  const [showN8nConfig, setShowN8nConfig] = useState(false);

  return (
    <div className="space-y-6">
      {/* Configuração n8n */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configuração n8n + Z-API
          </CardTitle>
          <CardDescription>
            Configure a integração completa entre n8n e Z-API para gerenciar mensagens do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                O n8n atua como middleware entre o Amplie Chat e a Z-API, permitindo flexibilidade 
                total no envio e recebimento de mensagens WhatsApp.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>✅ Suporte a texto, imagens e documentos</span>
                <span>✅ Workflows configuráveis</span>
                <span>✅ Escalabilidade</span>
              </div>
            </div>
            <Button onClick={() => setShowN8nConfig(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar Integração
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuração de Webhooks */}
      <WebhookConfig />

      {/* Conexões WhatsApp Existentes */}
      <WhatsAppConnectionsReal />

      {/* Links Úteis */}
      <Card>
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
          <CardDescription>
            Recursos externos para configuração completa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">n8n Cloud</h4>
                <p className="text-sm text-gray-500">Plataforma de automação</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://n8n.io" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Acessar
                </a>
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Z-API Dashboard</h4>
                <p className="text-sm text-gray-500">Painel de controle Z-API</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://developer.z-api.io" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Acessar
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Configuração N8n */}
      <N8nConfigDialog
        open={showN8nConfig}
        onOpenChange={setShowN8nConfig}
      />
    </div>
  );
}
