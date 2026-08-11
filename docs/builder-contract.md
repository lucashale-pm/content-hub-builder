# Future builder contract

Builder may edit page configs and choose a theme. It must not alter content records or component implementation.

Allowed controls:

- Theme: `gamesradar` or `pcgamer`.
- Page: title plus ordered sections.
- Section: supported component, title, content selection, declared options.

Validation rules:

- Component name must be registered.
- IDs unique per page.
- `tags` selection needs at least one tag and positive limit.
- `ids` selection preserves authored order.
- Renderer receives resolved content; it does not parse Markdown or fetch URLs.
