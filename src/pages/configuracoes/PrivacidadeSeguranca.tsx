
import { useState } from 'react';
import { Shield, Lock, Eye, UserCheck, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function PrivacidadeSeguranca() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    dataCollection: false,
    analyticsTracking: true,
    thirdPartySharing: false,
    marketingEmails: true,
    activityLogging: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    loginAlerts: true,
    deviceTracking: true,
    ipWhitelist: false,
    apiAccess: false,
    dataEncryption: true,
    sessionMonitoring: true
  });

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleDataDownload = () => {
    console.log('Iniciando download dos dados do usuário...');
  };

  const handleAccountDeletion = () => {
    console.log('Solicitando exclusão da conta...');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Privacidade e Segurança</h1>
        <p className="text-gray-500">Controle suas configurações de privacidade e segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Privacidade */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-amplie-primary" />
            Configurações de Privacidade
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Visibilidade do Perfil</Label>
                <p className="text-sm text-gray-500">Permitir que outros vejam seu perfil</p>
              </div>
              <Switch
                checked={privacySettings.profileVisibility}
                onCheckedChange={(checked) => handlePrivacyChange('profileVisibility', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Coleta de Dados</Label>
                <p className="text-sm text-gray-500">Permitir coleta de dados de uso</p>
              </div>
              <Switch
                checked={privacySettings.dataCollection}
                onCheckedChange={(checked) => handlePrivacyChange('dataCollection', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Rastreamento de Analytics</Label>
                <p className="text-sm text-gray-500">Ajudar a melhorar nossos serviços</p>
              </div>
              <Switch
                checked={privacySettings.analyticsTracking}
                onCheckedChange={(checked) => handlePrivacyChange('analyticsTracking', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Compartilhamento com Terceiros</Label>
                <p className="text-sm text-gray-500">Permitir compartilhamento de dados</p>
              </div>
              <Switch
                checked={privacySettings.thirdPartySharing}
                onCheckedChange={(checked) => handlePrivacyChange('thirdPartySharing', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Emails de Marketing</Label>
                <p className="text-sm text-gray-500">Receber ofertas e novidades</p>
              </div>
              <Switch
                checked={privacySettings.marketingEmails}
                onCheckedChange={(checked) => handlePrivacyChange('marketingEmails', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Log de Atividades</Label>
                <p className="text-sm text-gray-500">Registrar suas atividades no sistema</p>
              </div>
              <Switch
                checked={privacySettings.activityLogging}
                onCheckedChange={(checked) => handlePrivacyChange('activityLogging', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Configurações de Segurança */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-amplie-primary" />
            Configurações de Segurança
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Alertas de Login</Label>
                <p className="text-sm text-gray-500">Notificar sobre tentativas de login</p>
              </div>
              <Switch
                checked={securitySettings.loginAlerts}
                onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Rastreamento de Dispositivos</Label>
                <p className="text-sm text-gray-500">Monitorar dispositivos conectados</p>
              </div>
              <Switch
                checked={securitySettings.deviceTracking}
                onCheckedChange={(checked) => handleSecurityChange('deviceTracking', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Lista Branca de IPs</Label>
                <p className="text-sm text-gray-500">Restringir acesso por endereço IP</p>
              </div>
              <Switch
                checked={securitySettings.ipWhitelist}
                onCheckedChange={(checked) => handleSecurityChange('ipWhitelist', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Acesso à API</Label>
                <p className="text-sm text-gray-500">Permitir integração com APIs externas</p>
              </div>
              <Switch
                checked={securitySettings.apiAccess}
                onCheckedChange={(checked) => handleSecurityChange('apiAccess', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Criptografia de Dados</Label>
                <p className="text-sm text-gray-500">Criptografar dados sensíveis</p>
              </div>
              <Switch
                checked={securitySettings.dataEncryption}
                onCheckedChange={(checked) => handleSecurityChange('dataEncryption', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Monitoramento de Sessão</Label>
                <p className="text-sm text-gray-500">Detectar atividades suspeitas</p>
              </div>
              <Switch
                checked={securitySettings.sessionMonitoring}
                onCheckedChange={(checked) => handleSecurityChange('sessionMonitoring', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Controle de Dados */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-amplie-primary" />
            Controle de Dados
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Exportar Dados</h4>
              <p className="text-sm text-gray-500 mb-3">Baixe uma cópia de todos os seus dados</p>
              <Button 
                onClick={handleDataDownload}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Solicitar Download dos Dados
              </Button>
            </div>
          </div>
        </Card>

        {/* Zona de Perigo */}
        <Card className="p-6 border-red-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Zona de Perigo
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600">Excluir Conta</h4>
              <p className="text-sm text-gray-500 mb-3">Esta ação é irreversível e removerá todos os seus dados</p>
              <Button 
                onClick={handleAccountDeletion}
                variant="destructive"
                className="w-full"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Solicitar Exclusão da Conta
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
