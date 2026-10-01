# Phosphor icons

Glyphs from [Phosphor Icons](https://phosphoricons.com), `@phosphor-icons/core`
2.1.1, regular weight, copied unmodified from
`https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/assets/regular/<name>.svg`.
MIT licence (`LICENSE.txt` here, the package's `LICENSE` renamed so it serves as text); credited on `/colophon`.

They are self-hosted on purpose: no npm dependency and no CDN at runtime. The
homepage reads each file at build time and inlines it, so it draws in
`currentColor`.
The same pattern as the 198x-ui kit's `components/icons/phosphor/`.

Only the glyphs the site uses are kept. Add one by copying its file from the
same package version, never by drawing a path. Sections are told apart by
these marks, never by a colour (family-visual-identity.md §7).

| File | Used by |
|---|---|
| `lightbulb.svg` | Homepage door: The Basics |
| `cpu.svg` | Homepage door: Foundations |
| `hammer.svg` | Homepage door: The Craft |
| `puzzle-piece.svg` | Homepage door: Pattern Library |
| `vault.svg` | Homepage door: The Vault |
| `clock-counter-clockwise.svg` | Homepage door: The Timeline |
