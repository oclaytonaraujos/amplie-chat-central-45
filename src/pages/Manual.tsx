
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Settings, 
  Bot, 
  CheckCircle, 
  AlertCircle, 
  Info,
  QrCode,
  Webhook,
  MessageSquare,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function Manual() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Manual do Amplie Chat</h1>
        <p className="text-xl text-gray-600">
          Guia completo para conectar Z-API e configurar automações
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="outline" className="px-4 py-2">
            <Smartphone className="w-4 h-4 mr-2" />
            WhatsApp Business
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Bot className="w-4 h-4 mr-2" />
            Automação Inteligente
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="zapi" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zapi">1. Configurar Z-API</TabsTrigger>
          <TabsTrigger value="conexao">2. Conectar WhatsApp</TabsTrigger>
          <TabsTrigger value="chatbot">3. Criar Automações</TabsTrigger>
        </TabsList>

        {/* Seção 1: Configurar Z-API */}
        <TabsContent value="zapi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Passo 1: Configurar Z-API
              </CardTitle>
              <CardDescription>
                Configure sua instância Z-API para integrar com o WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Criar conta Z-API */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Criar conta na Z-API
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>Acesse <a href="https://z-api.io" target="_blank" className="text-blue-600 hover:underline inline-flex items-center">
                    z-api.io <ExternalLink className="w-3 h-3 ml-1" />
                  </a></li>
                  <li>Clique em "Cadastre-se" ou "Criar conta"</li>
                  <li>Preencha seus dados (nome, email, telefone)</li>
                  <li>Confirme seu email</li>
                  <li>Faça login na plataforma</li>
                </ol>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    A Z-API oferece planos gratuitos para teste. Recomendamos começar com o plano gratuito para testes.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Criar instância */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Criar uma instância
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>No painel da Z-API, clique em "Criar Instância"</li>
                  <li>Escolha um nome para sua instância (ex: "AmplieChatBot")</li>
                  <li>Selecione o plano desejado</li>
                  <li>Anote o <strong>Instance ID</strong> e o <strong>Token</strong> gerados</li>
                </ol>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ Importante - Guarde essas informações:</h4>
                  <ul className="space-y-1 text-yellow-700">
                    <li><strong>Instance ID:</strong> Identificador único da sua instância</li>
                    <li><strong>Token:</strong> Chave de autenticação para a API</li>
                  </ul>
                </div>
              </div>

              {/* Configurar no Amplie */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Configurar no Amplie Chat
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>No Amplie Chat, vá em <strong>Configurações → Integrações</strong></li>
                  <li>Encontre a seção "Z-API / WhatsApp"</li>
                  <li>Insira o <strong>Instance ID</strong> da Z-API</li>
                  <li>Insira o <strong>Token</strong> da Z-API</li>
                  <li>Clique em "Salvar Configurações"</li>
                </ol>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Após salvar, o sistema testará automaticamente a conexão com a Z-API.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção 2: Conectar WhatsApp */}
        <TabsContent value="conexao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-6 h-6 mr-2" />
                Passo 2: Conectar WhatsApp
              </CardTitle>
              <CardDescription>
                Vincule seu número do WhatsApp à instância Z-API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Gerar QR Code */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Gerar QR Code
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>No Amplie Chat, vá em <strong>WhatsApp → Conexões</strong></li>
                  <li>Clique em "Conectar WhatsApp"</li>
                  <li>Um QR Code será gerado automaticamente</li>
                  <li>Mantenha esta tela aberta no computador</li>
                </ol>
              </div>

              {/* Escanear QR Code */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Escanear com WhatsApp
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Vá em <strong>Configurações → Aparelhos conectados</strong></li>
                  <li>Toque em "Conectar um aparelho"</li>
                  <li>Escaneie o QR Code mostrado no Amplie Chat</li>
                  <li>Aguarde a confirmação da conexão</li>
                </ol>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Quando conectado com sucesso, o status mudará para "Conectado" no painel.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Configurar Webhook */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Configurar Webhook
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>Na tela de conexões, clique em "Configurar Webhook"</li>
                  <li>O sistema configurará automaticamente o webhook</li>
                  <li>Verifique se aparece "Webhook Configurado" em verde</li>
                </ol>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 O que é o Webhook?</h4>
                  <p className="text-blue-700 text-sm">
                    O webhook permite que o WhatsApp envie mensagens recebidas automaticamente para o Amplie Chat, 
                    possibilitando respostas automáticas e o funcionamento dos chatbots.
                  </p>
                </div>
              </div>

              {/* Testar conexão */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                  Testar a conexão
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>Envie uma mensagem para o número conectado de outro telefone</li>
                  <li>Verifique se a mensagem aparece no painel do Amplie Chat</li>
                  <li>Teste enviar uma resposta pelo painel</li>
                  <li>Confirme se a resposta chega no WhatsApp</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção 3: Criar Automações */}
        <TabsContent value="chatbot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-6 h-6 mr-2" />
                Passo 3: Criar Fluxos de Automação
              </CardTitle>
              <CardDescription>
                Configure chatbots inteligentes para atendimento automático
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Acessar ChatBot */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Acessar o módulo ChatBot
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>No menu principal, clique em <strong>ChatBot</strong></li>
                  <li>Clique em "Novo Fluxo" para criar seu primeiro chatbot</li>
                </ol>
              </div>

              {/* Configurações básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Configurações básicas
                </h3>
                
                <div className="space-y-3 ml-8">
                  <div>
                    <h4 className="font-medium">Nome do Fluxo:</h4>
                    <p className="text-gray-600 text-sm">Ex: "Atendimento Inicial", "Suporte Técnico", "Vendas"</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Mensagem de Boas-vindas:</h4>
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="font-medium">Exemplo:</p>
                      <p className="text-gray-700 mt-1">
                        "Olá! 👋 Bem-vindo ao atendimento da [SUA EMPRESA]. 
                        Como posso ajudá-lo hoje?"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Criar nós do fluxo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Criar nós do fluxo
                </h3>
                
                <div className="space-y-4 ml-8">
                  <div>
                    <h4 className="font-medium">Nó Inicial (automático):</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm ml-4">
                      <li>Configure a mensagem principal</li>
                      <li>Defina as opções do menu</li>
                      <li>Escolha as ações para cada opção</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Exemplo de fluxo básico:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2">Nó 1</span>
                        <span>"Escolha uma opção: 1-Vendas, 2-Suporte, 3-Financeiro"</span>
                      </div>
                      <div className="flex items-center ml-4">
                        <ArrowRight className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Opção 1 → Transferir para setor Vendas</span>
                      </div>
                      <div className="flex items-center ml-4">
                        <ArrowRight className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Opção 2 → Ir para Nó 2 (Suporte)</span>
                      </div>
                      <div className="flex items-center ml-4">
                        <ArrowRight className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Opção 3 → Transferir para Financeiro</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipos de nós */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                  Tipos de nós disponíveis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-blue-600">Opções de Menu</h4>
                    <p className="text-sm text-gray-600">
                      Apresenta uma lista numerada de opções para o cliente escolher
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-green-600">Texto Livre</h4>
                    <p className="text-sm text-gray-600">
                      Aguarda o cliente digitar uma resposta em texto livre
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-orange-600">Anexo</h4>
                    <p className="text-sm text-gray-600">
                      Espera o cliente enviar uma imagem ou documento
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-purple-600">Apenas Mensagem</h4>
                    <p className="text-sm text-gray-600">
                      Envia uma mensagem informativa sem esperar resposta
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações finais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">5</span>
                  Configurar ações finais
                </h3>
                
                <div className="ml-8 space-y-3">
                  <div>
                    <h4 className="font-medium">Opções disponíveis:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-1">
                      <li><strong>Próximo Nó:</strong> Continua para outro nó do fluxo</li>
                      <li><strong>Transferir para Setor:</strong> Encaminha para um atendente humano</li>
                      <li><strong>Mensagem + Finalizar:</strong> Envia mensagem final e encerra</li>
                      <li><strong>Finalizar:</strong> Encerra o atendimento automaticamente</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ativar fluxo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">6</span>
                  Ativar o fluxo
                </h3>
                
                <ol className="list-decimal list-inside space-y-2 ml-8 text-gray-700">
                  <li>Clique em "Salvar Fluxo" para salvar as configurações</li>
                  <li>Na lista de fluxos, clique no botão de ativar (ícone de energia)</li>
                  <li>O fluxo ficará com status "Ativo" e será executado automaticamente</li>
                  <li>Teste enviando uma mensagem para o WhatsApp conectado</li>
                </ol>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Apenas um fluxo pode estar ativo por vez. Ao ativar um novo, o anterior será desativado automaticamente.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Dicas importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-6 h-6 mr-2" />
                Dicas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teste sempre:</strong> Antes de ativar um fluxo, teste todas as opções e caminhos possíveis.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Mensagens claras:</strong> Use linguagem simples e objetiva nas mensagens do chatbot.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Escape para humano:</strong> Sempre ofereça uma opção para falar com atendente.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Horário de funcionamento:</strong> Configure horários para que o bot funcione apenas quando necessário.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">🎉 Parabéns!</h4>
                <p className="text-gray-700">
                  Seu Amplie Chat está configurado e pronto para automatizar atendimentos no WhatsApp. 
                  Os clientes que enviarem mensagens receberão respostas automáticas conforme o fluxo configurado.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
