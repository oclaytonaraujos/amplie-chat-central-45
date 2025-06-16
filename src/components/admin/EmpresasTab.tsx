
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NovaEmpresaDialog from './NovaEmpresaDialog';
import EditarEmpresaDialog from './EditarEmpresaDialog';

interface Empresa {
  id: string;
  nome: string;
  email: string;
  plano_id: string;
  ativo: boolean;
  created_at: string;
  planos?: {
    nome: string;
  };
}

export default function EmpresasTab() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          *,
          planos (nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEmpresaStatus = async (empresa: Empresa) => {
    try {
      const { error } = await supabase
        .from('empresas')
        .update({ ativo: !empresa.ativo })
        .eq('id', empresa.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Empresa ${empresa.ativo ? 'desativada' : 'ativada'} com sucesso`,
      });

      fetchEmpresas();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da empresa",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center">Carregando empresas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Empresas Cadastradas</h3>
        <NovaEmpresaDialog onEmpresaCreated={fetchEmpresas} />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((empresa) => (
              <TableRow key={empresa.id}>
                <TableCell className="font-medium">{empresa.nome}</TableCell>
                <TableCell>{empresa.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {empresa.planos?.nome || 'Sem plano'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={empresa.ativo ? "default" : "secondary"}>
                    {empresa.ativo ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(empresa.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditarEmpresaDialog 
                      empresa={empresa} 
                      onEmpresaUpdated={fetchEmpresas} 
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEmpresaStatus(empresa)}
                    >
                      {empresa.ativo ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
