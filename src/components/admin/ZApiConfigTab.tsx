
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Settings, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ZApiConfig {
  id: string;
  empresa_id: string;
  instance_id: string;
  token: string;
  webhook_url: string | null;
  ativo: boolean;
  created_at: string;
  empresas?: {
    nome: string;
    email: string;
  };
}

interface Empresa {
  id: string;
  nome: string;
  email: string;
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
    webhook_url: 'https://obtpghqvrygzcukdaiej.supabase.co/functions/v1/whatsapp-webhook',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, email')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setEmpresas(data || []);
      
      // Se só há uma empresa, selecionar automaticamente
      if (data && data.length === 1) {
        setFormData(prev => ({ ...prev, empresa_id: data[0].id }));
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas",
        variant: "destructive",
      });
    }
  };

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('zapi_config')
        .select(`
          *,
          empresas (nome, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Erro ao buscar configurações Z-API:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações Z-API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar se empresa foi selecionada
    if (!formData.empresa_id) {
      toast({
        title: "Erro",
        description: "Selecione uma empresa",
        variant: "destructive",
      });
      return;
    }

    // Validar campos obrigatórios
    if (!formData.instance_id || !formData.token) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingConfig) {
        const { error } = await supabase
          .from('zapi_config')
          .update({
            empresa_id: formData.empresa_id,
            instance_id: formData.instance_id,
            token: formData.token,
            webhook_url: formData.webhook_url || null,
          })
          .eq('id', editingConfig.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração Z-API atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('zapi_config')
          .insert([{
            empresa_id: formData.empresa_id,
            instance_id: formData.instance_id,
            token: formData.token,
            webhook_url: formData.webhook_url || null,
            ativo: true,
          }]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração Z-API criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingConfig(null);
      resetForm();
      fetchConfigs();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: `Erro ao salvar configuração Z-API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      empresa_id: empresas.length === 1 ? empresas[0].id : '',
      instance_id: '',
      token: '',
      webhook_url: 'https://obtpghqvrygzcukdaiej.supabase.co/functions/v1/whatsapp-webhook',
    });
  };

  const toggleConfigStatus = async (config: ZApiConfig) => {
    try {
      const { error } = await supabase
        .from('zapi_config')
        .update({ ativo: !config.ativo })
        .eq('id', config.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Configuração ${config.ativo ? 'desativada' : 'ativada'} com sucesso`,
      });

      fetchConfigs();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da configuração",
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
      webhook_url: config.webhook_url || 'https://obtpghqvrygzcukdaiej.supabase.co/functions/v1/whatsapp-webhook',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (config: ZApiConfig) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração?')) return;

    try {
      const { error } = await supabase
        .from('zapi_config')
        .delete()
        .eq('id', config.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração Z-API excluída com sucesso",
      });

      fetchConfigs();
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir configuração Z-API",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center">Carregando configurações Z-API...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Configurações Z-API</h3>
          <p className="text-sm text-gray-600">Gerencie as configurações Z-API de todas as empresas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingConfig(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Configuração
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? 'Editar Configuração Z-API' : 'Nova Configuração Z-API'}
              </DialogTitle>
              <DialogDescription>
                Configure uma nova instância Z-API para uma empresa
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="empresa_id">Empresa *</Label>
                <Select 
                  value={formData.empresa_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, empresa_id: value }))}
                  required
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
                <Label htmlFor="instance_id">Instance ID *</Label>
                <Input
                  id="instance_id"
                  value={formData.instance_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, instance_id: e.target.value }))}
                  placeholder="Ex: 3C4..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="token">Token *</Label>
                <Input
                  id="token"
                  type="password"
                  value={formData.token}
                  onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                  placeholder="Seu token Z-API"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="URL do webhook"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Configure esta mesma URL no painel da Z-API
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingConfig ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {configs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma configuração Z-API</h3>
            <p className="text-gray-500 mb-4">Crie uma configuração Z-API para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Instance ID</TableHead>
                <TableHead>Webhook URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{config.empresas?.nome || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{config.empresas?.email || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{config.instance_id}</TableCell>
                  <TableCell>
                    {config.webhook_url ? (
                      <span className="text-sm text-green-600">Configurado</span>
                    ) : (
                      <span className="text-sm text-gray-400">Não configurado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.ativo ? "default" : "secondary"}>
                      {config.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(config.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(config)}
                        title="Editar configuração"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={config.ativo}
                        onCheckedChange={() => toggleConfigStatus(config)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(config)}
                        className="text-red-600 hover:text-red-700"
                        title="Excluir configuração"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
