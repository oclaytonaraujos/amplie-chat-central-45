
import { useState, useCallback } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { useToast } from '@/hooks/use-toast';

interface AtendimentoData {
  id: number;
  cliente: string;
  telefone: string;
  setor: string;
  agente?: string;
  tags: string[];
}

export const useContactSaving = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showNovoContatoDialog, setShowNovoContatoDialog] = useState(false);
  const [atendimentoParaSalvar, setAtendimentoParaSalvar] = useState<AtendimentoData | null>(null);
  const [dadosPrePreenchidos, setDadosPrePreenchidos] = useState<any>(null);
  
  const { isNewContact, addContato, finalizarAtendimento } = useSystem();
  const { toast } = useToast();

  const handleFinalizarAtendimento = useCallback((atendimento: AtendimentoData) => {
    // Finalizar o atendimento primeiro
    finalizarAtendimento(atendimento.id);

    // Verificar se é um contato novo
    if (isNewContact(atendimento.telefone)) {
      setAtendimentoParaSalvar(atendimento);
      setShowConfirmDialog(true);
    } else {
      toast({
        title: "Atendimento finalizado",
        description: `Atendimento com ${atendimento.cliente} foi finalizado com sucesso.`,
      });
    }
  }, [isNewContact, finalizarAtendimento, toast]);

  const handleConfirmSave = useCallback(() => {
    if (!atendimentoParaSalvar) return;

    // Preparar dados pré-preenchidos para o NovoContatoDialog
    const dadosIniciais = {
      nome: atendimentoParaSalvar.cliente,
      telefone: atendimentoParaSalvar.telefone,
      email: '', // Será preenchido manualmente pelo agente
      ultimoAtendente: atendimentoParaSalvar.agente || 'Ana Silva',
      setorUltimoAtendimento: atendimentoParaSalvar.setor,
      dataUltimaInteracao: new Date().toISOString(),
      tags: [...atendimentoParaSalvar.tags, 'Novo Contato'],
      status: 'ativo' as const,
      totalAtendimentos: 1,
      atendentesAssociados: [
        {
          setor: atendimentoParaSalvar.setor,
          atendente: atendimentoParaSalvar.agente || 'Ana Silva'
        }
      ]
    };

    setDadosPrePreenchidos(dadosIniciais);
    setShowConfirmDialog(false);
    setShowNovoContatoDialog(true);
  }, [atendimentoParaSalvar]);

  const handleCancelSave = useCallback(() => {
    if (atendimentoParaSalvar) {
      toast({
        title: "Atendimento finalizado",
        description: `Atendimento com ${atendimentoParaSalvar.cliente} foi finalizado. Contato não foi salvo.`,
      });
    }
    setAtendimentoParaSalvar(null);
    setShowConfirmDialog(false);
  }, [atendimentoParaSalvar, toast]);

  const handleContatoAdicionado = useCallback((novoContato: any) => {
    const contatoCompleto = {
      ...novoContato,
      id: Date.now() // Em produção, seria gerado pelo backend
    };

    addContato(contatoCompleto);
    
    toast({
      title: "Contato salvo",
      description: `${novoContato.nome} foi adicionado aos seus contatos.`,
    });

    setDadosPrePreenchidos(null);
    setAtendimentoParaSalvar(null);
    setShowNovoContatoDialog(false);
  }, [addContato, toast]);

  return {
    showConfirmDialog,
    setShowConfirmDialog,
    showNovoContatoDialog,
    setShowNovoContatoDialog,
    atendimentoParaSalvar,
    dadosPrePreenchidos,
    handleFinalizarAtendimento,
    handleConfirmSave,
    handleCancelSave,
    handleContatoAdicionado
  };
};
