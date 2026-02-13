-- Enums para Post-its (alinhados com src/types/mural.ts)
CREATE TYPE post_it_color AS ENUM ('yellow', 'pink', 'blue', 'green', 'orange');
CREATE TYPE post_it_status AS ENUM ('idea', 'doing', 'done');
CREATE TYPE post_it_type AS ENUM ('note', 'process', 'event');

-- Tabela principal de post-its
CREATE TABLE public.post_its (
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

-- Índices para consultas comuns (calendário por data, filtros)
CREATE INDEX idx_post_its_start_date ON public.post_its (start_date);
CREATE INDEX idx_post_its_end_date ON public.post_its (end_date) WHERE end_date IS NOT NULL;
CREATE INDEX idx_post_its_created_by ON public.post_its (created_by);
CREATE INDEX idx_post_its_tags ON public.post_its USING GIN (tags);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_its_updated_at
  BEFORE UPDATE ON public.post_its
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- RLS (Row Level Security): habilitar para controle de acesso futuro
ALTER TABLE public.post_its ENABLE ROW LEVEL SECURITY;

-- Política permissiva para anon/authenticated (permite ler e escrever)
-- Ajuste depois quando integrar Supabase Auth (ex.: created_by = auth.uid()::text)
CREATE POLICY "Permitir leitura e escrita para todos"
  ON public.post_its
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comentários na tabela
COMMENT ON TABLE public.post_its IS 'Post-its do mural/calendário (demandas, processos, eventos)';
