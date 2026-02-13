# Atenção: qual projeto Supabase?

Você tem **dois** projetos no `.env` / `.env.local`:

| Arquivo     | URL do projeto                          | Quando a app usa        |
|------------|------------------------------------------|-------------------------|
| `.env`     | `ptwaasrmcrsuxhglxsby.supabase.co`       | build / se não tiver .env.local |
| `.env.local` | `xndztfehvxunlnkvsdgf.supabase.co`     | **em dev (npm run dev)** ← normalmente este |

**O script SQL precisa ser rodado no MESMO projeto que a aplicação está usando.**

1. Veja qual URL está em uso: no seu `.env.local` está `VITE_SUPABASE_URL=...` (em dev a app usa esse).
2. No **Supabase Dashboard**, abra o projeto cuja **Project URL** é essa mesma (Settings → API).
3. Nesse projeto: **SQL Editor** → cole o conteúdo de `run-in-dashboard-MINIMO.sql` → **Run**.
4. No final do script está `NOTIFY pgrst, 'reload schema';` — isso atualiza o cache para a tabela aparecer na API.
5. Recarregue a aplicação (F5) e teste de novo.

Se você rodou o SQL só no projeto **ptwaasrmcrsuxhglxsby** mas a app em dev usa **xndztfehvxunlnkvsdgf** (do .env.local), a tabela “não existe” para a app. Rode o script no projeto **xndz...**.
