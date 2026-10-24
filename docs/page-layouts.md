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

`PageFrame` is a `Center` (below) capped at the site frame width with the
page gutter; its own rules add only the opening and ending space.

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
default. It does this at 1440px, Pixel 7 and 320px on the routes in
`scripts/css-routes.json`. `css:diff` lists every property that moved and exits
non-zero if any did. Hover and focus states are not recorded.

Custom properties are recorded too, so a change that deletes or introduces
one shows it on every element it reaches. Name those with
`--removed <names>` or `--added <names>` (comma-separated): only their
disappearing or appearing is then ignored, and every real property they feed
is still compared.

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

Every site rule sits in a cascade layer. `src/components/LayerOrder.astro`
declares the order, and must be the first style in `<head>` (Layout renders it,
and so must any document that skips Layout, such as the catalogue): `kit,
base, composition, utilities, blocks, exceptions`, lowest first. A
later layer wins regardless of specificity. `tests/css-layers.spec.ts` checks
that the statement reaches the built page before any stylesheet.

- `base` holds element defaults, `html`, `body` and the `:root` tokens.
  `composition` holds the layout primitives and the page frame
  (the global rules in `Layout.astro`): the gutter, width and first-block spacing of every
  child of `<main>`. `blocks` holds each component's own look, and
  `exceptions` its variations, keyed on data attributes.
- A block does not set the frame. Its rules outrank composition, so a page
  wrapper that sets its own width, side padding or top padding overrides the
  shared frame; set only what the frame leaves alone, such as bottom padding.
- Wrap new CSS in a layer. CSS outside every layer beats every layer, so an
  unwrapped rule silently outranks the whole site.
- The exception is a rule that overrides a 198x-ui component, either through
  its `h-` classes or a class passed to it (`<Shell class="nx">`). The kit's
  component styles are unlayered, so these overrides stay unlayered too, after
  the layer block, under a comment that says why.
- The kit's tokens and fonts come in through `src/styles/kit.css`, in the
  `kit` layer.

## Layout primitives

`src/components/layout/` holds ten primitives after
[Every Layout](https://every-layout.dev). Compose a page from them instead of
writing `display`, `gap`, `max-width` or a breakpoint for layout. Each renders
one element with an `l-` class from `src/styles/composition.css` and takes
`as` for the element, plus `class` and any attribute.

| Primitive | Use it for | Main props |
|---|---|---|
| `Stack` | Vertical rhythm between siblings | `space` |
| `Box` | Padding, optionally a hairline, around content | `padding`, `border` |
| `Center` | A capped, centred measure | `max` (`measure`, `frame` or a length), `gutters`, `intrinsic` |
| `Cluster` | Wrapping rows of tags, buttons or links | `space`, `justify`, `align` |
| `Sidebar` | Two panes that stack when the main one gets too narrow | `side`, `sideWidth`, `contentMin`, `space`, `noStretch` |
| `Switcher` | Equal items in a row that become a column all at once | `threshold`, `space`, `limit` |
| `Grid` | As many columns of a minimum width as fit | `min`, `space` |
| `Cover` | A minimum height with one child (`data-cover-centre`) centred | `min`, `padding`, `space` |
| `Reel` | A row that scrolls sideways | `itemWidth`, `space` |
| `Frame` | An illustration cropped to an aspect ratio | `ratio` |

- Spacing props take a step of the kit's scale: `space={6}` is
  `var(--h-space-6)`. Props and lengths are typed, and `npm run check:types`
  (part of `npm run check` and the release checks) fails on a wrong value.
  It runs `astro check` against `scripts/type-baseline.json`, the type errors
  that predate it; that list may only shrink.
- A block's own rules come later in the cascade than `composition`, so a
  block can override a primitive. Style what is inside a primitive; leave its
  spacing and sizing to the primitive's props.
- `Frame` refuses a capture at build time. Captures are never cropped to fill
  a box (`decisions/family-visual-identity.md`); use `Figure` or
  `NativeImage`.
- `Sidebar`, `Switcher` and `Reel` pass their settings to their children by
  inheritance, so one that is a direct child of another of the same kind
  would be sized by the inner one's settings. Each fails the build when that
  happens (`src/components/layout/nesting.ts`); wrap the inner one in an
  element.

Preview them at `/catalogue/layout/` on the development server.
`tests/layout-primitives.spec.ts` measures that page at 320, 768 and 1440px.
