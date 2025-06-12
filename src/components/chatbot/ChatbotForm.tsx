
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface ChatbotFormData {
  nome: string;
  mensagemInicial: string;
  opcoes: string[];
  acaoTransferencia: string;
  setorTransferencia: string;
}

interface ChatbotFormProps {
  formData: ChatbotFormData;
  setFormData: (data: ChatbotFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const setoresDisponiveis = ['Vendas', 'Suporte Técnico', 'Financeiro', 'Recursos Humanos'];

export function ChatbotForm({ formData, setFormData, onSubmit, onCancel, isEdit = false }: ChatbotFormProps) {
  const addOpcao = () => {
    setFormData({
      ...formData,
      opcoes: [...formData.opcoes, '']
    });
  };

  const updateOpcao = (index: number, value: string) => {
    setFormData({
      ...formData,
      opcoes: formData.opcoes.map((opcao, i) => i === index ? value : opcao)
    });
  };

  const removeOpcao = (index: number) => {
    setFormData({
      ...formData,
      opcoes: formData.opcoes.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Fluxo</label>
        <Input
          placeholder="Ex: Atendimento Inicial"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Inicial</label>
        <Textarea
          placeholder="Olá! Como posso ajudá-lo hoje? Digite o número da opção desejada:"
          value={formData.mensagemInicial}
          onChange={(e) => setFormData({ ...formData, mensagemInicial: e.target.value })}
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
          onValueChange={(value) => setFormData({ ...formData, acaoTransferencia: value })}
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
            onValueChange={(value) => setFormData({ ...formData, setorTransferencia: value })}
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
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} className="bg-amplie-primary hover:bg-amplie-primary-light">
          {isEdit ? 'Salvar Alterações' : 'Criar Fluxo'}
        </Button>
      </div>
    </div>
  );
}
