
import { Settings, MessageSquare, Clock, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function Painel() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Painel de Configurações</h2>
          <p className="text-gray-600">Configure as definições gerais do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integração WhatsApp */}
        <div className="bg-white rounded-xl shadow-amplie p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Integração WhatsApp</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token da API</label>
              <Input placeholder="Insira o token da WhatsApp Business API" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL do Webhook</label>
              <Input placeholder="https://sua-api.com/webhook" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status da Conexão</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Offline</span>
              </div>
            </div>
            <Button className="w-full bg-amplie-primary hover:bg-amplie-primary-light">
              Testar Conexão
            </Button>
          </div>
        </div>

        {/* Mensagens Automáticas */}
        <div className="bg-white rounded-xl shadow-amplie p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Mensagens Automáticas</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem de Boas-vindas</label>
              <Input placeholder="Olá! Como posso ajudá-lo hoje?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fora do Expediente</label>
              <Input placeholder="Estamos fora do horário de atendimento..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transferência de Setor</label>
              <Input placeholder="Você está sendo transferido para..." />
            </div>
          </div>
        </div>

        {/* Horário de Expediente */}
        <div className="bg-white rounded-xl shadow-amplie p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Horário de Expediente</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Início</label>
                <Input type="time" defaultValue="08:00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Término</label>
                <Input type="time" defaultValue="18:00" />
              </div>
            </div>
            <div className="space-y-3">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
                <div key={dia} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{dia}</span>
                  <Switch defaultChecked={!['Sábado', 'Domingo'].includes(dia)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configurações Gerais */}
        <div className="bg-white rounded-xl shadow-amplie p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idioma do Sistema</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amplie-primary focus:border-transparent">
                <option>Português (Brasil)</option>
                <option>English (US)</option>
                <option>Español</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Notificações Sonoras</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Atualização Automática</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Modo Escuro</span>
              <Switch />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-amplie-primary hover:bg-amplie-primary-light px-8">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
