-- =============================================================================
-- SCRIPT MÍNIMO - Pode rodar várias vezes (ignora se já existir).
-- Rode no Supabase: SQL Editor → New query → Cole → Run
-- =============================================================================

-- Tipos (enums) - só cria se ainda não existir
DO $$ BEGIN
  CREATE TYPE post_it_color AS ENUM ('yellow', 'pink', 'blue', 'green', 'orange');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE post_it_status AS ENUM ('idea', 'doing', 'done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE post_it_type AS ENUM ('note', 'process', 'event');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tabela
CREATE TABLE IF NOT EXISTS public.post_its (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  color post_it_color NOT NULL DEFAULT 'yellow',
  status post_it_status NOT NULL DEFAULT 'idea',
  type post_it_type NOT NULL DEFAULT 'note',
  secretaria text,
  assigned_to text,
  created_by text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NULL,
  completed_by uuid NULL
);

-- Colunas de conclusão (caso a tabela já exista sem elas)
ALTER TABLE public.post_its
  ADD COLUMN IF NOT EXISTS completed_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS completed_by uuid NULL;

-- RLS (obrigatório para a API do Supabase)
ALTER TABLE public.post_its ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura e escrita para todos" ON public.post_its;
CREATE POLICY "Permitir leitura e escrita para todos"
  ON public.post_its FOR ALL
  USING (true) WITH CHECK (true);

-- Permissões para a API REST (anon e authenticated conseguem usar a tabela)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.post_its TO anon, authenticated;

-- Atualiza o schema cache do PostgREST (obrigatório após criar/alterar)
NOTIFY pgrst, 'reload schema';
