# Hero

- Purpose: Introduce a content hub with its defining media and context.
- Inputs: Image or video URL, optional video poster URL, accessible image description, eyebrow, headline, subheadline, follower count, last-updated label.
- States: Image (default); video with an explicit play control; no eyebrow; media load failure follows browser fallback behaviour.
- Constraints: Mobile-first; 16:9 media appears above the text on the themed standard surface; headline uses semantic `h1` and theme typography tokens; one media item; headline and media description required; supplied media URL is participant content, not component code; no brand-specific values in renderer.
- Reuse: Apply theme tokens through the `theme` argument. Do not fork markup or CSS for a brand.
