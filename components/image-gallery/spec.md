# Image gallery

- Purpose: Display a swipeable, social-post-style sequence of images with a full-bleed media frame, count badge, dot position, and article-style comment/reaction counters.
- Inputs: Optional heading, comments, reactions, and one to six images with optional descriptions.
- States: Heading omitted; one image; two to six swipeable images; blank image URLs do not render.
- Constraints: Maximum six images; square full-bleed media frame; horizontal scroll snap; image order follows saved configuration; counters are display-only and do not record engagement.
- Reuse: Theme supplies container colour and heading font. Do not fork gallery markup by brand.
