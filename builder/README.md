# Content hub workshop builder

This folder is the standalone static workshop application, designed to publish as a GitHub Pages project site.

The published site will also include `/explorer/`, a read-only catalogue for reviewing every registered component in isolation before using it in the builder.

Components are implemented incrementally in `../components/<component-name>/`. Each component can bring its own imagery and other placeholder assets while remaining independently testable before it is registered here.

Planned runtime files:

- `index.html` - static application entry point
- `app.js` - builder state, persistence, sharing, and ordering
- `styles.css` - authoring shell and mobile preview
- `catalogue.json` - registered component metadata

Keep all URLs relative because GitHub Pages serves project sites below a repository path.
