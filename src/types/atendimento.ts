
export interface Atendimento {
  id: number;
  cliente: string;
  telefone: string;
  ultimaMensagem: string;
  tempo: string;
  setor: string;
  agente?: string;
  tags?: string[];
  status: 'novos' | 'em-atendimento' | 'pendentes' | 'finalizados';
}

export interface Message {
  id: number;
  texto: string;
  anexo?: {
    tipo: 'imagem' | 'audio' | 'documento' | 'video' | 'contato';
    url?: string;
    nome?: string;
  };
  autor: 'cliente' | 'agente';
  tempo: string;
  status?: 'enviado' | 'entregue' | 'lido';
}

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  status?: 'online' | 'offline';
  ultimoAcesso?: string;
  dataCadastro?: string;
  tags?: string[];
  historico?: {
    id: number;
    data: string;
    assunto: string;
    status: string;
  }[];
}
