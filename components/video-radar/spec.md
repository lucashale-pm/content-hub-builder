# Video radar

- Summary: Live-feed video module with lead clip and horizontal latest-video rail.
- Purpose: Turn a publisher MRSS feed into a browseable, high-intent video destination on a hub.
- Inputs: Heading, same-origin/local feed endpoint, public source URL, item count, optional lead description.
- States: Loading/fallback (saved feed items), live loaded, empty feed, endpoint failure, poster, and inline playback.
- Behavior: Fetches feed once per rendered instance; parses title, description, category, MP4, poster and duration; first clip is lead, remaining clips horizontally scroll. Selecting a clip plays native video in lead position; close restores poster.
- Constraints: Direct source feed lacks CORS header, so local Vite proxy supplies same-origin endpoint. Fallback is intentional for static builds. Native video only; browser autoplay policy may require initial muted playback or user click.
- Reuse guidance: Keep provider-agnostic MRSS parser and visual pattern. Only change endpoint/default data per publisher feed; do not fork layout for individual franchises.
- Open items: Production endpoint/proxy ownership needed before this can be deployed as truly live data.
