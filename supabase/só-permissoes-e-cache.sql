-- Rode no SQL Editor do MESMO projeto que a app usa (xndz... em dev).
-- Só permissões + reload do cache (use se a tabela post_its já existe).

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.post_its TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
