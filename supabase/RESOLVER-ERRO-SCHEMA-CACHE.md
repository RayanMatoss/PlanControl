# Resolver "Could not find the table 'public.post_its' in the schema cache"

Siga **nessa ordem** no projeto **xndztfehvxunlnkvsdgf** (o do seu `.env.local`):

---

## 1. Confirmar qual projeto a app usa

1. Rode a app: `npm run dev`
2. Abra o **Console** do navegador (F12 → Console)
3. Procure a linha: `[Supabase] Projeto: https://....supabase.co`
4. A URL deve ser **https://xndztfehvxunlnkvsdgf.supabase.co**. Se for outra, a app está em outro projeto — use o passo a passo neste aqui.

---

## 2. Ver se a tabela existe nesse projeto

1. Dashboard Supabase → projeto **xndztfehvxunlnkvsdgf**
2. Menu lateral → **Table Editor**
3. No schema **public**, veja se existe a tabela **post_its**

- **Se NÃO existir:** vá para o passo 3.  
- **Se existir:** pule para o passo 4.

---

## 3. Criar a tabela e permissões (se não existir)

1. No mesmo projeto → **SQL Editor** → **New query**
2. Cole **todo** o conteúdo de **`run-in-dashboard-MINIMO.sql`**
3. **Run**
4. Confirme no **Table Editor** que **post_its** aparece em **public**

---

## 4. Dar permissão e recarregar o cache

1. Ainda no projeto **xndz...** → **SQL Editor** → **New query**
2. Cole o conteúdo de **`só-permissoes-e-cache.sql`**:

```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.post_its TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
```

3. **Run**

---

## 5. Se o erro continuar: reiniciar o projeto (reload do schema)

Às vezes o PostgREST só atualiza o cache ao reiniciar o projeto:

1. No Dashboard do projeto **xndz...** → **Settings** (engrenagem) → **General**
2. Role até **Pause project** → **Pause project**
3. Espere alguns segundos
4. **Resume project**
5. Espere o projeto voltar (alguns segundos)
6. Na sua máquina: **F5** na aplicação e tente criar um post-it de novo

---

## 6. Conferir de novo no Console

Com a app rodando (`npm run dev`), o Console deve mostrar:

`[Supabase] Projeto: https://xndztfehvxunlnkvsdgf.supabase.co`

Se mostrar outra URL, a app está apontando para outro projeto; a tabela tem que existir (e ter GRANT + NOTIFY) **nesse** projeto.
