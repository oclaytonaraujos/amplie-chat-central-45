
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  setor: string;
  status: string;
  empresa_id: string;
  created_at: string;
  empresas?: {
    nome: string;
  };
}

export default function UsuariosTab() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [empresas, setEmpresas] = useState<{id: string, nome: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsuarios();
    fetchEmpresas();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          empresas (nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'online': { variant: 'default' as const, label: 'Online' },
      'offline': { variant: 'secondary' as const, label: 'Offline' },
      'ausente': { variant: 'outline' as const, label: 'Ausente' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: 'secondary' as const, label: status };
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getCargoBadge = (cargo: string) => {
    const cargoMap = {
      'super_admin': { variant: 'destructive' as const, label: 'Super Admin' },
      'admin': { variant: 'default' as const, label: 'Administrador' },
      'agente': { variant: 'secondary' as const, label: 'Agente' },
      'usuario': { variant: 'outline' as const, label: 'Usuário' },
    };

    const cargoInfo = cargoMap[cargo as keyof typeof cargoMap] || { variant: 'outline' as const, label: cargo };
    
    return (
      <Badge variant={cargoInfo.variant}>
        {cargoInfo.label}
      </Badge>
    );
  };

  const usuariosFiltrados = filtroEmpresa 
    ? usuarios.filter(usuario => usuario.empresa_id === filtroEmpresa)
    : usuarios;

  if (loading) {
    return <div className="text-center">Carregando usuários...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Usuários do Sistema</h3>
        <div className="flex items-center gap-4">
          <Select value={filtroEmpresa} onValueChange={setFiltroEmpresa}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as empresas</SelectItem>
              {empresas.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.empresas?.nome || 'N/A'}</TableCell>
                  <TableCell>{getCargoBadge(usuario.cargo)}</TableCell>
                  <TableCell>{usuario.setor || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                  <TableCell>
                    {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
