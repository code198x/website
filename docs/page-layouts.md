# Shared page frames

Use `src/components/PageFrame.astro` for the outer frame of a new page. It owns
the centred content width, responsive gutters and opening/ending space. Keep
the page's reading columns, section spacing and editorial composition inside it.

```astro
---
import Layout from '../layouts/Layout.astro';
import PageFrame from '../components/PageFrame.astro';
---
<Layout title="Page title" mastheadFrame="content">
  <PageFrame as="article">
    <h1>Page title</h1>
    <!-- Page content -->
  </PageFrame>
</Layout>
```

The default provides a 1264px maximum outer width, the shared responsive gutter,
40px opening space and 64px ending space. Use `opening="none"` when the page's
own masthead supplies its opening space; `ending="large"` supplies 96px.
`width="full"` is an explicit full-width variant. Document why a page needs it.
Do not override the frame's width, margin or padding through global page classes.

The shared page-title band in `Layout.astro` also uses this frame. It opts into
`inset="none" opening="none" ending="none"` because `PageMasthead` supplies its
own label padding. This aligns both the band edges and its label with the page
without doubling the gutter. Set `mastheadFrame="content"` on `Layout` when its
page uses the bounded frame. Legacy full-width compositions retain their band
width until deliberately migrated. Include the band when comparing alignment.

The component forwards HTML attributes, including Astro's scope attributes, so
page-specific styles continue to match. Preserve this when changing its markup.

Systems (including its alternate directory views), Foundations and About use
the component. Existing page families retain their own compositions; migrate
them deliberately with a before/after comparison rather than changing their
geometry through a broad selector.

Preview the actual component at `/catalogue/page-frame/` on the development
server. It includes reading, directory and full-width examples. The route is
development-only, like the rest of the component catalogue.

Run `npx playwright test tests/page-frame.spec.ts` for frame alignment, opening
and ending space, retained heading style, overflow and client navigation checks
at narrow, desktop and wide widths in both themes. Also inspect the production
build: stylesheet ordering can differ from development. Compare screenshots
of the affected pages and the homepage, a lesson and a Vault article before
publishing shared CSS changes.
