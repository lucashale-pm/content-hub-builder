# Feed

- Purpose: Show one featured article plus an ordered editorial feed.
- Inputs: Feed heading/date/archive link; all article labels, text, article images, author images, posted dates, engagement counts, and links are participant-defined draft values.
- States: Featured article; one or more feed articles; missing article image uses browser image fallback; unknown label falls back to theme accent label style.
- Constraints: Mobile-first; article order follows saved configuration; images need alternative text; date is a supplied posted label, never calculated by renderer; no content fetching or brand values in renderer.
- Reuse: Receive theme token values through the `theme` argument. Feed labels use theme label tokens; do not fork markup by brand.
