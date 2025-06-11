import { useState } from 'react';
import { Bot, Plus, Edit, Trash2, Power, PowerOff, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chatbotsData = [
  {
    id: 1,
    nome: 'Fluxo Principal',
    status: 'Ativo',
    ultimaEdicao: '2024-06-10',
    interacoes: 234,
    transferencias: 12
  },
  {
    id: 2,
    nome: 'Suporte Técnico',
    status: 'Ativo',
    ultimaEdicao: '2024-06-09',
    interacoes: 89,
    transferencias: 45
  },
  {
    id: 3,
    nome: 'Vendas',
    status: 'Inativo',
    ultimaEdicao: '2024-06-08',
    interacoes: 156,
    transferencias: 23
  }
];

const setoresDisponiveis = ['Vendas', 'Suporte Técnico', 'Financeiro', 'Recursos Humanos'];

export default function ChatBot() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    mensagemInicial: '',
    opcoes: [''],
    acaoTransferencia: '',
    setorTransferencia: ''
  });

  const filteredChatbots = chatbotsData.filter(chatbot =>
    chatbot.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateChatbot = () => {
    console.log('Criando chatbot:', formData);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditChatbot = (chatbot) => {
    setSelectedChatbot(chatbot);
    setFormData({
      nome: chatbot.nome,
      mensagemInicial: '',
      opcoes: [''],
      acaoTransferencia: '',
      setorTransferencia: ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      mensagemInicial: '',
      opcoes: [''],
      acaoTransferencia: '',
      setorTransferencia: ''
    });
  };

  const addOpcao = () => {
    setFormData(prev => ({
      ...prev,
      opcoes: [...prev.opcoes, '']
    }));
  };

  const updateOpcao = (index, value) => {
    setFormData(prev => ({
      ...prev,
      opcoes: prev.opcoes.map((opcao, i) => i === index ? value : opcao)
    }));
  };

  const removeOpcao = (index) => {
    setFormData(prev => ({
      ...prev,
      opcoes: prev.opcoes.filter((_, i) => i !== index)
    }));
  };

  const toggleStatus = (chatbotId) => {
    console.log('Alternando status do chatbot:', chatbotId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com botão de ação */}
      <div className="flex items-center justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
              <Plus className="w-4 h-4 mr-2" />
              Novo Fluxo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Fluxo de ChatBot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Fluxo</label>
                <Input
                  placeholder="Ex: Atendimento Inicial"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Inicial</label>
                <Textarea
                  placeholder="Olá! Como posso ajudá-lo hoje? Digite o número da opção desejada:"
                  value={formData.mensagemInicial}
                  onChange={(e) => setFormData(prev => ({ ...prev, mensagemInicial: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opções de Menu</label>
                {formData.opcoes.map((opcao, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600 w-8">{index + 1}.</span>
                    <Input
                      placeholder="Ex: Suporte Técnico"
                      value={opcao}
                      onChange={(e) => updateOpcao(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.opcoes.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeOpcao(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addOpcao}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Opção
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ação Pós-Escolha</label>
                <Select 
                  value={formData.acaoTransferencia} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, acaoTransferencia: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferir">Transferir para Atendimento Humano</SelectItem>
                    <SelectItem value="mensagem">Enviar Mensagem Adicional</SelectItem>
                    <SelectItem value="finalizar">Finalizar Conversa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.acaoTransferencia === 'transferir' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Setor de Destino</label>
                  <Select 
                    value={formData.setorTransferencia} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, setorTransferencia: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {setoresDisponiveis.map((setor) => (
                        <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateChatbot} className="bg-amplie-primary hover:bg-amplie-primary-light">
                  Criar Fluxo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-amplie p-6">
        <Input
          placeholder="Pesquisar fluxos de chatbot..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Chatbots Table */}
      <div className="bg-white rounded-xl shadow-amplie overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fluxo</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Última Edição</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Métricas</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredChatbots.map((chatbot) => (
                <tr key={chatbot.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{chatbot.nome}</p>
                        <p className="text-sm text-gray-500">ID: #{chatbot.id.toString().padStart(3, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={chatbot.status === 'Ativo' ? 'default' : 'secondary'}
                      className={chatbot.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {chatbot.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{chatbot.ultimaEdicao}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{chatbot.interacoes} interações</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{chatbot.transferencias} transferências</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleStatus(chatbot.id)}
                        className={chatbot.status === 'Ativo' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {chatbot.status === 'Ativo' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditChatbot(chatbot)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredChatbots.length === 0 && (
        <div className="bg-white rounded-xl shadow-amplie p-12 text-center">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum fluxo encontrado</h3>
          <p className="text-gray-500 mb-6">Não encontramos fluxos de chatbot com os critérios de busca.</p>
          <Button 
            className="bg-amplie-primary hover:bg-amplie-primary-light"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Fluxo
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Fluxo de ChatBot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Fluxo</label>
              <Input
                placeholder="Ex: Atendimento Inicial"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Inicial</label>
              <Textarea
                placeholder="Olá! Como posso ajudá-lo hoje? Digite o número da opção desejada:"
                value={formData.mensagemInicial}
                onChange={(e) => setFormData(prev => ({ ...prev, mensagemInicial: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
