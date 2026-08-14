# Content hub builder

## Purpose

Desktop workshop for composing mobile (390px) content hubs from reusable components. It has two modes: **Builder** creates an ordered page draft; **Component viewer** previews one component in isolation.

## Structure

- `builder/`: Vite + React authoring application.
- `components/<component>/`: reusable component source. Each component owns `definition.json`, `renderer.js`, and `styles.css`; local placeholder assets may live here.
- `themes/`: shared theme token contracts. Workshop currently uses only `wireframe` (neutral black/white/grey with standard font).
- `docs/workshop-builder-plan.md`: original product plan and constraints.
- `builder/catalogue.json`: legacy seed/reference only. It is not imported at runtime; do not register components here.

## Add or change a component

1. Keep it in `components/<component-name>/`.
2. Put all user-editable content in `definition.json`. Optional empty values must hide from live render.
3. Render in `renderer.js` with browser DOM APIs. Never hard-code brand colours or fonts; consume theme tokens and provide sensible fallbacks.
4. Put component CSS in `styles.css`, using component-scoped classes such as `.hub-<component>__...`.
5. Register definition, renderer, and stylesheet in `builder/src/App.tsx` / `builder/src/main.tsx`.
6. Support existing saved drafts when adding fields: add a non-destructive upgrade in `upgradeInstanceValues` if defaults need to populate old instances.

## Builder rules

- Mobile preview width is exactly `390px`.
- Builder shell is desktop-only. Authoring pane and preview scroll independently.
- Clicking a preview component must select its matching instance, scroll to its edit controls, and show its blue selected border/tint.
- Component picker adds new instances only. Existing instances are edited through preview or **Added to page**.
- Page drafts auto-save to `localStorage`; import/export JSON must remain compatible.
- `Added to page` supports edit, delete confirmation, and drag reorder. Do not let it cover the mobile preview; compact it when space is insufficient.
- Full preview hides authoring UI and centres a scrollable mobile frame.

## Styling rules

- Use theme values for colours, fonts, surfaces, borders, spacing, and labels. No component-owned brand theme.
- Use consistent mobile padding (normally 16px) and shared text scale. Non-hero component headings align left and use common heading size.
- Standard surfaces are light unless a requirement needs contrast. White text must have a sufficiently dark themed surface.
- Avoid forced uppercase except labels explicitly styled as labels.

## Run and verify

```bash
cd builder
npm run dev -- --host 127.0.0.1
npm run build
```

Run `npm run build` after every code change. Stop local dev servers when asked.

## Git and publishing

- Work locally by default. Do not commit or push unless user explicitly asks to push/live/commit.
- Remote repository: `https://github.com/lucashale-pm/content-hub-builder.git` (`origin`).
- Repository branch is `main`; GitHub Pages deploys automatically on every push to it.
- Deployment workflow: `.github/workflows/deploy-pages.yml`. It runs `npm ci` and `npm run build` in `builder/`, then publishes `builder/dist`.
- Node version is `22` (`.nvmrc` and deployment workflow). Do not publish `builder/node_modules` or `builder/dist` manually.
- Before committing, preserve unrelated user changes and inspect `git status`.
- When requested to publish: run `npm run build` in `builder/`, commit only approved task files, then run `git push origin main`. Report commit hash; GitHub Actions completes Pages deployment after push.
