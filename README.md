# Content Hubs

Composable hub foundation. Content stays separate from display. Pages compose sections. Themes change brand styling only.

## Flow

`content/*.md` or media URL -> `content-index.ts` -> card -> collection/carousel -> page config -> renderer`

## Start

1. Add article Markdown in `content/articles/`; include front matter matching `src/content/types.ts`.
2. Add remote media by URL in `content/media/index.ts`.
3. Pick items in a page config under `pages/`.
4. Render config through `src/pages/render-page.ts`; pass `gamesradar` or `pcgamer` theme.

No page component reads files, selects items, or contains brand values. Keep those jobs separate.

## Folders

- `content/`: portable source material.
- `components/`: component contracts and specs; no brand styling.
- `pages/`: page composition/configuration only.
- `themes/`: per-brand token overrides.
- `src/`: small integration contracts and examples.
- `docs/`: rules for future builder.
