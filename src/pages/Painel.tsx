
import { Settings, MessageSquare, Clock, Globe, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { WhatsAppConnections } from '@/components/whatsapp/WhatsAppConnections';

export default function Painel() {
  return (
    <div className="p-6 space-y-6">
      {/* Conexões WhatsApp */}
      <WhatsAppConnections />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controle de Atendimentos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-amplie p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Controle de Atendimentos</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Limite de Mensagens em Aberto por Agente
              </label>
              <Input 
                type="number" 
                min="1" 
                max="20" 
                defaultValue="5" 
                placeholder="5"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Número máximo de conversas ativas que cada agente pode ter simultaneamente
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Receber Transferências Mesmo no Limite</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Permitir que agentes recebam transferências mesmo atingindo o limite</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Distribuição Automática</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Distribuir novos atendimentos automaticamente entre agentes disponíveis</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Mensagens Automáticas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-amplie p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mensagens Automáticas</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensagem de Boas-vindas</label>
              <Input 
                placeholder="Olá! Como posso ajudá-lo hoje?" 
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fora do Expediente</label>
              <Input 
                placeholder="Estamos fora do horário de atendimento..." 
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transferência de Setor</label>
              <Input 
                placeholder="Você está sendo transferido para..." 
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Horário de Expediente */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-amplie p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horário de Expediente</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Início</label>
                <Input 
                  type="time" 
                  defaultValue="08:00" 
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Término</label>
                <Input 
                  type="time" 
                  defaultValue="18:00" 
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-3">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
                <div key={dia} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dia}</span>
                  <Switch defaultChecked={!['Sábado', 'Domingo'].includes(dia)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configurações Gerais */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-amplie p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações Gerais</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idioma do Sistema</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amplie-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Português (Brasil)</option>
                <option>English (US)</option>
                <option>Español</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notificações Sonoras</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Atualização Automática</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-amplie-primary hover:bg-amplie-primary-light px-8 text-white">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
