# Content hub workshop builder

This folder is the standalone, static workshop application. It is intentionally separate from the reusable component folders and is designed to be published as a GitHub Pages project site.

Target repository: `https://github.com/lucashale-pm/content-hub-builder.git`.

Components will be implemented incrementally. Each component can bring its own imagery and other placeholder assets while remaining independently testable before it is registered here.

## Component contract

Each builder component remains in `../components/<component-name>/`. Add a browser-facing definition alongside its existing spec and renderer. The definition should provide:

- stable `id`, display name, and category
- editable field schema and required/optional status
- realistic defaults and fallback content
- mobile preview renderer
- optional component-specific controls

The builder owns composition, draft persistence, sharing, and ordering. Components own their own field semantics and visual output.

## Current catalogue seed

`catalogue.json` records the existing `article-card` and `content-carousel` components as the initial registry seed. It is configuration only; it does not replace their TypeScript contracts.

## Planned runtime files

- `index.html`: static application entry point
- `app.js`: builder state, persistence, sharing, and drag/reorder behavior
- `styles.css`: desktop authoring shell and mobile preview frame
- `catalogue.json`: registered component metadata

Keep all URLs relative because GitHub Pages serves project sites below a repository path.
