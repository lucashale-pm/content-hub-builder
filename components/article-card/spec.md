# Article card

- Purpose: One content item, reusable in grids, lists, and carousels.
- Inputs: Normalized content item plus display options.
- States: Default; missing image uses a supplied fallback; invalid URL is excluded upstream.
- Constraints: Semantic article/link; image alt required when an image exists; no collection query inside the card.
- Reuse: Use for article, video, and gallery cards. Add display props, not brand forks.
