# PlanControl

Aplicação de planejamento e anotações com calendário anual e mensal, post-its por dia e integração com Supabase.

## Tecnologias

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- Supabase
- date-fns, Framer Motion

## Desenvolvimento local

```sh
npm i
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Estrutura

- **Visão anual**: grade de 12 meses; clique no mês para abrir o calendário do mês.
- **Visão mensal**: grade de dias; clique no dia para ver e criar post-its.
- **Post-its**: anotações por dia (nota, processo, evento) com cores e status.
- **Temas**: 5 theme packs (Whiteboard Pro, Blueprint Grid, Kanban Calendar, Focus Mode, Neon Night Ops). Seletor na topbar (ícone de paleta) ou **Ctrl+Shift+T**. Fundos estáticos (textura/grid leve). Persistência: `plancontrol_theme` e `plancontrol_motion` (animações: off / pouco / alto). Respeita `prefers-reduced-motion`.

---

## Como adicionar um novo tema

1. **CSS** – Em `src/styles/theme-packs.css`:
   - Adicione um bloco `[data-theme="seu-id"]` definindo os tokens: `--bg`, `--panel`, `--text`, `--muted`, `--border`, `--accent`, `--accent2`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--border-w`, `--card-gap`, `--cell-padding`, `--font-scale`, `--outline-focus`.
   - Defina também as variáveis de compatibilidade: `--background`, `--foreground`, `--card`, `--card-foreground`, `--mural-bg`, `--mural-bg-texture` (opcional, textura estática), `--mural-grid-color`, `--day-cell-hover`, `--postit-*`, `--sidebar-*`.
   - Regras específicas para `.mural-area`, `.day-cell`, `.day-cell:hover`, `.postit-card` conforme o estilo do tema (ex.: grid estático, glass, status stripe).
   - Para o preview no seletor: adicione `.theme-preview[data-theme="seu-id"]` com `--radius-md`, `--radius-sm`, `--shadow-sm`, `--border-w`.

2. **Registry** – Em `src/lib/theme/registry.ts`:
   - Inclua o id no tipo `ThemeId` e no array `THEME_IDS`.
   - Adicione a entrada em `THEME_REGISTRY` com `id`, `name`, `description`, `dataTheme`, `motionPreset`, `shapePreset`, `densityPreset`, `previewColors` (bg, card, cardBorder).

3. **Motion** – Em `src/lib/theme/motion-presets.ts`, adicione o preset em `THEME_TO_PRESET` e, se quiser variantes específicas, em `PRESETS`.

4. **Anti-flash** – Em `index.html`, no script no `<head>`, adicione o id ao array `validThemes`.
