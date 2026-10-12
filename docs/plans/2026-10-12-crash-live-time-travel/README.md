# Connect the time-travel flyer to its program

The approved flyer uses the Spectrum's actual QR output, which points to `/crash-live/`. Add its verified source and capture to the existing printed-card listing flow.

1. Merge the prepared source `_capture/crash-live/typein-qr.bas` in code-samples before merging this website change.
2. Add `spectrum-qr` to `src/lib/crash-typeins.ts`, copy the actual active-area capture to `public/images/crash-live/spectrum-qr.png`, and link it from the existing printed-card navigation in `src/pages/crash-live/index.astro`. The existing `[program].bas.ts` route supplies its exact source download. Preserve the shared page layout and components.
3. Run the production build and content checks. At phone and desktop widths, check the new anchor, image, full 19-line listing, exact download bytes and page overflow.
4. Merge after CI, then verify the actual published listing and source download. No new dependency, component or data schema is required.

## Verification

- Code-samples PR #67 merged as `b204ff2d0eadd9aaee1af7d29afe6dea7943beb6`; BASIC and platform build checks passed.
- `npm run build` and `npm run check:content` passed.
- Production preview at 390 and 1440 px: six printed-card links, correct QR anchor and heading, full listing content, byte-identical source and image downloads, no horizontal page overflow. Both layouts were visually inspected.
- Print proofs preserve every source line exactly. The A6 front and all four A4 front copies independently decode to the event URL.
