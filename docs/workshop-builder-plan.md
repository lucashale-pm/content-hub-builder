# Content hub workshop builder plan

## Summary

Create a self-contained static builder site inside this repository, ready to publish with GitHub Pages. Creators choose the number of components and their order; the builder composes reusable components that remain owned by their existing folders.

## Implementation changes

- Keep each component in `components/<component-name>/` with its specification, definition/schema, renderer, and placeholder assets. The builder reads registered definitions; it does not duplicate component markup.
- Build a desktop-only workshop UI with a categorised component picker, editable page canvas, add/remove/duplicate/edit controls, and drag/reorder support. There is no minimum or maximum component count.
- Render a mobile-only, recognisable preview for the selected GamesRadar+ or PC Gamer scenario.
- Add a separate component explorer at `/explorer/`, linked from the builder. It shows the full registered catalogue grouped by category, with each component rendered in isolation and its available states, fields, options, and placeholder imagery visible.
- Store a versioned draft containing brand, scenario, page metadata, and ordered component instances. Keep component definitions separate from participant content.
- Auto-save the active draft locally; support compressed share links plus JSON download/import. No account, backend, upload, or collaborative-editing dependency.

## GitHub Pages delivery

- Use a static site entry point and relative asset paths so the builder works from a project subpath.
- Publish only the standalone builder interface; keep component documentation and source folders in the repository.
- Add a GitHub Actions workflow after the static entry point is implemented.

## Assumptions

- The explorer is a read-only catalogue and does not modify workshop drafts.
- The component list, categories, field requirements, placeholder imagery, and defaults will be supplied incrementally.
- Participants author on desktop/laptop; the generated hub preview is mobile only.
- Each participant receives an analogous brand-specific editorial brief.
- Video-call recording captures rationale; the page configuration is the only workshop artefact handled by the tool.
