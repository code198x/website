# Setup documentation review

Verdict: preserve the incumbent system. The Setup journey extends the approved
paper manual identity and does not establish a new visual world or require new
family tokens. This review changes no design authority, product record or
surface brief.

Reviewed on 7 October 2026 by an independent documenter using Impeccable's
`reference/degraded/documenter.md` role and `reference/document.md` operating
specification. The harness has no named documenter agent type; this independent
agent applied the supplied role instructions. The ordinary-extension instruction
governs: record the evidence and preserve the existing system.

## Authority and evidence

The comparison uses umbrella `PRINCIPLES.md`, `PRODUCT.md`, `DESIGN.md`,
`.impeccable/design.json`, `.impeccable/surfaces/code-setup.md`, and the binding
`decisions/family-visual-identity.md` and
`decisions/code198x-dev-tooling-migration.md`, including their drift triggers.
The accepted direction and bounded implementation scope are in this folder's
[plan](README.md).

Source inspection covered:

- `src/layouts/SetupLayout.astro`, `GettingStartedLayout.astro`, the relevant
  outer `Layout.astro` token and masthead behaviour, `src/styles/setup.css`,
  `src/styles/site-tokens.css` and the pinned `_198x-ui/tokens.css`.
- `src/components/SetupBrowserStarts.astro`, `SetupToolInstall.astro`,
  `TableOfContents.astro` and `src/scripts/setup-tabs.ts`.
- The Setup index and ROM guide, all four alternative-guide wrappers and
  return sections, the four main curriculum getting-started guides, and the
  AMOS/Blitz heading changes.
- The development-only `/catalogue/setup/` route and `tests/setup.spec.ts`.

Visual sampling used the refreshed
`.impeccable/review/setup/desktop_setup_.png`,
`desktop_setup_commodore-64_native_.png`, `mobile-install.png`,
`preview-desktop.png` and `preview-mobile.png` captures.
These show the browser-first index, a full alternative guide and the C64 guide
with Windows installation open. The refreshed preview captures show restored
title hierarchy, spacing, command padding and square OS controls at both widths.
They are review evidence, not shipping raster
assets. No new shipping raster asset was introduced by this work.

## System retained

1. **Palette:** the family paper, lighter ground, strong/body ink and fine rules
   remain intact. Links use the derived page spot ink; machine pages obtain
   their colour through the existing platform lookup.
2. **Type:** Nebula Sans carries manual text and headings; JetBrains Mono carries
   commands. The source binds the family h1, h2, body, lead and small steps
   directly. Narrow layouts step headings down within that same scale.
3. **The One Spot Ink Rule:** Setup uses Code ink, while machine guides use the
   machine context. This change declares no new colour values or machine inks.
4. **The Magazine Container Rule:** the shared Setup wrapper passes
   `masthead={false}`. The sampled index and alternative guide begin with a
   plain manual title, without the former italic Setup strip.
5. **The Object and Interface Rule:** controls are square and flat; the selected
   OS uses inverse video. Reading text remains bounded at 65ch, with responsive
   contents and installation disclosure rather than a compulsory wizard.

## Journey and finish alignment

The index links directly to the integrated Spectrum BASIC, Spectrum assembly
and NES assembly lessons. Its copy distinguishes editing/building from playback
of supplied programs. The primary guides retain that distinction for C64 and
Amiga, introduce local tools according to the chosen language, and describe
running, changing and saving the example. Asm198x owns the assembly path;
Build198x owns saved Spectrum/C64 BASIC tokenisation and Amiga disk preparation.
AMOS and Blitz remain separate language routes. Docker is absent from the
proposed learner path.

The four findings in [the first finish review](finish-review.md) have source
changes addressing them:

| Finding | Evidence checked |
| --- | --- |
| Magazine strip on manual pages | `SetupLayout` explicitly suppresses it; the sampled refreshed index and alternative capture confirm the plain opening. |
| Preview missing the production token context | `setup.css` now uses family `--h-*` properties directly; the catalogue imports the same stylesheet, tokens and fonts. The refreshed desktop/mobile previews show the restored component hierarchy, spacing and controls. |
| Contents included hidden OS steps | Setup supplies `h2, h3:not(.tab-panel h3)` to the existing contents component; the refreshed C64 alternative contents contains only visible guide-level destinations. |
| Concatenated return and ROM links | The return section uses a wrapping flex layout with gaps, and inline ROM-link whitespace is explicit. The refreshed C64 alternative capture shows both separations. |

The contents initialiser now selects `.toc[data-selector]`, avoiding unrelated
lesson markup that shares the `.toc` class. The source retains navigation-safe,
idempotent OS initialisation, associated tabs/panels, arrow/Home/End handling,
and readable OS instructions before JavaScript enhancement. These are observed
implementation choices, not new family-wide design rules.

## Existing drift preserved

`DESIGN.md` already records the older shared-kit dark-first declaration, the
missing hero type step in the paper tokens, the legacy plate observations, and
the extracted SiteNav specimen's current-state mismatch. The sidecar explicitly
labels that navigation styling as observed drift. None is a reason to change
Setup's approved manual treatment, and this pass does not repair or legitimise
those wider implementation gaps. The hero step is not needed by this surface.

The incumbent design record and sidecar also contain an Eyebrow specimen. This
pass adds no eyebrow and does not promote that specimen into a requirement for
Setup. No task-specific spacing, breakpoint, heading choice or installation
component is being canonised as a family default.

## Verification limits

This is a source-and-capture documentation check, not an independent browser,
build or installation certification. The plan records the implementation
agent's earlier command and browser results; those results are attributed to
that work, not rerun here.

At this review, the final production build and suite were still pending.
`/tmp/198x-setup-final.txt` recorded 13 passes and a failed mobile NES
OS-instructions case at navigation, with the exact error
`Error: page.goto: net::ERR_ABORTED at http://localhost:4400/setup/`.
That development run also logged the contents initialisation error addressed
by the selector change above. This document does not claim a green final suite.
The implementation
agent must record the completed rerun and the finish reviewer must supply the
final disposition. The first finish review remains historical evidence of its
findings until that re-review is appended.

Native Windows/Linux installation and launching every third-party emulator
remain unexecuted boundaries in the plan. Retained alternative commands are
not newly certified by this visual handoff. The existing family design records
remain unchanged because no new durable system decision was required.

## Completed handoff

The finish reviewer has since scored all four requested corrections resolved in
`finish-verdict.md`. Production captures and component previews are refreshed.
The completed build, browser checks and execution boundaries are recorded in
README.md; this remains a documentation comparison, not a claim that this agent
ran those checks.
