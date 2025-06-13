
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useSetores, type Setor } from '@/hooks/useSetores';

const coresDisponiveis = [
  { valor: 'bg-blue-500', nome: 'Azul' },
  { valor: 'bg-green-500', nome: 'Verde' },
  { valor: 'bg-yellow-500', nome: 'Amarelo' },
  { valor: 'bg-purple-500', nome: 'Roxo' },
  { valor: 'bg-red-500', nome: 'Vermelho' },
  { valor: 'bg-indigo-500', nome: 'Índigo' },
  { valor: 'bg-pink-500', nome: 'Rosa' },
  { valor: 'bg-teal-500', nome: 'Verde-azulado' },
  { valor: 'bg-orange-500', nome: 'Laranja' },
  { valor: 'bg-gray-500', nome: 'Cinza' }
];

export function NovoSetorDialog() {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('');
  const [capacidadeMaxima, setCapacidadeMaxima] = useState('20');
  const [descricao, setDescricao] = useState('');
  const { criarSetor } = useSetores();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !cor) {
      return;
    }

    const dadosSetor: Omit<Setor, 'id' | 'criadoEm'> = {
      nome: nome.trim(),
      cor,
      capacidadeMaxima: parseInt(capacidadeMaxima) || 20,
      descricao: descricao.trim() || undefined,
      agentes: 0,
      atendimentosAtivos: 0,
      ativo: true
    };

    criarSetor(dadosSetor);
    
    // Limpar formulário
    setNome('');
    setCor('');
    setCapacidadeMaxima('20');
    setDescricao('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amplie-primary hover:bg-amplie-primary-light">
          <Plus className="w-4 h-4 mr-2" />
          Novo Setor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Setor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Setor</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Vendas, Suporte..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor">Cor do Setor</Label>
            <Select value={cor} onValueChange={setCor} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cor" />
              </SelectTrigger>
              <SelectContent>
                {coresDisponiveis.map((corOption) => (
                  <SelectItem key={corOption.valor} value={corOption.valor}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 ${corOption.valor} rounded`}></div>
                      <span>{corOption.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidade">Capacidade Máxima</Label>
            <Input
              id="capacidade"
              type="number"
              value={capacidadeMaxima}
              onChange={(e) => setCapacidadeMaxima(e.target.value)}
              min="1"
              max="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (Opcional)</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do setor..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-amplie-primary hover:bg-amplie-primary-light">
              Criar Setor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
