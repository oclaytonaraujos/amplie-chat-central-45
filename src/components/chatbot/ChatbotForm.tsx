
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface NoDoFluxo {
  id: string;
  nome: string;
  mensagem: string;
  tipoResposta: 'opcoes' | 'texto-livre' | 'anexo' | 'apenas-mensagem';
  opcoes: Array<{
    id: string;
    texto: string;
    proximaAcao: 'proximo-no' | 'transferir' | 'finalizar' | 'mensagem-finalizar';
    proximoNoId?: string;
    setorTransferencia?: string;
    mensagemFinal?: string;
  }>;
  isCollapsed?: boolean;
}

interface ChatbotFormData {
  nome: string;
  mensagemInicial: string;
  nos: NoDoFluxo[];
}

interface ChatbotFormProps {
  formData?: ChatbotFormData;
  onSubmit: (data: ChatbotFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const setoresDisponiveis = ['Vendas', 'Suporte Técnico', 'Financeiro', 'Recursos Humanos'];

export function ChatbotForm({ formData, onSubmit, onCancel, isEdit = false }: ChatbotFormProps) {
  const form = useForm<ChatbotFormData>({
    defaultValues: formData || {
      nome: '',
      mensagemInicial: '',
      nos: [{
        id: 'no-inicial',
        nome: 'Nó Inicial',
        mensagem: '',
        tipoResposta: 'opcoes',
        opcoes: [{ id: '1', texto: '', proximaAcao: 'finalizar' }],
        isCollapsed: false
      }]
    }
  });

  const [nosFluxo, setNosFluxo] = useState<NoDoFluxo[]>(
    formData?.nos || [{
      id: 'no-inicial',
      nome: 'Nó Inicial',
      mensagem: '',
      tipoResposta: 'opcoes',
      opcoes: [{ id: '1', texto: '', proximaAcao: 'finalizar' }],
      isCollapsed: false
    }]
  );

  const gerarIdUnico = () => `no-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const adicionarNo = () => {
    const novoNo: NoDoFluxo = {
      id: gerarIdUnico(),
      nome: '',
      mensagem: '',
      tipoResposta: 'opcoes',
      opcoes: [{ id: '1', texto: '', proximaAcao: 'finalizar' }],
      isCollapsed: false
    };
    setNosFluxo([...nosFluxo, novoNo]);
  };

  const removerNo = (noId: string) => {
    if (noId === 'no-inicial') return; // Não permite remover o nó inicial
    setNosFluxo(nosFluxo.filter(no => no.id !== noId));
  };

  const atualizarNo = (noId: string, campo: keyof NoDoFluxo, valor: any) => {
    setNosFluxo(nosFluxo.map(no => 
      no.id === noId ? { ...no, [campo]: valor } : no
    ));
  };

  const adicionarOpcao = (noId: string) => {
    setNosFluxo(nosFluxo.map(no => {
      if (no.id === noId) {
        const novaOpcao = {
          id: (no.opcoes.length + 1).toString(),
          texto: '',
          proximaAcao: 'finalizar' as const
        };
        return { ...no, opcoes: [...no.opcoes, novaOpcao] };
      }
      return no;
    }));
  };

  const removerOpcao = (noId: string, opcaoId: string) => {
    setNosFluxo(nosFluxo.map(no => {
      if (no.id === noId && no.opcoes.length > 1) {
        return { ...no, opcoes: no.opcoes.filter(opcao => opcao.id !== opcaoId) };
      }
      return no;
    }));
  };

  const atualizarOpcao = (noId: string, opcaoId: string, campo: string, valor: any) => {
    setNosFluxo(nosFluxo.map(no => {
      if (no.id === noId) {
        return {
          ...no,
          opcoes: no.opcoes.map(opcao =>
            opcao.id === opcaoId ? { ...opcao, [campo]: valor } : opcao
          )
        };
      }
      return no;
    }));
  };

  const toggleCollapseNo = (noId: string) => {
    setNosFluxo(nosFluxo.map(no =>
      no.id === noId ? { ...no, isCollapsed: !no.isCollapsed } : no
    ));
  };

  const handleSubmit = () => {
    const formValues = form.getValues();
    const dadosCompletos: ChatbotFormData = {
      ...formValues,
      nos: nosFluxo
    };
    onSubmit(dadosCompletos);
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        {/* Configurações Básicas do Fluxo */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Configurações Básicas</h3>
          
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Fluxo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Atendimento Inicial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mensagemInicial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem de Boas-Vindas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mensagem enviada automaticamente quando o cliente inicia a conversa"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Nós do Fluxo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Fluxo de Conversação</h3>
            <Button variant="outline" size="sm" onClick={adicionarNo}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nó
            </Button>
          </div>

          {nosFluxo.map((no, index) => (
            <div key={no.id} className="border rounded-lg p-4 bg-white">
              {/* Header do Nó */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCollapseNo(no.id)}
                  >
                    {no.isCollapsed ? 
                      <ChevronRight className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </Button>
                  <span className="font-medium text-gray-700">
                    {no.id === 'no-inicial' ? 'Nó Inicial' : `Nó ${index}`}
                  </span>
                  {no.nome && <span className="text-sm text-gray-500">- {no.nome}</span>}
                </div>
                
                {no.id !== 'no-inicial' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerNo(no.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {!no.isCollapsed && (
                <div className="space-y-4">
                  {/* Nome do Nó */}
                  {no.id !== 'no-inicial' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Nó (interno)
                      </label>
                      <Input
                        placeholder="Ex: Escolha de Suporte"
                        value={no.nome}
                        onChange={(e) => atualizarNo(no.id, 'nome', e.target.value)}
                      />
                    </div>
                  )}

                  {/* Mensagem do Nó */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      placeholder="Mensagem que será enviada neste ponto do fluxo"
                      value={no.mensagem}
                      onChange={(e) => atualizarNo(no.id, 'mensagem', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Tipo de Resposta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Resposta Esperada
                    </label>
                    <Select
                      value={no.tipoResposta}
                      onValueChange={(value) => atualizarNo(no.id, 'tipoResposta', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opcoes">Opções de Menu</SelectItem>
                        <SelectItem value="texto-livre">Texto Livre</SelectItem>
                        <SelectItem value="anexo">Anexo (Imagem/Documento)</SelectItem>
                        <SelectItem value="apenas-mensagem">Apenas Mensagem (sem resposta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Opções (se tipo for 'opcoes') */}
                  {no.tipoResposta === 'opcoes' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opções de Menu
                      </label>
                      {no.opcoes.map((opcao, opcaoIndex) => (
                        <div key={opcao.id} className="flex items-center space-x-2 mb-3 p-3 border rounded bg-gray-50">
                          <span className="text-sm text-gray-600 w-8">{opcaoIndex + 1}.</span>
                          <Input
                            placeholder="Ex: Suporte Técnico"
                            value={opcao.texto}
                            onChange={(e) => atualizarOpcao(no.id, opcao.id, 'texto', e.target.value)}
                            className="flex-1"
                          />
                          
                          <Select
                            value={opcao.proximaAcao}
                            onValueChange={(value) => atualizarOpcao(no.id, opcao.id, 'proximaAcao', value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="proximo-no">Ir para Próximo Nó</SelectItem>
                              <SelectItem value="transferir">Transferir para Setor</SelectItem>
                              <SelectItem value="mensagem-finalizar">Mensagem + Finalizar</SelectItem>
                              <SelectItem value="finalizar">Finalizar Conversa</SelectItem>
                            </SelectContent>
                          </Select>

                          {no.opcoes.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerOpcao(no.id, opcao.id)}
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
                        onClick={() => adicionarOpcao(no.id)}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    </div>
                  )}

                  {/* Configurações específicas para outros tipos de resposta */}
                  {no.tipoResposta === 'apenas-mensagem' && (
                    <div className="p-3 bg-blue-50 rounded border">
                      <p className="text-sm text-blue-800">
                        Este nó enviará apenas a mensagem e pode conectar diretamente a uma ação final.
                      </p>
                    </div>
                  )}

                  {(no.tipoResposta === 'texto-livre' || no.tipoResposta === 'anexo') && (
                    <div className="p-3 bg-yellow-50 rounded border">
                      <p className="text-sm text-yellow-800">
                        O chatbot aguardará a resposta do cliente e poderá armazenar ou processar a informação antes de prosseguir.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-amplie-primary hover:bg-amplie-primary-light">
            {isEdit ? 'Salvar Alterações' : 'Criar Fluxo'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
