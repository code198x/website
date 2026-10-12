# Flyer content corrections

The accepted scope is three Vault articles from issue #369, the hexadecimal
lesson review (#409), its proposed explanatory figure (#411), and a print-proof
check of the existing flyers. Physical printing, phone scanning and an uncoached
reader trial need human observation and cannot be signed off by automated checks.

## 1. Vault citation correction

- Read the restricted-provenance decision and check each affected passage against
  its named source. Use publicly checkable evidence first; retain title/date
  attribution for restricted documents, without quotations or routes to copies.
- Edit `src/content/vault/systems/sega-mega-drive.mdx`,
  `hardware/ym2612.mdx` and `techniques/y-depth-sorting.mdx`, including frontmatter
  source notes and visible Sources. Preserve unrelated historical material.
- Correct directly encountered misstatements rather than preserving them inside
  a paraphrase. Record the source and calculation in the evidence notes.
- Run source/content checks, build, inspect the three rendered pages and source
  notes, then commit and push this bounded correction. Keep #369 open for its
  remaining work.

## 2. Hexadecimal lesson

- Trace every worked value in
  `src/content/curriculum/foundations/counting-in-twos/unit-02.mdx` and check
  independent entry, pseudocode labelling and onward links.
- Correct the unspecified bit in the 255-to-254 example; briefly define binary,
  byte and place values locally, without turning this into another module.
- Add a static figure using the existing F0 example: eight numbered bit positions
  in two groups, left 1111 to F and right 0000 to 0, with 15 × 16 + 0 = 240.
  Use semantic HTML, existing theme tokens and a text equivalent. Labels and
  grouping must work without colour; no new dependency or interactive converter.
- Verify all arithmetic independently. Inspect desktop/mobile, light/dark and
  print once, repair any found defects together and confirm once. Build and run
  relevant accessibility checks, then commit/push separately from the Vault.

## 3. Existing flyer proof

- Identify the current printable files from their README and export records.
- Read page dimensions and render representative pages at useful print scale;
  check QR payloads with the existing decoder and the destination URLs.
- Preserve original flyers. Report a precise physical proof checklist: print one
  at actual size, scan on a phone, and ask an unfamiliar reader to follow it.

Merge the completed changes after checks, following the existing authorization.
Verify the deployed content, without reopening the deferred network-delay work.
