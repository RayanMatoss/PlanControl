-- Adiciona colunas de conclusão aos post-its (OK / Concluído)
ALTER TABLE public.post_its
  ADD COLUMN IF NOT EXISTS completed_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS completed_by uuid NULL;

COMMENT ON COLUMN public.post_its.completed_at IS 'Data/hora em que o post-it foi marcado como concluído';
COMMENT ON COLUMN public.post_its.completed_by IS 'ID do usuário que marcou como concluído';

-- Índice para filtrar concluídos
CREATE INDEX IF NOT EXISTS idx_post_its_completed_at ON public.post_its (completed_at) WHERE completed_at IS NOT NULL;

-- RLS: política existente permite tudo; quando integrar Auth, restringir update a:
-- status, completed_at, completed_by apenas para membros do team do post-it.
-- Exemplo futuro: USING (auth.uid() IN (SELECT user_id FROM team_members WHERE ...))
