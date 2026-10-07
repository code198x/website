# Align breadcrumbs with the page frame

The live Timeline breadcrumb content uses the full viewport while the page uses
its centred 1264px frame. `site-frame.css` sets `.breadcrumbs-inner` to
`max-width:none`, competing with the intended bound in `design-rollout.css`.

1. Make `src/styles/site-frame.css` own the breadcrumb's centred frame; remove
   the competing breadcrumb selector from `src/styles/design-rollout.css`.
   Preserve the full-width bar background, footer and other page layouts.
2. Build and measure the breadcrumb/page edges at 390, 768, 1440 and 1920px;
   inspect desktop/mobile and check a wrapping lesson trail and its player action.
3. Commit and publish the small fix, then confirm alignment on the live origin.

## Verification

The geometry assertion first failed against production: at 1440px the breadcrumb
started at 28.796875px and Timeline at 116.796875px. Against the corrected build,
both start at 116.796875px (1440), 360px (1920), and 16px (768 and 390). No
horizontal overflow. Desktop/mobile captures were inspected. The production
build, six Timeline navigation cases and four lesson breadcrumb/player-close
cases pass. Manual detector returned no findings.
