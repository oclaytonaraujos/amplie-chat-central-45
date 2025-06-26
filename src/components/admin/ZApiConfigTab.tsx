
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Settings, Trash2, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ZApiConfig {
  id: string;
  empresa_id: string;
  instance_id: string;
  token: string;
  webhook_url: string | null;
  ativo: boolean;
  created_at: string;
  empresa_nome?: string;
}

interface Empresa {
  id: string;
  nome: string;
}

export default function ZApiConfigTab() {
  const [configs, setConfigs] = useState<ZApiConfig[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ZApiConfig | null>(null);
  const [formData, setFormData] = useState({
    empresa_id: '',
    instance_id: '',
    token: '',
    webhook_url: '',
    ativo: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar empresas
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

      if (empresasError) throw empresasError;

      // Carregar configurações Z-API
      const { data: configsData, error: configsError } = await supabase
        .from('zapi_config')
        .select(`
          *,
          empresas (nome)
        `)
        .order('created_at', { ascending: false });

      if (configsError) throw configsError;

      setEmpresas(empresasData || []);
      setConfigs(configsData?.map(config => ({
        ...config,
        empresa_nome: config.empresas?.nome
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações Z-API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.empresa_id || !formData.instance_id || !formData.token) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha empresa, instance ID e token",
          variant: "destructive",
        });
        return;
      }

      const webhookUrl = formData.webhook_url || 
        `https://obtpghqvrygzcukdaiej.supabase.co/functions/v1/whatsapp-webhook`;

      if (editingConfig) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('zapi_config')
          .update({
            instance_id: formData.instance_id,
            token: formData.token,
            webhook_url: webhookUrl,
            ativo: formData.ativo
          })
          .eq('id', editingConfig.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração Z-API atualizada com sucesso",
        });
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('zapi_config')
          .insert({
            empresa_id: formData.empresa_id,
            instance_id: formData.instance_id,
            token: formData.token,
            webhook_url: webhookUrl,
            ativo: formData.ativo
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração Z-API criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingConfig(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração Z-API",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (config: ZApiConfig) => {
    setEditingConfig(config);
    setFormData({
      empresa_id: config.empresa_id,
      instance_id: config.instance_id,
      token: config.token,
      webhook_url: config.webhook_url || '',
      ativo: config.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('zapi_config')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração Z-API removida com sucesso",
      });

      loadData();
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir configuração Z-API",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, novoStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('zapi_config')
        .update({ ativo: novoStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Configuração ${novoStatus ? 'ativada' : 'desativada'} com sucesso`,
      });

      loadData();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da configuração",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      empresa_id: '',
      instance_id: '',
      token: '',
      webhook_url: '',
      ativo: true
    });
  };

  const handleNewConfig = () => {
    setEditingConfig(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Configurações Z-API</h3>
          <p className="text-sm text-gray-600">Gerencie as configurações Z-API de todas as empresas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewConfig}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Configuração
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? 'Editar' : 'Nova'} Configuração Z-API
              </DialogTitle>
              <DialogDescription>
                Configure as credenciais Z-API para uma empresa
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="empresa">Empresa</Label>
                <Select 
                  value={formData.empresa_id} 
                  onValueChange={(value) => setFormData({...formData, empresa_id: value})}
                  disabled={!!editingConfig}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="instance_id">Instance ID</Label>
                <Input
                  id="instance_id"
                  value={formData.instance_id}
                  onChange={(e) => setFormData({...formData, instance_id: e.target.value})}
                  placeholder="ID da instância Z-API"
                />
              </div>

              <div>
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  placeholder="Token Z-API"
                />
              </div>

              <div>
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({...formData, webhook_url: e.target.value})}
                  placeholder="URL do webhook (opcional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe vazio para usar a URL padrão do sistema
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                />
                <Label htmlFor="ativo">Configuração ativa</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingConfig ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          <strong>Webhook padrão:</strong> https://obtpghqvrygzcukdaiej.supabase.co/functions/v1/whatsapp-webhook
          <br />
          Configure esta URL também no painel da Z-API para receber mensagens automaticamente.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Existentes</CardTitle>
          <CardDescription>
            {configs.length} configuração(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma configuração Z-API encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Instance ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Webhook</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">
                      {config.empresa_nome}
                    </TableCell>
                    <TableCell>{config.instance_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={config.ativo}
                          onCheckedChange={(checked) => toggleStatus(config.id, checked)}
                          size="sm"
                        />
                        <Badge variant={config.ativo ? "default" : "secondary"}>
                          {config.ativo ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inativo
                            </>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {config.webhook_url ? 'Configurado' : 'Não configurado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(config.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(config)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(config.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
