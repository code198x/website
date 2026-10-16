# Quiet labels: roll out the 16 October identity decision

`decisions/family-visual-identity.md` (umbrella, dd179e8f) retired tracked
uppercase mono as a label style. Labels, including navigation, become Nebula
Sans semibold, sentence case, untracked, at least 13px; mono stays for code,
data and machine output; left stripes thicker than 1px give way to hair rules.
Steve approved the record and asked for the rollout tonight, as a PR to review.

## Steps and evidence

1. Kit (`198x-ui`): `Eyebrow` loses uppercase and tracking. PR there, then the
   website's `scripts/fetch-ui.sh` pin moves to the merged commit.
2. Site CSS: every label rule set in mono and uppercase or tracked (78), plus the
   10 that inherit their face and the one sans uppercase rule, moves to the
   label style. Kept: magazine-face rules (capitals allowed by §4) and data
   (`BitPicture .rows`, `TraceTable` elision). Prose set in mono (family hero
   subtitles, the From the Metal sign-off and card titles) moves to Nebula Sans.
3. Text: navigation labels and the twelve From the Metal categories typed in
   capitals become sentence case.
4. Stripes: delimiters thicker than 1px (Vault contents, quotations, code; the
   assembly and Build198x examples) become hair rules.
5. Verify on a local build: the label census across the 24 routes finds no
   mono or uppercase label outside code, data and machine output; the
   impeccable detector; screenshots at 1440 and 390 of the six affected
   templates inspected; astro build and vitest pass. PR; merge only on Steve's
   go-ahead.
