# Feed

- Purpose: Show optional scrollable filters, featured article/video, and ordered article/video feed items.
- Inputs: Feed heading/date/archive link; filter labels; article metadata/images; YouTube URLs and optional video headings.
- States: Filters are visual-only and toggle selected state. Featured content can be article or video. Feed items can be article or inline video.
- Constraints: Mobile-first; order follows saved configuration. YouTube URL must be a valid YouTube link. Missing optional writing is hidden. No content fetching.
- Reuse: Receives theme tokens. Filter selected state and all label styles use theme accent/token values.
