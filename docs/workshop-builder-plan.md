# Content hub workshop builder plan

## Summary

Create a self-contained static builder site inside `prototypes/content-hubs/`, ready to publish with GitHub Pages. Creators choose the number of components and their order; the builder composes reusable components that remain owned by their existing folders.

## Implementation changes

- Keep each component in `components/<component-name>/` with its specification, definition/schema, and renderer. The builder reads registered definitions; it does not duplicate component markup or hard-code the catalogue.
- Build a desktop-only workshop UI with a categorised component picker, editable page canvas, add/remove/duplicate/edit controls, and drag/reorder support. There is no minimum or maximum component count.
- Render a mobile-only, recognisable preview for the selected GamesRadar+ or PC Gamer scenario.
- Store a versioned draft containing brand, scenario, page metadata, and ordered component instances. Keep component definitions separate from participant content.
- Use realistic editable defaults for declared fields: image URL with fallback, headings, copy, links, and component-specific options.
- Auto-save the active draft locally; support compressed share links plus JSON download/import. No account, backend, upload, or collaborative-editing dependency.

## GitHub Pages delivery

- Target repository: `https://github.com/lucashale-pm/content-hub-builder.git`.
- Use a static site entry point and relative asset paths so the builder works from a GitHub Pages project subpath.
- Publish only the standalone builder interface; keep component documentation and source folders in the repository.
- Add a GitHub Actions workflow after the repository can be cloned and its default branch is confirmed.

## Test plan

- Verify each registered component can be added, edited, duplicated, removed, reordered, and rendered from its own folder.
- Verify empty, short, and long creator-defined pages preserve exact order in preview, share URL, local draft, and JSON round trip.
- Verify missing/invalid images and unknown component data degrade without breaking the preview.
- Test the deployed site from its GitHub Pages subpath, including refresh, direct share links, import/export, and brand/scenario switching.
- Provide keyboard-accessible reorder controls as a fallback to drag and drop.

## Assumptions

- The component list, categories, field requirements, and representative defaults will be supplied separately.
- Participants author on desktop/laptop; the generated hub preview is mobile only.
- Each participant receives an analogous brand-specific editorial brief.
- Video-call recording captures rationale; the page configuration is the only workshop artefact handled by the tool.
