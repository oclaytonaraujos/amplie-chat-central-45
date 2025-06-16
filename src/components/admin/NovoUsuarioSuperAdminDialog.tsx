
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Empresa {
  id: string;
  nome: string;
}

interface NovoUsuarioSuperAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsuarioCreated: () => void;
  empresas: Empresa[];
}

export default function NovoUsuarioSuperAdminDialog({ 
  open, 
  onOpenChange, 
  onUsuarioCreated, 
  empresas 
}: NovoUsuarioSuperAdminDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa_id: '',
    cargo: 'usuario',
    setor: '',
    status: 'online'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Criar o usuário diretamente no profiles (sem criar na auth)
      // Isso permite que super admins criem usuários que podem ser ativados posteriormente
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(), // Gerar um UUID temporário
          nome: formData.nome,
          email: formData.email,
          empresa_id: formData.empresa_id,
          cargo: formData.cargo,
          setor: formData.setor,
          status: 'pendente' // Status especial para usuários criados por admin
        });

      if (profileError) throw profileError;

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso. O usuário receberá um convite por email para ativar a conta.",
      });

      setFormData({
        nome: '',
        email: '',
        empresa_id: '',
        cargo: 'usuario',
        setor: '',
        status: 'online'
      });
      onUsuarioCreated();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="empresa">Empresa *</Label>
            <Select
              value={formData.empresa_id}
              onValueChange={(value) => setFormData({ ...formData, empresa_id: value })}
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
            <Label htmlFor="cargo">Cargo *</Label>
            <Select
              value={formData.cargo}
              onValueChange={(value) => setFormData({ ...formData, cargo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="agente">Agente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="setor">Setor</Label>
            <Input
              id="setor"
              value={formData.setor}
              onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
              placeholder="Ex: Vendas, Suporte, Marketing"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.empresa_id}>
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
