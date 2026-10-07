## verdict

- **Rail grouping — resolved.** Reopened the same article desktop/mobile captures and full pages. Details now follows contents in the right rail rather than appearing halfway down the article; `reading-desktop.png` makes the continuous grouping directly legible. Mobile retains contents before prose and details after it. The source uses `max-content minmax(0, 1fr)` with mobile rows restored to `auto`; the parent reports the measured 28px gap passing.
- **Family type scale and reader scaling — resolved.** Reopened the same category, article and reading captures. Rem/token-based title, prose, caption and section sizes retain clear hierarchy, bounded text and native capture treatment. The desktop SID title now fits one line; this is a valid consequence of the sanctioned 80px hero step. Source confirms family rem tokens; the parent reports the root-font scaling regression passing. No production visual regression from this correction is visible.
- **Component-preview fidelity — resolved.** Reopened the same `catalogue-desktop.png` and `catalogue-mobile.png` after the scoped-selector fix. The desktop Colour Clash heading now matches the production component's scale, Techniques uses its craft ink, and the visible ULA connection uses hardware blue. Mobile preserves the component's smaller heading, readable flow and viewport-wide capture. Source confines the catalogue overrides to `main > p a` and `main > h1`; nested component descendants are excluded. The parent reports computed-style equality with production. No regression from this final catalogue-only fix is visible.

## remaining

Clear. This ship verdict covers the scored rail, type-scale and component-preview fixes, not a new review of the whole surface.

disposition: ship
