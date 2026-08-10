# Content hub builder

Workshop prototype for composing mobile content hubs from reusable components.

The published site is available at `https://lucashale-pm.github.io/content-hub-builder/`. The root `index.html` forwards to the standalone builder in `builder/`, so the site also works when GitHub Pages is configured to publish the `main` branch root.

## Structure

- `builder/` - standalone static builder site and registry.
- `components/` - reusable component contracts and implementations.
- `content/` - portable example content and media references.
- `pages/` - page composition examples.
- `themes/` - GamesRadar+ and PC Gamer theme tokens.
- `docs/` - builder contract and workshop plan.

The builder is intentionally data-driven. Components remain independently owned in their own folders and are added to the builder registry as they are developed.
