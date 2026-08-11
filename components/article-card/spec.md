# Article card

- Purpose: One content item, reusable in grids, lists, and carousels.
- Inputs: Normalized `ContentItem`; display options only.
- States: Default; image missing uses brand fallback; invalid URL excluded upstream.
- Constraints: Semantic article/link; image alt required when image exists; no collection query inside card.
- Reuse: Use for article, video, gallery cards. Add display props, not brand forks.
