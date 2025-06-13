
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Setor {
  id: number;
  nome: string;
  agentes: number;
  atendimentosAtivos: number;
  cor: string;
  capacidadeMaxima: number;
  descricao?: string;
  ativo: boolean;
  criadoEm: Date;
}

const setoresIniciais: Setor[] = [
  {
    id: 1,
    nome: 'Vendas',
    agentes: 5,
    atendimentosAtivos: 12,
    cor: 'bg-blue-500',
    capacidadeMaxima: 20,
    descricao: 'Setor responsável por vendas e prospecção',
    ativo: true,
    criadoEm: new Date('2024-01-15')
  },
  {
    id: 2,
    nome: 'Suporte Técnico',
    agentes: 3,
    atendimentosAtivos: 8,
    cor: 'bg-green-500',
    capacidadeMaxima: 15,
    descricao: 'Suporte técnico e resolução de problemas',
    ativo: true,
    criadoEm: new Date('2024-01-20')
  },
  {
    id: 3,
    nome: 'Financeiro',
    agentes: 2,
    atendimentosAtivos: 4,
    cor: 'bg-yellow-500',
    capacidadeMaxima: 10,
    descricao: 'Departamento financeiro e cobrança',
    ativo: true,
    criadoEm: new Date('2024-02-01')
  },
  {
    id: 4,
    nome: 'Recursos Humanos',
    agentes: 1,
    atendimentosAtivos: 1,
    cor: 'bg-purple-500',
    capacidadeMaxima: 5,
    descricao: 'Gestão de pessoas e recursos humanos',
    ativo: true,
    criadoEm: new Date('2024-02-10')
  }
];

export function useSetores() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar setores do localStorage ou usar dados iniciais
    const savedSetores = localStorage.getItem('setores');
    if (savedSetores) {
      try {
        const parsed = JSON.parse(savedSetores);
        setSetores(parsed.map((s: any) => ({ ...s, criadoEm: new Date(s.criadoEm) })));
      } catch (error) {
        console.error('Erro ao carregar setores:', error);
        setSetores(setoresIniciais);
      }
    } else {
      setSetores(setoresIniciais);
    }
  }, []);

  const salvarSetores = (novosSetores: Setor[]) => {
    setSetores(novosSetores);
    localStorage.setItem('setores', JSON.stringify(novosSetores));
  };

  const criarSetor = (dadosSetor: Omit<Setor, 'id' | 'criadoEm'>) => {
    const novoSetor: Setor = {
      ...dadosSetor,
      id: Math.max(...setores.map(s => s.id), 0) + 1,
      criadoEm: new Date()
    };

    const novosSetores = [...setores, novoSetor];
    salvarSetores(novosSetores);

    toast({
      title: "Setor criado",
      description: `O setor "${novoSetor.nome}" foi criado com sucesso.`,
    });

    return novoSetor;
  };

  const editarSetor = (id: number, dadosAtualizados: Partial<Setor>) => {
    const novosSetores = setores.map(setor =>
      setor.id === id ? { ...setor, ...dadosAtualizados } : setor
    );
    salvarSetores(novosSetores);

    toast({
      title: "Setor atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const excluirSetor = (id: number) => {
    const setor = setores.find(s => s.id === id);
    if (!setor) return;

    const novosSetores = setores.filter(s => s.id !== id);
    salvarSetores(novosSetores);

    toast({
      title: "Setor excluído",
      description: `O setor "${setor.nome}" foi excluído com sucesso.`,
      variant: "destructive",
    });
  };

  const obterSetor = (id: number) => {
    return setores.find(s => s.id === id);
  };

  return {
    setores,
    criarSetor,
    editarSetor,
    excluirSetor,
    obterSetor
  };
}
