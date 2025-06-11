
import { useState } from 'react';
import { Monitor, Sun, Moon, Palette, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Aparencia() {
  const [themeSettings, setThemeSettings] = useState({
    theme: 'system', // 'light', 'dark', 'system'
    colorScheme: 'blue', // 'blue', 'green', 'purple', 'orange'
    fontSize: 'medium', // 'small', 'medium', 'large'
    compactMode: false,
    animations: true,
    autoTheme: true
  });

  const [layoutSettings, setLayoutSettings] = useState({
    sidebarCollapsed: false,
    showAvatars: true,
    showTimestamps: true,
    densityMode: 'comfortable' // 'compact', 'comfortable', 'spacious'
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true
  });

  const handleThemeChange = (field: string, value: string | boolean) => {
    setThemeSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLayoutChange = (field: string, value: string | boolean) => {
    setLayoutSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAccessibilityChange = (field: string, value: boolean) => {
    setAccessibilitySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Salvando configurações de aparência...');
  };

  const themes = [
    { id: 'light', name: 'Claro', icon: Sun },
    { id: 'dark', name: 'Escuro', icon: Moon },
    { id: 'system', name: 'Sistema', icon: Monitor }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Azul', color: 'bg-blue-500' },
    { id: 'green', name: 'Verde', color: 'bg-green-500' },
    { id: 'purple', name: 'Roxo', color: 'bg-purple-500' },
    { id: 'orange', name: 'Laranja', color: 'bg-orange-500' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Pequeno' },
    { id: 'medium', name: 'Médio' },
    { id: 'large', name: 'Grande' }
  ];

  const densityModes = [
    { id: 'compact', name: 'Compacto' },
    { id: 'comfortable', name: 'Confortável' },
    { id: 'spacious', name: 'Espaçoso' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aparência</h1>
          <p className="text-gray-500">Personalize a aparência e o layout da interface</p>
        </div>
        <Button 
          onClick={handleSave}
          className="bg-amplie-primary hover:bg-amplie-primary-light"
        >
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tema */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-amplie-primary" />
            Tema
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange('theme', theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    themeSettings.theme === theme.id
                      ? 'border-amplie-primary bg-amplie-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Tema Automático</Label>
              <p className="text-sm text-gray-500">Alternar automaticamente baseado no horário</p>
            </div>
            <Switch
              checked={themeSettings.autoTheme}
              onCheckedChange={(checked) => handleThemeChange('autoTheme', checked)}
            />
          </div>
        </Card>

        {/* Esquema de Cores */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-amplie-primary" />
            Esquema de Cores
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => handleThemeChange('colorScheme', scheme.id)}
                className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                  themeSettings.colorScheme === scheme.id
                    ? 'border-amplie-primary bg-amplie-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${scheme.color}`}></div>
                <span className="text-sm font-medium">{scheme.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Tipografia */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-amplie-primary" />
            Tipografia
          </h3>
          <div className="space-y-3">
            <Label className="font-medium">Tamanho da Fonte</Label>
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleThemeChange('fontSize', size.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  themeSettings.fontSize === size.id
                    ? 'border-amplie-primary bg-amplie-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`font-medium ${
                  size.id === 'small' ? 'text-sm' :
                  size.id === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  {size.name}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Layout */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-amplie-primary" />
            Layout
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="font-medium mb-3 block">Densidade</Label>
              <div className="space-y-2">
                {densityModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleLayoutChange('densityMode', mode.id)}
                    className={`w-full p-2 text-left rounded border transition-all ${
                      layoutSettings.densityMode === mode.id
                        ? 'border-amplie-primary bg-amplie-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{mode.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Modo Compacto</Label>
                <p className="text-sm text-gray-500">Reduzir espaçamento geral</p>
              </div>
              <Switch
                checked={themeSettings.compactMode}
                onCheckedChange={(checked) => handleThemeChange('compactMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Mostrar Avatares</Label>
                <p className="text-sm text-gray-500">Exibir fotos de perfil</p>
              </div>
              <Switch
                checked={layoutSettings.showAvatars}
                onCheckedChange={(checked) => handleLayoutChange('showAvatars', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Mostrar Timestamps</Label>
                <p className="text-sm text-gray-500">Exibir horários das mensagens</p>
              </div>
              <Switch
                checked={layoutSettings.showTimestamps}
                onCheckedChange={(checked) => handleLayoutChange('showTimestamps', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Animações e Efeitos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-amplie-primary" />
            Animações e Efeitos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Animações</Label>
                <p className="text-sm text-gray-500">Habilitar animações de interface</p>
              </div>
              <Switch
                checked={themeSettings.animations}
                onCheckedChange={(checked) => handleThemeChange('animations', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Acessibilidade */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-amplie-primary" />
            Acessibilidade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Alto Contraste</Label>
                <p className="text-sm text-gray-500">Aumentar contraste para melhor visibilidade</p>
              </div>
              <Switch
                checked={accessibilitySettings.highContrast}
                onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Movimento Reduzido</Label>
                <p className="text-sm text-gray-500">Reduzir animações e transições</p>
              </div>
              <Switch
                checked={accessibilitySettings.reducedMotion}
                onCheckedChange={(checked) => handleAccessibilityChange('reducedMotion', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Suporte a Leitor de Tela</Label>
                <p className="text-sm text-gray-500">Otimizar para leitores de tela</p>
              </div>
              <Switch
                checked={accessibilitySettings.screenReader}
                onCheckedChange={(checked) => handleAccessibilityChange('screenReader', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Navegação por Teclado</Label>
                <p className="text-sm text-gray-500">Habilitar navegação completa por teclado</p>
              </div>
              <Switch
                checked={accessibilitySettings.keyboardNavigation}
                onCheckedChange={(checked) => handleAccessibilityChange('keyboardNavigation', checked)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
