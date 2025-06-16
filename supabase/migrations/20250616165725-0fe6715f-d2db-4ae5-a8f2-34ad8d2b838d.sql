
-- Adicionar coluna de permissões na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS permissoes jsonb DEFAULT '[]'::jsonb;

-- Criar tabela de setores se não existir
CREATE TABLE IF NOT EXISTS public.setores_sistema (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  descricao text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Inserir setores padrão
INSERT INTO public.setores_sistema (nome, descricao) VALUES 
('Vendas', 'Setor responsável pelas vendas'),
('Suporte', 'Setor de atendimento ao cliente'),
('Marketing', 'Setor de marketing e publicidade'),
('Financeiro', 'Setor financeiro e contábil'),
('RH', 'Recursos Humanos'),
('TI', 'Tecnologia da Informação'),
('Administração', 'Administração geral')
ON CONFLICT (nome) DO NOTHING;

-- Atualizar constraint de cargo para incluir papel
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_cargo_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_cargo_check 
CHECK (cargo IN ('super_admin', 'admin', 'supervisor', 'agente', 'usuario'));

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_cargo ON public.profiles(cargo);
CREATE INDEX IF NOT EXISTS idx_profiles_setor ON public.profiles(setor);
CREATE INDEX IF NOT EXISTS idx_profiles_empresa_id ON public.profiles(empresa_id);

-- Habilitar RLS na tabela setores_sistema
ALTER TABLE public.setores_sistema ENABLE ROW LEVEL SECURITY;

-- Política para setores_sistema - todos podem ver
CREATE POLICY "Todos podem ver setores" ON public.setores_sistema 
  FOR SELECT TO authenticated 
  USING (ativo = true);

-- Super admin pode gerenciar setores
CREATE POLICY "Super admin pode gerenciar setores" ON public.setores_sistema 
  FOR ALL TO authenticated 
  USING (public.is_super_admin());
