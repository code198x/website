# Connect the CRASH Live discovery cards to their subjects

The Vault, Pattern Library and Foundations print cards use the existing `/crash-live/` QR destination. Add one clearly named link per card to the current “Find your printed card” navigation in `src/pages/crash-live/index.astro`, with a visible prompt. Preserve the current layout and existing type-in routes.

- “Vault: Why do the colours clash?” links to `/vault/techniques/colour-clash/`.
- “Patterns: Turn a number into a picture” links to `/patterns/sinclair-zx-spectrum/basic/rendering/progress-bar/`.
- “Foundations: How do numbers become pictures?” links to `/foundations/counting-in-twos/`.

Verify with the production build, inspect the actual navigation at narrow/wide widths in both themes, and check all five printed-card destinations. Publish via the existing PR and deployment workflows. No new component, dependency or layout variant is needed.

## Verification

- `npm run build`: passed; 2,448 public pages built and shared frames verified.
- `npm run check:content`: passed.
- Production-preview browser checks at 390 and 1,440 px under light/dark browser preferences: all three new links clicked through to the expected subject headings; both existing type-in anchors retained; five links present; 44 px touch targets and no horizontal page overflow. The current paper appearance remains the same under both browser preferences.
- The navigation was visually inspected at both widths. No shared styles or layouts changed.
