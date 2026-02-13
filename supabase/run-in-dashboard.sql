-- =============================================================================
-- Rode este script no Supabase Dashboard:
--   1. Abra https://supabase.com/dashboard e selecione seu projeto
--   2. Menu lateral: SQL Editor
--   3. New query → cole todo o conteúdo abaixo → Run
-- =============================================================================

-- Enums para Post-its (alinhados com src/types/mural.ts)
DO $$ BEGIN
  CREATE TYPE post_it_color AS ENUM ('yellow', 'pink', 'blue', 'green', 'orange');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE post_it_status AS ENUM ('idea', 'doing', 'done');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE post_it_type AS ENUM ('note', 'process', 'event');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Tabela principal de post-its
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
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Colunas de conclusão (OK / Concluído)
ALTER TABLE public.post_its
  ADD COLUMN IF NOT EXISTS completed_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS completed_by uuid NULL;

-- Índices
CREATE INDEX IF NOT EXISTS idx_post_its_start_date ON public.post_its (start_date);
CREATE INDEX IF NOT EXISTS idx_post_its_end_date ON public.post_its (end_date) WHERE end_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_post_its_created_by ON public.post_its (created_by);
CREATE INDEX IF NOT EXISTS idx_post_its_tags ON public.post_its USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_post_its_completed_at ON public.post_its (completed_at) WHERE completed_at IS NOT NULL;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_its_updated_at ON public.post_its;
CREATE TRIGGER post_its_updated_at
  BEFORE UPDATE ON public.post_its
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- RLS
ALTER TABLE public.post_its ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura e escrita para todos" ON public.post_its;
CREATE POLICY "Permitir leitura e escrita para todos"
  ON public.post_its
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.post_its IS 'Post-its do mural/calendário (demandas, processos, eventos)';
