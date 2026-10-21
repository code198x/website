# One opening band for illustrated pages

**Date:** 2026-10-19
**Decision:** umbrella `decisions/family-visual-identity.md` §7, "A full-bleed opening is a fixed band" (`46c4b12e`), approved by Steve from mock-ups on live pages.
**Stacked on:** #839 (the breadcrumb section bar). First piece of the CSS consolidation.

## Why

Ten opening components (About, Start Here, Curriculum Map, From the Metal, Setup, For Teachers, The 198x Family and its four product pages, Field Notes, The Vault, The Demoscene) each carry their own copy of the same sizing rules, and each takes its height from the page width: 461 to 653 px at 1280, 674 to 874 at 1920, up to 861 on a phone.

## The component: `src/components/OpeningBand.astro`

- **Band:** 416 px tall from 601 px up. `stacked` moves the heading above the art from 1000 px down, because tablet crops put it over the busy part of the art; the art is then 416 px, and 240 px on a phone. On a phone (600 px and below) `overlay` is a 320 px band and `tall` a 400 px band.
- **Art:** `object-fit: cover` about a focal point (`focal`, default centre), with optional portrait art for phones (`phoneArt`, used at 700 px and below as today).
- **Layer:** the default slot is a layer over the whole band, a size container, so the caller sizes and places its heading and overlays in `cqh` and `cqw` units and keeps its own heading styling.
- **Below:** a `below` slot for content under the band inside the page frame (Field Notes' introduction, the Vault's tools).
- Labels by `aria-labelledby` as a `section`; without a heading (the Demoscene banner, whose page heading follows it) it is a plain `div`. Art stays decorative (`alt=""`).

Captions lose "Original AI-generated illustration", under `decisions/publishing-third-party-imagery.md` ("Generated illustration", `e070d48c`); what each shows stays.

## Steps

1. Build `OpeningBand`, with `stacked`, `overlay` and `tall` phone modes.
2. Move the six stacked openings onto it (Teaching, Curriculum, From the Metal, Setup, About, Start Here), then Family and its product pages, then Field Notes and the Vault (`tall`, portrait art), then the Demoscene banner (`overlay`, title and dancer in `cqh`).
3. `site-frame.css`: the breadcrumb's full-bleed test becomes one class, `.opening-band`, instead of eleven.
4. **Verify:** screenshot every illustrated page at 390, 1280 and 1920 px before and after; band heights measured; headings inside the band at every width; no horizontal scroll; build, tests and content checks.

## Not in scope

The game studies' `ArticleOpening` (the studies work) and the Systems photo composition (`systems-opening`), which is a layout of photographs rather than one image.
