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

## Checking that a CSS change changes nothing

For a change that should not alter any page, such as moving rules between
files or layers, compare computed styles before and after:

```sh
npm run build && npm run css:snapshot -- /tmp/css-before
# make the change
npm run build && npm run css:snapshot -- /tmp/css-after
npm run css:diff -- /tmp/css-before /tmp/css-after
```

`css:snapshot` serves the build and records, for every element and its
`::before` and `::after`, each computed property that differs from the browser
default. It does this at desktop and Pixel 7 sizes on the routes in
`scripts/css-routes.json`. `css:diff` lists every property that moved and exits
non-zero if any did. Hover and focus states are not recorded.

`npm run css:routes` regenerates the route list from the build: the fewest pages
that between them render every scoped component and use every class the global
stylesheets name. Re-run it after adding a component. Entries with `steps` open
states a page load does not show, such as the mobile menu; edit those by hand.

`npm run css:coverage -- <out-dir>` loads every built page at 1440, 768 and
Pixel 7 widths with Chromium's CSS coverage on, and reports the rules that
never matched anything (`<out-dir>/coverage.json`). Rules for hover, focus, open
disclosures and classes added by scripts are reported too, so search `src/`
before deleting one.

## Cascade layers

Every site rule sits in a cascade layer. `Layout.astro` declares the order in
its first inline style: `kit, base, composition, utilities, blocks,
exceptions, legacy`, lowest first. A later layer wins regardless of
specificity. `tests/css-layers.spec.ts` checks that the statement reaches the
built page before any stylesheet.

- Wrap new CSS in a layer, normally `@layer legacy { … }` until
  `docs/plans/2026-10-20-css-cascade-layers.md` introduces the others. CSS
  outside every layer beats every layer, so an unwrapped rule silently
  outranks the whole site.
- The exception is a rule that overrides a 198x-ui component, either through
  its `h-` classes or a class passed to it (`<Shell class="nx">`). The kit's
  component styles are unlayered, so these overrides stay unlayered too, after
  the layer block, under a comment that says why.
- The kit's tokens and fonts come in through `src/styles/kit.css`, in the
  `kit` layer.
