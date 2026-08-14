# Fan hub link

## Summary

Compact game-hub invitation with an editorial story rail.

## Purpose

Move readers from a broader games hub to a game-specific fan hub with a direct CTA, then encourage article discovery through an editorial rail.

## Inputs

- Game title, destination URL, CTA text, and stories heading.
- Up to four article listings, each with image, alt text, content label, headline, author/avatar, posted label, comments, reactions, and URL.
- Accessible carousel scroll-button label.

## States

- Full: linked title, hub CTA, two-part editorial card rail, scroll affordance, and up to two further cards.
- Partial: missing images render neutral media placeholders; missing headlines or links hide only that content.
- Empty: missing game title hides the component.

## Behavior

- Title and full-width primary CTA below story cards link to `hubUrl` when supplied.
- Article listings link independently to their own URLs.
- Touchpad/touch horizontal scroll snaps each card into place; arrow smoothly scrolls next cards into view.

## Constraints

- Mobile-first layout at 390px: one large card plus next-card preview; additional cards sit outside viewport until horizontal scroll.
- Consume theme tokens for colors and fonts; no brand-owned styling.
- Use scoped `hub-fan-hub__*` classes.
- Do not fetch content or assume article count beyond four.
- Preserve readable labels and visible keyboard focus.

## Reuse guidance

Use for one destination hub. Use `discover-hubs` when readers choose among multiple hubs. Keep article count at four or fewer to preserve the compact strip.

## Open items

- Confirm production analytics events for title click, article click, and carousel advance.
