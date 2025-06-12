
import { useState } from 'react';
import { ChatSidebar } from '@/components/chat-interno/ChatSidebar';
import { ChatArea } from '@/components/chat-interno/ChatArea';
import { ContactsList } from '@/components/chat-interno/ContactsList';
import { useIsMobile } from '@/hooks/use-mobile';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'ausente';
  cargo: string;
}

interface Conversa {
  id: number;
  tipo: 'individual' | 'grupo';
  nome: string;
  participantes: Usuario[];
  ultimaMensagem?: {
    texto: string;
    autor: string;
    tempo: string;
  };
  mensagensNaoLidas: number;
  avatar?: string;
}

interface Mensagem {
  id: number;
  texto: string;
  autor: Usuario;
  tempo: string;
  tipo: 'texto' | 'imagem' | 'documento' | 'audio';
  anexo?: {
    nome: string;
    url: string;
    tamanho?: string;
  };
}

// Dados mockados para demonstração
const usuariosMock: Usuario[] = [
  { id: 1, nome: 'Ana Silva', email: 'ana@empresa.com', status: 'online', cargo: 'Supervisora' },
  { id: 2, nome: 'Carlos Santos', email: 'carlos@empresa.com', status: 'online', cargo: 'Agente' },
  { id: 3, nome: 'Maria Costa', email: 'maria@empresa.com', status: 'ausente', cargo: 'Agente' },
  { id: 4, nome: 'João Oliveira', email: 'joao@empresa.com', status: 'offline', cargo: 'Administrador' },
  { id: 5, nome: 'Lucia Ferreira', email: 'lucia@empresa.com', status: 'online', cargo: 'Agente' }
];

const conversasMock: Conversa[] = [
  {
    id: 1,
    tipo: 'individual',
    nome: 'Ana Silva',
    participantes: [usuariosMock[0]],
    ultimaMensagem: {
      texto: 'Precisamos revisar os relatórios de hoje',
      autor: 'Ana Silva',
      tempo: '14:32'
    },
    mensagensNaoLidas: 2
  },
  {
    id: 2,
    tipo: 'grupo',
    nome: 'Equipe Vendas',
    participantes: [usuariosMock[1], usuariosMock[2], usuariosMock[4]],
    ultimaMensagem: {
      texto: 'Carlos Santos: Vou atualizar o status dos leads',
      autor: 'Carlos Santos',
      tempo: '13:45'
    },
    mensagensNaoLidas: 0
  },
  {
    id: 3,
    tipo: 'individual',
    nome: 'Maria Costa',
    participantes: [usuariosMock[2]],
    ultimaMensagem: {
      texto: 'Obrigada pela ajuda com o cliente!',
      autor: 'Maria Costa',
      tempo: '12:15'
    },
    mensagensNaoLidas: 0
  }
];

const mensagensMock: Mensagem[] = [
  {
    id: 1,
    texto: 'Oi! Como está o atendimento hoje?',
    autor: usuariosMock[0],
    tempo: '14:30',
    tipo: 'texto'
  },
  {
    id: 2,
    texto: 'Está correndo bem! Só tive uma dúvida sobre o procedimento de reembolso.',
    autor: { id: 999, nome: 'Você', email: 'voce@empresa.com', status: 'online', cargo: 'Agente' },
    tempo: '14:31',
    tipo: 'texto'
  },
  {
    id: 3,
    texto: 'Precisamos revisar os relatórios de hoje',
    autor: usuariosMock[0],
    tempo: '14:32',
    tipo: 'texto'
  }
];

export default function ChatInterno() {
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(conversasMock[0]);
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensMock);
  const [showContacts, setShowContacts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectConversa = (conversa: Conversa) => {
    setConversaSelecionada(conversa);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = (texto: string) => {
    if (!texto.trim() || !conversaSelecionada) return;

    const novaMensagem: Mensagem = {
      id: mensagens.length + 1,
      texto,
      autor: { id: 999, nome: 'Você', email: 'voce@empresa.com', status: 'online', cargo: 'Agente' },
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tipo: 'texto'
    };

    setMensagens([...mensagens, novaMensagem]);
  };

  const handleNovaConversa = () => {
    setShowContacts(true);
  };

  const handleSelectContact = (usuario: Usuario) => {
    // Verificar se já existe uma conversa com este usuário
    const conversaExistente = conversasMock.find(
      c => c.tipo === 'individual' && c.participantes.some(p => p.id === usuario.id)
    );

    if (conversaExistente) {
      setConversaSelecionada(conversaExistente);
    } else {
      // Criar nova conversa
      const novaConversa: Conversa = {
        id: conversasMock.length + 1,
        tipo: 'individual',
        nome: usuario.nome,
        participantes: [usuario],
        mensagensNaoLidas: 0
      };
      setConversaSelecionada(novaConversa);
    }
    
    setShowContacts(false);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex bg-gray-50 rounded-xl overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 ${!sidebarOpen ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out`
          : 'relative'
        }
        ${isMobile ? 'w-80' : 'w-80'}
      `}>
        {showContacts ? (
          <ContactsList
            usuarios={usuariosMock}
            onSelectContact={handleSelectContact}
            onBack={() => setShowContacts(false)}
          />
        ) : (
          <ChatSidebar
            conversas={conversasMock}
            conversaSelecionada={conversaSelecionada}
            onSelectConversa={handleSelectConversa}
            onNovaConversa={handleNovaConversa}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea
          conversa={conversaSelecionada}
          mensagens={mensagens}
          onSendMessage={handleSendMessage}
          onOpenSidebar={() => setSidebarOpen(true)}
          showMenuButton={isMobile}
        />
      </div>
    </div>
  );
}
