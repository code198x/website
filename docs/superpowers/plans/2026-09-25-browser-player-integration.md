# Browser-Player Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the shared Emu198x browser player on system pages as a poster that becomes the player, and on lessons as a run strip that opens one docked or overlaid panel.

**Architecture:** Pure layout and data rules live in small tested modules in `src/lib/`. Astro components render them at build time: `PixelFrame`, `PlayerStage`, `RunIt`, `RunPanel`. Two small client scripts handle the only runtime behaviour: swapping a poster for the player, and opening, closing and replacing the panel. The player itself (`public/emulators/`, built from emu198x) is not changed.

**Tech Stack:** Astro 7, TypeScript, Vitest (unit tests under `src/**/*.test.ts`), Playwright (`tests/*.spec.ts`), `js-yaml` (already a dependency), Node 24.

**Spec:** `docs/superpowers/specs/2026-09-25-browser-player-integration-design.md`. Read it before starting. This plan argues from it.

## Global Constraints

- Captures render at integer scale only, with `image-rendering: pixelated`; nothing is drawn over a capture.
- Machine colour (`color:` in `src/content/systems/*.yaml`, contrast-adjusted through `src/lib/contrast.ts`) is the only colour attached to objects; project rust never is.
- Faces: Nebula Sans for interface, Literata for prose and all captions (italic), JetBrains Mono for machine facts. No fourth face.
- One motion rule, and none under `prefers-reduced-motion: reduce`.
- Firmware and media never leave the reader's machine; no ROM paths or bytes enter the repository.
- A lesson shows a run strip only when the lesson build staged a runnable file.
- British English in all copy, except "program".
- The website repository is PR-only. Commit on `feat/browser-player-integration`, open one draft PR at the end, never merge it yourself.
- Run everything from the worktree `Code198x/website-bpi`. Never edit the `Code198x/website` checkout.
- `npm run build` runs `vitest run` first. `src/lib/themed-highlight.test.ts` "highlights every line when the clock runs out mid-line" fails on this machine and on unchanged `main`, but passes in CI. Treat that one failure as known. Report it, don't fix it.

## Facts established while planning (not in the spec)

- **The player element's API** (`public/emulators/embed.js`) has attributes `system`, `variant`, `src` and `example-title`, read once on connect. Its methods are `pause()` and `loadMedia(program)`, and it has **no public `resume()`**. So closing the panel calls `pause()`, and the reader resumes with the player's own Resume button. The player already pauses itself on window blur and on a hidden tab. To replace a program, create a new element; don't change `src`.
- **The Amiga's frame is 768 × 576** (catalogue display and `public/images/commodore-amiga/assembly/meet-the-machine/unit-02/screenshot.png`), not the 640 the spec quotes. The measured rule is unchanged, so an Amiga panel overlays at 1440px and docks from a viewport of about 1,560px. Record this in the spec (Task 9).
- **Spectrum lessons:** only `sinclair-zx-spectrum/assembly/meet-the-machine/unit-01` has a staged program, and it already uses the permissioned-ROM `<Emulator>` component. That page gets `inlinePlayer: true` so no second, firmware-hungry strip appears (Task 7).
- **Verification lessons:** `/systems/commodore-64/assembly/starfield/unit-03/` (narrow machine; fallback strip at the end; docks at 1440) and `/systems/commodore-amiga/assembly/meet-the-machine/unit-02/` (wide machine; strip placed explicitly after "Assemble, master, and run"; overlays at 1440).
- **The spec row** shows only facts the system data files hold: Released (`year`), CPU (`cpu`) and Model (the catalogue variant name). The spec's extra memory, display and sound facts for the four curriculum machines have no data source yet. Adding them means sourced figures (the Vault entries' cited "Fast facts"), which is a follow-up, not this plan.
- **Catalogue family ids differ from site slugs** (`commodore-c64` against `commodore-64`, `nintendo-nes` against `nintendo-entertainment-system`). Always resolve an entry as `catalog.find(e => e.id === slug || e.aliases.includes(slug))`, as `BrowserPlayer.astro` does today, and key posters by `entry.id`.

## Review Focus

1. **A system with no catalogue entry** (most of the 156 directory machines) must render its page exactly as today, with no stage and no empty frame. Pinned in Task 4.
2. **A family with no poster file yet** must show the empty frame at the machine's aspect ratio, never a broken image. Pinned in Task 3 (`posterFor` returns `null` for a missing file) and Task 4.
3. **Two strips on one page:** a second **Run it here** must replace the running program, not stack a second player. Pinned in Task 8's Playwright test.
4. **Keyboard users:** Esc must close the panel only when the emulator doesn't have focus (Esc is a machine key), and focus must return to the button that opened it. Pinned in Task 8.
5. **No JavaScript:** the poster and the strip's download links must still work, and Play and Run must be absent rather than dead. Buttons render `hidden` and the script unhides them. Pinned in Task 4 and Task 7.

---

## File structure

| File | Responsibility |
|---|---|
| `src/lib/pixel-frame.ts` | PNG size from bytes; integer scale choice. Pure. |
| `src/lib/player-layout.ts` | Strip arrangement (beside or above); panel mode (docked, overlay or fullscreen). Pure. |
| `src/lib/lesson-artefacts.ts` | Lesson context from a URL path; staged runnable files in a folder. |
| `src/lib/player-posters.ts` | Poster lookup and caption derivation from `src/data/player-posters.yaml`. |
| `src/data/player-posters.yaml` | One entry per catalogue family: kind, file, capture variant and frame, caption override. |
| `scripts/capture-posters.mjs` | Captures boot and demo posters through the site's built worker. |
| `src/components/PixelFrame.astro` | Renders one capture at integer scale via container queries, with an optional rule and caption. |
| `src/components/PlayerStage.astro` | The system-page stage and its Play swap script. |
| `src/components/RunIt.astro` | The lesson run strip. |
| `src/components/RunPanel.astro` | The lesson panel custom element. |
| `src/layouts/UnitLayout.astro` | Hosts the panel; docked layout; fallback strip. |
| `src/components/SystemOverview.astro`, `src/pages/systems/[platform].astro` | Use `PlayerStage`. |
| `src/lib/runit-placement.test.ts` | Enforces the `runItPlaced` frontmatter flag. |
| `tests/player-integration.spec.ts` | Playwright behaviour tests. |

---

### Task 1: Pixel and layout rules

**Files:**
- Create: `src/lib/pixel-frame.ts`, `src/lib/player-layout.ts`
- Test: `src/lib/pixel-frame.test.ts`, `src/lib/player-layout.test.ts`

**Interfaces:**
- Produces:
  - `pngSize(bytes: Uint8Array): { width: number; height: number }`
  - `integerScale(nativeWidth: number, containerWidth: number, ceiling: number): number`
  - `STRIP_BESIDE_MAX = 416`
  - `stripLayout(captureWidth: number): 'beside' | 'above'`
  - `MIN_PROSE = 600`, `FULLSCREEN_BELOW = 768`
  - `panelMode(o: { viewportWidth: number; containerWidth: number; panelWidth: number; gap: number }): 'docked' | 'overlay' | 'fullscreen'`

- [ ] **Step 1: Write the failing tests**

`src/lib/pixel-frame.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { integerScale, pngSize } from './pixel-frame';

function pngHeader(width: number, height: number): Uint8Array {
  const b = new Uint8Array(24);
  b.set([137, 80, 78, 71, 13, 10, 26, 10], 0);
  new DataView(b.buffer).setUint32(16, width);
  new DataView(b.buffer).setUint32(20, height);
  return b;
}

describe('pngSize', () => {
  it('reads width and height from the IHDR chunk', () => {
    expect(pngSize(pngHeader(352, 296))).toEqual({ width: 352, height: 296 });
  });
  it('rejects bytes that are not a PNG', () => {
    expect(() => pngSize(new Uint8Array(24))).toThrow(/not a PNG/);
  });
});

describe('integerScale', () => {
  it('takes the largest whole multiple that fits, up to the ceiling', () => {
    expect(integerScale(352, 800, 2)).toBe(2);
    expect(integerScale(352, 703, 2)).toBe(1);
    expect(integerScale(352, 2000, 2)).toBe(2);
  });
  it('never goes below 1, even when the frame is wider than its container', () => {
    expect(integerScale(768, 390, 2)).toBe(1);
  });
});
```

`src/lib/player-layout.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { panelMode, stripLayout } from './player-layout';

describe('stripLayout', () => {
  it('puts captures up to 416px beside the text', () => {
    expect(stripLayout(352)).toBe('beside');
    expect(stripLayout(416)).toBe('beside');
  });
  it('puts wider captures above the text', () => {
    expect(stripLayout(417)).toBe('above');
    expect(stripLayout(768)).toBe('above');
  });
});

describe('panelMode', () => {
  const gap = 40;
  it('goes fullscreen below 768px', () => {
    expect(panelMode({ viewportWidth: 767, containerWidth: 735, panelWidth: 352, gap })).toBe('fullscreen');
  });
  it('docks when at least 600px of prose remains', () => {
    // 1440 viewport, 32px gutters: 1376 - 416 - 40 = 920
    expect(panelMode({ viewportWidth: 1440, containerWidth: 1376, panelWidth: 416, gap })).toBe('docked');
  });
  it('overlays when docking would squeeze the prose', () => {
    // Amiga at 1440: 1376 - 768 - 40 = 568
    expect(panelMode({ viewportWidth: 1440, containerWidth: 1376, panelWidth: 768, gap })).toBe('overlay');
  });
  it('docks an Amiga on a wide screen', () => {
    expect(panelMode({ viewportWidth: 1600, containerWidth: 1440, panelWidth: 768, gap })).toBe('docked');
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/lib/pixel-frame.test.ts src/lib/player-layout.test.ts`
Expected: FAIL, because the modules don't exist yet.

- [ ] **Step 3: Implement**

`src/lib/pixel-frame.ts`:
```ts
/**
 * Captures are evidence: they render at a whole multiple of their native
 * pixels, never a fraction. These rules are shared by PixelFrame (CSS
 * container queries) and the lesson panel (measured at runtime).
 */
const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

export function pngSize(bytes: Uint8Array): { width: number; height: number } {
  if (bytes.length < 24 || SIGNATURE.some((b, i) => bytes[i] !== b)) {
    throw new Error('not a PNG');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

export function integerScale(nativeWidth: number, containerWidth: number, ceiling: number): number {
  return Math.max(1, Math.min(ceiling, Math.floor(containerWidth / nativeWidth)));
}
```

`src/lib/player-layout.ts`:
```ts
/**
 * Where the lesson run strip puts its capture, and whether the run panel
 * docks beside the prose. One measured rule for every machine, so a wide
 * frame (Amiga 768px) behaves correctly without a per-machine table.
 */
export const STRIP_BESIDE_MAX = 416;
export const MIN_PROSE = 600;
export const FULLSCREEN_BELOW = 768;

export function stripLayout(captureWidth: number): 'beside' | 'above' {
  return captureWidth <= STRIP_BESIDE_MAX ? 'beside' : 'above';
}

export function panelMode(o: {
  viewportWidth: number;
  containerWidth: number;
  panelWidth: number;
  gap: number;
}): 'docked' | 'overlay' | 'fullscreen' {
  if (o.viewportWidth < FULLSCREEN_BELOW) return 'fullscreen';
  return o.containerWidth - o.panelWidth - o.gap >= MIN_PROSE ? 'docked' : 'overlay';
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run src/lib/pixel-frame.test.ts src/lib/player-layout.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/pixel-frame.ts src/lib/pixel-frame.test.ts src/lib/player-layout.ts src/lib/player-layout.test.ts
git commit -m "Add the integer-scale and panel-docking rules the players will share"
```

---

### Task 2: PixelFrame

**Files:**
- Create: `src/components/PixelFrame.astro`

**Interfaces:**
- Consumes: `pngSize`, `integerScale` from Task 1.
- Produces: `<PixelFrame src="/images/…png" alt="…" ceiling={2} rule="#cc0000" caption="…" />`. `src` is a public path. `rule` is a machine colour, already contrast-adjusted by the caller, or omitted. The component sets `data-native-width` and `data-native-height` on its wrapper so scripts can read the native size.

- [ ] **Step 1: Implement**

```astro
---
/**
 * One capture at the largest whole multiple of its native size that fits its
 * container, up to `ceiling`. Pure CSS: a container query per scale step, so
 * no script decides the size and nothing is ever drawn at a fraction.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pngSize } from '../lib/pixel-frame';

interface Props { src: string; alt: string; ceiling?: number; rule?: string; caption?: string }
const { src, alt, ceiling = 2, rule, caption } = Astro.props;
const { width, height } = pngSize(new Uint8Array(fs.readFileSync(path.join('public', src))));
const id = `pf-${Math.abs([...src].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261))}`;
const steps = Array.from({ length: Math.max(0, ceiling - 1) }, (_, i) => i + 2);
const css = steps.map(s =>
  `@container ${id} (min-width: ${width * s}px) { [data-pf="${id}"] img { width: ${width * s}px; height: ${height * s}px; } }`,
).join('\n');
---
<figure class="pixel-frame" style={rule ? `--pf-rule: ${rule}` : undefined}>
  <div class="pf-well" data-pf={id} data-native-width={width} data-native-height={height} style={`container-name: ${id}`}>
    <img src={src} alt={alt} width={width} height={height} decoding="async" />
  </div>
  {caption && <figcaption>{caption}</figcaption>}
</figure>
<style is:inline set:html={css}></style>
<style>
  .pixel-frame { margin: 0; }
  .pixel-frame[style*='--pf-rule'] { border-top: 4px solid var(--pf-rule); padding-top: var(--space-5); }
  .pf-well { container-type: inline-size; overflow-x: auto; }
  .pf-well img { display: block; image-rendering: pixelated; max-width: none; }
  figcaption { font-family: var(--font-family-read); font-style: italic; color: var(--h-ink-muted); margin-top: var(--space-2); }
</style>
```

- [ ] **Step 2: Build a scratch page to check it**

Create `src/pages/_pixel-frame-check.astro` temporarily:
```astro
---
import Layout from '../layouts/Layout.astro';
import PixelFrame from '../components/PixelFrame.astro';
---
<Layout title="PixelFrame check" description="check">
  <div style="max-width: 800px"><PixelFrame src="/images/sinclair-zx-spectrum/assembly/meteor-storm/flight.png" alt="Meteor Storm" ceiling={2} rule="#cc0000" caption="Meteor Storm." /></div>
  <div style="max-width: 500px"><PixelFrame src="/images/sinclair-zx-spectrum/assembly/meteor-storm/flight.png" alt="Meteor Storm" ceiling={2} /></div>
</Layout>
```
Run: `npx astro dev`, then open `/_pixel-frame-check` and check with the browser's inspector: the first image is 704px wide, the second 352px.

- [ ] **Step 3: Delete the scratch page and commit**

```bash
rm src/pages/_pixel-frame-check.astro
git add src/components/PixelFrame.astro
git commit -m "Render captures at whole-pixel scales with PixelFrame"
```

---

### Task 3: Poster data, lookup and capture script

**Files:**
- Create: `src/data/player-posters.yaml`, `src/lib/player-posters.ts`, `scripts/capture-posters.mjs`
- Test: `src/lib/player-posters.test.ts`
- Create (output of Step 6): `public/images/systems/<family>/poster.png` for the boot and demo families

**Interfaces:**
- Produces:
  - `type PosterKind = 'game' | 'boot' | 'demo'`
  - `interface Poster { src: string; kind: PosterKind; caption: string; ceiling: number }`
  - `posterFor(familyId: string, machineName: string): Poster | null`, which returns `null` when the family has no entry or its file is missing.
  - `posterEntries(): Record<string, { kind: PosterKind; src?: string; variant?: string; frame?: number; caption?: string; ceiling?: number }>`

- [ ] **Step 1: Write the data file**

`src/data/player-posters.yaml`:
```yaml
# One poster per browser-player family, keyed by catalogue id
# (public/emulators/catalog.json). Spec: docs/superpowers/specs/
# 2026-09-25-browser-player-integration-design.md §4.3.
#
# kind: game — an existing lesson capture (src required, caption required)
#       boot — the machine switched on, captured by scripts/capture-posters.mjs
#       demo — the project-owned demo cartridge, captured the same way
# boot/demo posters live at /images/systems/<id>/poster.png. `frame` is the
# fixed frame to capture: never rank frames (an Aquarius title is black text,
# so "most non-black pixels" picks the blank frames before it).
sinclair-zx-spectrum: { kind: game, src: /images/sinclair-zx-spectrum/assembly/meteor-storm/flight.png, caption: "Meteor Storm, from the Z80 assembly track, on a 48K Spectrum." }
commodore-c64: { kind: game, src: /images/commodore-64/assembly/starfield/starfield-hero.png, caption: "Starfield, from the 6510 assembly track, on a PAL Commodore 64." }
nintendo-nes: { kind: game, src: /images/nintendo-entertainment-system/assembly/dash/unit-13/screenshot.png, caption: "Dash, from the 6502 assembly track, on an NTSC NES." }
commodore-amiga: { kind: game, src: /images/commodore-amiga/assembly/signal/unit-13/screenshot.png, ceiling: 1, caption: "Signal, from the 68000 assembly track, on an Amiga 500." }
acorn-atom: { kind: boot, frame: 300 }
acorn-bbc-micro: { kind: boot, frame: 300 }
acorn-electron: { kind: boot, frame: 300 }
amstrad-cpc: { kind: boot, frame: 300 }
atari-800xl: { kind: boot, frame: 1000 }
coleco-colecovision: { kind: boot, frame: 300 }
commodore-pet: { kind: boot, frame: 300 }
commodore-vic-20: { kind: boot, frame: 300 }
dragon: { kind: boot, frame: 300 }
jupiter-ace: { kind: boot, frame: 300 }
mattel-aquarius: { kind: boot, frame: 200 }
memotech-mtx: { kind: boot, frame: 300 }
msx: { kind: boot, frame: 300 }
oric-atmos: { kind: boot, frame: 300 }
sinclair-zx80: { kind: boot, frame: 300 }
sinclair-zx81: { kind: boot, frame: 300 }
spectravideo-svi-328: { kind: boot, frame: 300 }
tatung-einstein: { kind: boot, frame: 300 }
sord-m5: { kind: boot, frame: 300, caption: "The Sord M5 switched on with no cartridge: it shows nothing until one is inserted." }
atari-2600: { kind: demo, frame: 300 }
atari-5200: { kind: demo, frame: 300 }
atari-7800: { kind: demo, frame: 300 }
nintendo-game-boy: { kind: demo, frame: 300 }
sega-game-gear: { kind: demo, frame: 300 }
sega-master-system: { kind: demo, frame: 300 }
sega-sg-1000: { kind: demo, frame: 300 }
```

Before committing, confirm that each `kind: game` `src` exists. Check that `ls public/images/commodore-64/assembly/starfield/starfield-hero.png` and the other three succeed. If one is missing, choose another capture from the same module's image folder, view it, and use that.

- [ ] **Step 2: Write the failing test**

`src/lib/player-posters.test.ts`:
```ts
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { posterEntries, posterFor } from './player-posters';

const catalog: Array<{ id: string; name: string }> = existsSync('public/emulators/catalog.json')
  ? JSON.parse(readFileSync('public/emulators/catalog.json', 'utf8'))
  : [];

describe('player posters', () => {
  it.skipIf(catalog.length === 0)('has an entry for every browser-player family', () => {
    const missing = catalog.map(c => c.id).filter(id => !(id in posterEntries()));
    expect(missing).toEqual([]);
  });

  it('derives captions from the kind when none is given', () => {
    const entries = posterEntries();
    expect(entries['acorn-atom'].caption).toBeUndefined();
    const p = posterFor('acorn-atom', 'Acorn Atom');
    if (p) expect(p.caption).toBe('The Acorn Atom switched on, running its own firmware in our emulator.');
    const d = posterFor('sega-game-gear', 'Sega Game Gear');
    if (d) expect(d.caption).toBe('A test cartridge we wrote, running on the Sega Game Gear.');
  });

  it('returns null for an unknown family rather than a broken image', () => {
    expect(posterFor('not-a-machine', 'Nothing')).toBeNull();
  });

  it('uses the given caption for game posters', () => {
    expect(posterFor('sinclair-zx-spectrum', 'ZX Spectrum')?.caption).toMatch(/^Meteor Storm/);
  });
});
```

- [ ] **Step 3: Run it to see it fail**

Run: `npx vitest run src/lib/player-posters.test.ts`
Expected: FAIL, because `./player-posters` doesn't exist.

- [ ] **Step 4: Implement**

`src/lib/player-posters.ts`:
```ts
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

export type PosterKind = 'game' | 'boot' | 'demo';
export interface Poster { src: string; kind: PosterKind; caption: string; ceiling: number }
type Entry = { kind: PosterKind; src?: string; variant?: string; frame?: number; caption?: string; ceiling?: number };

let cache: Record<string, Entry> | undefined;
export function posterEntries(): Record<string, Entry> {
  cache ??= load(readFileSync('src/data/player-posters.yaml', 'utf8')) as Record<string, Entry>;
  return cache;
}

/** The poster for a family, or null when it has no entry or no file yet. */
export function posterFor(familyId: string, machineName: string): Poster | null {
  const entry = posterEntries()[familyId];
  if (!entry) return null;
  const src = entry.src ?? `/images/systems/${familyId}/poster.png`;
  if (!existsSync(path.join('public', src))) return null;
  const caption = entry.caption ?? (entry.kind === 'demo'
    ? `A test cartridge we wrote, running on the ${machineName}.`
    : `The ${machineName} switched on, running its own firmware in our emulator.`);
  return { src, kind: entry.kind, caption, ceiling: entry.ceiling ?? 2 };
}
```

- [ ] **Step 5: Run the test to see it pass**

Run: `npx vitest run src/lib/player-posters.test.ts`
Expected: PASS.

- [ ] **Step 6: Write the capture script and capture the posters**

`scripts/capture-posters.mjs`:
```js
#!/usr/bin/env node
// Capture the boot and demo posters in src/data/player-posters.yaml through the
// site's own built player worker, so a poster is exactly what the page's
// player shows. Firmware is read from POSTER_ROM_ROOT (a folder of
// <family>/<file> ROMs, e.g. ~/.emu198x/roms) and never written anywhere.
//
//   POSTER_ROM_ROOT=~/.emu198x/roms EMU198X_REPO=../../Emu198x/emu198x \
//     node scripts/capture-posters.mjs [family …]
import { Worker } from 'node:worker_threads';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import zlib from 'node:zlib';
import { load } from 'js-yaml';

const romRoot = process.env.POSTER_ROM_ROOT;
const repo = process.env.EMU198X_REPO;
if (!romRoot || !repo) { console.error('Set POSTER_ROM_ROOT and EMU198X_REPO.'); process.exit(1); }
const dist = path.resolve('public/emulators');
const only = process.argv.slice(2);
const entries = load(readFileSync('src/data/player-posters.yaml', 'utf8'));
const catalog = JSON.parse(readFileSync(path.join(dist, 'catalog.json'), 'utf8'));
const profiles = JSON.parse(execFileSync('cargo', ['run', '--quiet', '--release', '-p', 'emu198x-fleet-web', '--features', 'all-families', '--bin', 'fleet-catalogue'], { cwd: repo, encoding: 'utf8', maxBuffer: 8e6, env: { ...process.env, RUSTUP_TOOLCHAIN: undefined } }));
const { fixtures } = await import(pathToFileURL(path.join(repo, 'web-player/fixtures.mjs')).href);
const demoFiles = Object.fromEntries(catalog.filter(c => c.demo).map(c => [c.id, c.demo]));

function png(w, h, rgba) {
  const crc = b => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1; } return ~c >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4, o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = rgba[i]; raw[o + 1] = rgba[i + 1]; raw[o + 2] = rgba[i + 2]; }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

const bootstrap = `const {parentPort,workerData}=require('node:worker_threads');const {readFile}=require('node:fs/promises');
global.self=global;global.postMessage=(d,t)=>parentPort.postMessage(d,t);
global.fetch=async i=>new Response(await readFile(new URL(i)),{headers:{'Content-Type':'application/wasm'}});
import(workerData).then(()=>parentPort.on('message',data=>self.onmessage({data})));`;

for (const [family, entry] of Object.entries(entries)) {
  if (entry.kind === 'game' || (only.length && !only.includes(family))) continue;
  const c = catalog.find(x => x.id === family);
  const profile = profiles.find(p => p.family === c.family && p.id === (entry.variant ?? c.defaultVariant));
  const { cases, missing } = fixtures([profile], romRoot);
  if (missing.length) { console.log(`${family}: missing firmware, skipped`); continue; }
  const t = cases[0];
  const worker = new Worker(bootstrap, { eval: true, workerData: pathToFileURL(path.join(dist, 'worker.js')).href });
  let serial = 0; const pending = new Map();
  worker.on('message', ({ id, result, error }) => { const p = pending.get(id); if (!p) return; pending.delete(id); error ? p.reject(new Error(error)) : p.resolve(result); });
  const rpc = (command, ...args) => new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); worker.postMessage({ id, command, args }); });
  try {
    const roms = Object.fromEntries(Object.entries(t.firmware).filter(([, f]) => !f.includes('synthetic-firmware')).map(([k, f]) => [k, new Uint8Array(readFileSync(f))]));
    const media = entry.kind === 'demo'
      ? { slot: profile.slots.find(s => s.kind === 'Cartridge').id, bytes: new Uint8Array(readFileSync(path.join(dist, 'demos', demoFiles[family]))) }
      : null;
    await rpc('boot', 'fleet', roms, media, 48000, { family: t.family, id: t.id });
    let frame; for (let n = 0; n < entry.frame; n++) frame = await rpc('step');
    const out = path.join('public/images/systems', family);
    mkdirSync(out, { recursive: true });
    writeFileSync(path.join(out, 'poster.png'), png(frame.width, frame.height, frame.pixels));
    console.log(`${family}: ${frame.width}×${frame.height} at frame ${entry.frame}`);
  } catch (error) { console.log(`${family}: ${error.message}`); }
  finally { await worker.terminate(); }
}
```

Two checks before running it:
- Confirm that the catalogue exposes each demo file as `c.demo` for the eight demo families: `node -e "const c=require('./public/emulators/catalog.json');console.log(c.filter(x=>x.demo).map(x=>x.id+' '+JSON.stringify(x.demo)))"`. If the field has a different shape, adapt the `demoFiles` line to it. The file names in `public/emulators/demos/` are `atari-2600-logo.bin`, `atari-5200-logo.bin`, `atari-7800-logo.bin`, `nintendo-game-boy-logo.gb`, `nintendo-nes-logo.nes`, `game-gear.gg`, `master-system-raster.sms` and `sg-1000.sg`.
- Rebuild the player first, so it includes emu198x#1537 (the VIC-20 regional KERNALs): `npm run build:player`.

Then run:
```bash
POSTER_ROM_ROOT=~/.emu198x/roms EMU198X_REPO=../../Emu198x/emu198x node scripts/capture-posters.mjs
```
Expected: one line per family, 26 in all (18 boot and 8 demo), none reporting missing firmware.

- [ ] **Step 7: Look at every poster**

Open each `public/images/systems/*/poster.png` with the Read tool, or in an image viewer, one by one. Check that each is the machine's real start screen or its demo, not a blank frame:
- **Blank by design:** Sord M5 (no cartridge), Jupiter Ace (blank screen and cursor) and SG-1000 (white demo backdrop).
- **Must show text:** the Atari 800XL shows READY, the Aquarius shows "BASIC / Press RETURN key to start", and the VIC-20 shows the full `**** CBM BASIC V2 ****` with a border on all four sides.

If one is wrong, fix its `frame` in the YAML, re-run that family alone (`node scripts/capture-posters.mjs <family>`), and look again.

- [ ] **Step 8: Commit**

```bash
git add src/data/player-posters.yaml src/lib/player-posters.ts src/lib/player-posters.test.ts scripts/capture-posters.mjs public/images/systems
git commit -m "Capture a poster for every browser-player family through the site's own player"
```

---

### Task 4: PlayerStage on system pages

**Files:**
- Create: `src/components/PlayerStage.astro`
- Modify: `src/components/SystemOverview.astro` (replace the `BrowserPlayer` import and use; add a hero grid), `src/pages/systems/[platform].astro` (same)
- Delete: `src/components/BrowserPlayer.astro`, once nothing imports it

**Interfaces:**
- Consumes: `PixelFrame` (Task 2), `posterFor` (Task 3).
- Produces: `<PlayerStage system={slug} name={data.name} color={data.color} facts={[{ label, value }]} />`. It renders nothing when the catalogue has no entry for the slug.

- [ ] **Step 1: Implement the component**

```astro
---
/**
 * The system-page stage: our own capture as a poster, a spec row, and Play,
 * which swaps the poster for the live player at the same width. The player
 * script loads only on Play. Spec §4.
 */
import catalog from '../../public/emulators/catalog.json';
import PixelFrame from './PixelFrame.astro';
import { posterFor } from '../lib/player-posters';
import { whiteSafeFill } from '../lib/contrast';

interface Props { system: string; name: string; color: string; facts: Array<{ label: string; value: string | number }> }
const { system, name, color, facts } = Astro.props;
const entry = catalog.find(e => e.id === system || e.aliases.includes(system));
const poster = entry ? posterFor(entry.id, name) : null;
const variant = entry?.variantAliases?.[system] ?? entry?.defaultVariant;
const model = entry?.variants.find(v => v.id === variant)?.name;
const needsFirmware = entry?.variants.find(v => v.id === variant)?.firmware.some(f => !f.optional) ?? true;
const note = needsFirmware && !entry?.demo ? 'Needs your own ROM files · nothing is uploaded' : 'Runs a built-in demo · add your ROMs for the full machine';
const rule = whiteSafeFill(color);
---
{entry && <div class="stage" data-system={entry.id} data-variant={variant} style={`--stage-rule: ${rule}`}>
  <div class="stage-screen">
    {poster
      ? <PixelFrame src={poster.src} alt={`${name}: ${poster.caption}`} ceiling={poster.ceiling} rule={rule} />
      : <div class="stage-empty" role="img" aria-label={`${name}, not started`}></div>}
  </div>
  <dl class="stage-facts">
    {[...facts, ...(model ? [{ label: 'Model', value: model }] : [])].map(f => <div><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
  </dl>
  <div class="stage-bar">
    <button type="button" class="stage-play" hidden>▶ Play the {name}</button>
    <span class="stage-note">{note}</span>
  </div>
  {poster && <p class="stage-caption">{poster.caption}</p>}
  <p class="stage-desktop"><a href="https://emu198x.github.io/downloads/">Download Emu198x for desktop</a></p>
</div>}

<script>
  for (const stage of document.querySelectorAll<HTMLElement>('.stage')) {
    const play = stage.querySelector<HTMLButtonElement>('.stage-play')!;
    play.hidden = false;
    play.addEventListener('click', async () => {
      play.disabled = true;
      await import(/* @vite-ignore */ '/emulators/embed.js');
      const screen = stage.querySelector<HTMLElement>('.stage-screen')!;
      const well = screen.querySelector<HTMLElement>('.pf-well img');
      const width = well?.getBoundingClientRect().width;
      const player = document.createElement('emu198x-player');
      player.setAttribute('system', stage.dataset.system!);
      if (stage.dataset.variant) player.setAttribute('variant', stage.dataset.variant);
      if (width) player.style.maxWidth = `${width}px`;
      screen.replaceChildren(player);
      stage.querySelector('.stage-bar')!.remove();
      stage.querySelector('.stage-caption')?.remove();
      player.focus();
    });
  }
</script>

<style>
  .stage { font-family: var(--font-family-sans); }
  .stage-empty { aspect-ratio: 4 / 3; width: min(100%, 704px); background: var(--h-ground-base); border-top: 4px solid var(--stage-rule); }
  .stage-facts { display: flex; flex-wrap: wrap; margin: var(--space-4) 0 0; border-block: 1px solid var(--color-border); font-family: var(--font-family-mono); font-size: var(--h-text-small); color: var(--h-ink); }
  .stage-facts div { padding: var(--space-2) var(--space-3); border-left: 1px solid var(--color-border); }
  .stage-facts div:first-child { border-left: 0; padding-left: 0; }
  .stage-facts dt { font-size: var(--h-text-micro); text-transform: uppercase; letter-spacing: .06em; color: var(--h-ink-muted); }
  .stage-facts dd { margin: 2px 0 0; }
  .stage-bar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4); margin-top: var(--space-4); }
  .stage-play { font: 600 var(--h-text-body) var(--font-family-sans); background: var(--h-ink); color: var(--h-ground); border: 0; border-radius: 4px; padding: .7rem 1.3rem; min-height: 44px; cursor: pointer; }
  .stage-note { font-size: var(--h-text-small); color: var(--h-ink-muted); }
  .stage-caption { font-family: var(--font-family-read); font-style: italic; color: var(--h-ink-muted); margin: var(--space-2) 0 0; }
  .stage-desktop { font-size: var(--h-text-small); margin: var(--space-2) 0 0; }
  .stage-desktop a { display: inline-flex; align-items: center; min-height: 44px; }
</style>
```

Token names used here are the real ones: `--font-family-sans`, `--font-family-read`, `--font-family-mono`, `--h-text-small`, `--h-text-micro`, `--h-text-body`, `--h-text-lead`, `--space-*`, `--color-border`, `--h-ink`, `--h-ink-muted`, `--h-ground`, `--h-ground-base` and `--h-ease`. `whiteSafeFill` from `src/lib/contrast.ts` is the same machine-colour adjustment `UnitLayout.astro` uses. Before relying on it, check:
- **The catalogue fields** `variantAliases`, `defaultVariant`, `variants[].firmware[].optional` and `demo`: `node -e "const c=require('./public/emulators/catalog.json');console.log(Object.keys(c[0]), c[0].variants[0])"`.

- [ ] **Step 2: Use it on the four curriculum pages**

In `src/components/SystemOverview.astro`:
- Replace `import BrowserPlayer from './BrowserPlayer.astro';` with `import PlayerStage from './PlayerStage.astro';`.
- Replace the header and the `<BrowserPlayer system={slug} />` line with a hero grid:

```astro
    <div class="hero">
      <header>
        <p class="eyebrow">Systems · Lessons available</p>
        <h1>{system.data.name}</h1>
        <p class="lead">{introduction}</p>
        <p>{focus}</p>
      </header>
      <PlayerStage system={slug} name={system.data.shortName ?? system.data.name} color={system.data.color}
        facts={[{ label: 'Released', value: system.data.year }, { label: 'CPU', value: system.data.cpu }]} />
    </div>
```

Add to its `<style>`:
```css
  .hero { display: grid; gap: var(--space-8); align-items: start; margin-bottom: var(--space-10); }
  @media (min-width: 1024px) { .hero { grid-template-columns: minmax(20rem, 1fr) auto; } }
```

- [ ] **Step 3: Use it on the directory pages**

In `src/pages/systems/[platform].astro`:
- Replace the `BrowserPlayer` import with `import PlayerStage from '../../components/PlayerStage.astro';`.
- Replace the `<header>…</header>` and `<BrowserPlayer system={slug} />` with the same `.hero` grid, putting its own header in the left column and `<PlayerStage system={slug} name={data.shortName ?? data.name} color={data.color} facts={[{ label: 'Released', value: data.year }, { label: 'CPU', value: data.cpu }]} />` in the right.
- Add the same two CSS rules.

- [ ] **Step 4: Remove the old component**

Run: `ggrep -rn "BrowserPlayer" src`
Expected: no matches except the file itself. Then `git rm src/components/BrowserPlayer.astro`.

- [ ] **Step 5: Build and look**

Run: `npm run build` (or `npx astro build` if only the known `themed-highlight` test fails; report that).
Then `npx astro preview` and open, at 1440px and 390px in both themes:
- `/systems/sinclair-zx-spectrum/`: the poster sits beside the title at 2×, and "Choose a language" is visible without scrolling at 1440×900.
- `/systems/commodore-vic-20/`: the boot poster and the brown rule.
- `/systems/acorn-archimedes/`, or any system missing from `catalog.json`: the page is unchanged, with no stage. Find one with `node -e "const c=require('./public/emulators/catalog.json');const ids=new Set(c.flatMap(e=>[e.id,...e.aliases]));console.log(require('fs').readdirSync('src/content/systems').map(f=>f.replace('.yaml','')).filter(s=>!ids.has(s)).slice(0,3))"`.
- With JavaScript disabled, the Spectrum page shows the poster and no Play button.

- [ ] **Step 6: Commit**

```bash
git add src/components/PlayerStage.astro src/components/SystemOverview.astro "src/pages/systems/[platform].astro"
git commit -m "Open system pages on the machine's own screen, with Play in place of a firmware prompt"
```

---

### Task 5: Lesson context and staged files

**Files:**
- Create: `src/lib/lesson-artefacts.ts`
- Test: `src/lib/lesson-artefacts.test.ts`

**Interfaces:**
- Produces:
  - `lessonContext(pathname: string): { system: string; language: string; module: string; unit: number } | null`
  - `stagedLessonFiles(directory: string, formats: string[]): string[]`, which returns paths relative to `directory`. When there are no top-level files it falls back to the final file in `steps/`, which is the rule `LessonPlayer` uses today.

- [ ] **Step 1: Write the failing tests**

```ts
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { lessonContext, stagedLessonFiles } from './lesson-artefacts';

describe('lessonContext', () => {
  it('reads system, language, module and unit from a lesson URL', () => {
    expect(lessonContext('/systems/commodore-64/assembly/starfield/unit-03/'))
      .toEqual({ system: 'commodore-64', language: 'assembly', module: 'starfield', unit: 3 });
  });
  it('reads descriptive unit slugs', () => {
    expect(lessonContext('/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/')?.unit).toBe(1);
  });
  it('returns null outside a system lesson', () => {
    expect(lessonContext('/foundations/basics/unit-02/')).toBeNull();
  });
});

describe('stagedLessonFiles', () => {
  const dir = () => mkdtempSync(path.join(tmpdir(), 'lesson-'));
  it('lists runnable files in the unit folder, sorted', () => {
    const d = dir(); writeFileSync(path.join(d, 'b.prg'), ''); writeFileSync(path.join(d, 'a.prg'), ''); writeFileSync(path.join(d, 'a.asm'), '');
    expect(stagedLessonFiles(d, ['.prg'])).toEqual(['a.prg', 'b.prg']);
  });
  it('falls back to the last numbered step', () => {
    const d = dir(); mkdirSync(path.join(d, 'steps'));
    for (const n of ['step-2.prg', 'step-10.prg', 'step-9.prg']) writeFileSync(path.join(d, 'steps', n), '');
    expect(stagedLessonFiles(d, ['.prg'])).toEqual(['steps/step-10.prg']);
  });
  it('returns nothing for a missing folder', () => {
    expect(stagedLessonFiles('/no/such/folder', ['.prg'])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/lib/lesson-artefacts.test.ts`
Expected: FAIL, because the module doesn't exist.

- [ ] **Step 3: Implement**

```ts
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

/** Which lesson a URL belongs to: /systems/<system>/<language>/<module>/unit-NN… */
export function lessonContext(pathname: string) {
  const m = pathname.match(/^\/systems\/([^/]+)\/([^/]+)\/([^/]+)\/unit-(\d+)/);
  return m ? { system: m[1], language: m[2], module: m[3], unit: Number(m[4]) } : null;
}

/**
 * Runnable files the lesson build staged for a unit. A source listing or a
 * missing build must never masquerade as a runnable lesson. Cumulative-step
 * lessons publish their completed final step.
 */
export function stagedLessonFiles(directory: string, formats: string[]): string[] {
  if (!existsSync(directory)) return [];
  const runnable = (d: string) => readdirSync(d).filter(f => formats.includes(path.extname(f)) && statSync(path.join(d, f)).isFile());
  const top = runnable(directory).sort();
  if (top.length) return top;
  const steps = path.join(directory, 'steps');
  if (!existsSync(steps)) return [];
  const last = runnable(steps).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1);
  return last ? [`steps/${last}`] : [];
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run src/lib/lesson-artefacts.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/lesson-artefacts.ts src/lib/lesson-artefacts.test.ts
git commit -m "Find a lesson's staged programs from its URL, with tests"
```

---

### Task 6: RunIt, the lesson run strip

**Files:**
- Create: `src/components/RunIt.astro`

**Interfaces:**
- Consumes: `lessonContext`, `stagedLessonFiles` (Task 5); `stripLayout` (Task 1); `pngSize` (Task 1).
- Produces:
  - `<RunIt capture="/images/…png" watch="One sentence on what to watch." caption="What you should see: …" />`, with every prop optional. It renders nothing when no runnable file is staged.
  - Each button carries `data-run-src`, `data-run-title`, `data-run-system`, `data-run-variant`, `data-run-width` (the machine's native frame width, from the family poster or the capture) and `data-run-model`, and dispatches `runit:open` (Task 7 listens).

- [ ] **Step 1: Implement**

```astro
---
/**
 * The run strip: where a lesson builds its program, show what it should do
 * and offer to run it here. Opens the page's single RunPanel. Spec §5.1.
 */
import fs from 'node:fs';
import path from 'node:path';
import catalog from '../../public/emulators/catalog.json';
import { lessonContext, stagedLessonFiles } from '../lib/lesson-artefacts';
import { stripLayout } from '../lib/player-layout';
import { pngSize } from '../lib/pixel-frame';
import { posterFor } from '../lib/player-posters';
import { getPlatformBySlug } from '../lib/platforms';
import { whiteSafeFill } from '../lib/contrast';

interface Props { capture?: string; watch?: string; caption?: string }
const { capture, watch, caption } = Astro.props;
const context = lessonContext(Astro.url.pathname);
const entry = context && catalog.find(e => e.id === context.system || e.aliases.includes(context.system));
const relative = context && [context.system, context.language, context.module, `unit-${String(context.unit).padStart(2, '0')}`].join('/');
const formats = entry?.media.split(',').map(f => f.trim()) ?? [];
const files = entry && relative ? stagedLessonFiles(path.resolve('public/code-samples', relative), formats) : [];
const platform = context ? await getPlatformBySlug(context.system) : undefined;
const rule = platform ? whiteSafeFill(platform.data.color) : undefined;
const captureSize = capture ? pngSize(new Uint8Array(fs.readFileSync(path.join('public', capture)))) : undefined;
const poster = entry ? posterFor(entry.id, platform?.data.shortName ?? entry.name) : null;
const machineWidth = poster ? pngSize(new Uint8Array(fs.readFileSync(path.join('public', poster.src)))).width : captureSize?.width ?? 416;
const layout = stripLayout(captureSize?.width ?? 0);
const variant = entry?.defaultVariant;
const model = entry?.variants.find(v => v.id === variant)?.name ?? entry?.name;
const run = files.at(-1);
---
{entry && run && <section class={`runit runit--${capture ? layout : 'text'}`} style={rule ? `--runit-rule: ${rule}` : undefined} aria-label="Run this lesson's program">
  {capture && captureSize && <img class="runit-capture" src={capture} alt="What the program should show" width={captureSize.width} height={captureSize.height} />}
  <div class="runit-text">
    <h3>Run it here</h3>
    <p>{watch ?? "This unit's program, built for you."}</p>
    <dl class="runit-facts"><div><dt>Program</dt><dd>{path.basename(run)}</dd></div><div><dt>Machine</dt><dd>{model}</dd></div></dl>
    <button type="button" class="runit-button" hidden
      data-run-src={`/code-samples/${relative}/${run}`} data-run-title={path.basename(run)}
      data-run-system={entry.id} data-run-variant={variant} data-run-width={machineWidth} data-run-model={model}>▶ Run it here</button>
    <p class="runit-downloads">{files.map(f => <a href={`/code-samples/${relative}/${f}`} download={path.basename(f)}>Download {path.basename(f)}</a>)}</p>
  </div>
  {caption && <p class="runit-caption">{caption}</p>}
</section>}

<script>
  for (const button of document.querySelectorAll<HTMLButtonElement>('.runit-button')) {
    button.hidden = false;
    button.addEventListener('click', () => document.dispatchEvent(new CustomEvent('runit:open', { detail: { button } })));
  }
</script>

<style>
  .runit { border-top: 4px solid var(--runit-rule, var(--h-ink)); margin: var(--space-6) 0; padding-top: var(--space-4); display: grid; gap: var(--space-5); font-family: var(--font-family-sans); }
  .runit--beside { grid-template-columns: auto 1fr; align-items: start; }
  .runit-capture { display: block; image-rendering: pixelated; max-width: none; }
  .runit--above .runit-capture { overflow-x: auto; }
  .runit h3 { margin: 0 0 var(--space-1); font: 600 var(--h-text-lead) var(--font-family-sans); color: var(--h-ink); }
  .runit-text > p { margin: 0 0 var(--space-3); }
  .runit-facts { display: flex; flex-wrap: wrap; border-block: 1px solid var(--color-border); font-family: var(--font-family-mono); font-size: var(--h-text-small); margin: 0 0 var(--space-3); }
  .runit-facts div { padding: var(--space-2) var(--space-3); border-left: 1px solid var(--color-border); }
  .runit-facts div:first-child { border-left: 0; padding-left: 0; }
  .runit-facts dt { font-size: var(--h-text-micro); text-transform: uppercase; letter-spacing: .06em; color: var(--h-ink-muted); }
  .runit-facts dd { margin: 2px 0 0; }
  .runit-button { font: 600 var(--h-text-body) var(--font-family-sans); background: var(--h-ink); color: var(--h-ground); border: 0; border-radius: 4px; padding: .7rem 1.2rem; min-height: 44px; cursor: pointer; }
  .runit-downloads { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-4); margin: var(--space-3) 0 0; }
  .runit-downloads a { display: inline-flex; align-items: center; min-height: 44px; }
  .runit-caption { grid-column: 1 / -1; font-family: var(--font-family-read); font-style: italic; color: var(--h-ink-muted); margin: 0; }
</style>
```

The token names match Task 4. The strip gets no commit on its own; Task 7 wires it in, and the two are tested together.

---

### Task 7: RunPanel and the lesson layout

**Files:**
- Create: `src/components/RunPanel.astro`
- Modify: `src/layouts/UnitLayout.astro:2` (imports), `:110-117` (the layout markup), `:158-183` (the grid CSS)
- Modify: `src/content/curriculum/sinclair-zx-spectrum/assembly/meet-the-machine/unit-01.mdx` (add `inlinePlayer: true`)
- Modify: `src/content/curriculum/commodore-amiga/assembly/meet-the-machine/unit-02.mdx` (place `<RunIt />`; add `runItPlaced: true`)
- Create: `src/lib/runit-placement.test.ts`
- Delete: `src/components/LessonPlayer.astro`

**Interfaces:**
- Consumes: `runit:open` events from `RunIt` (Task 6); `panelMode` (Task 1).
- Produces:
  - A `<run-panel>` element inside `.unit-layout`.
  - The class `is-docked` on `.unit-layout` while docked, with a CSS custom property `--panel-width`.

- [ ] **Step 1: Write the failing placement test**

`src/lib/runit-placement.test.ts`:
```ts
import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// A unit that places <RunIt /> itself must say so, or the layout adds a second
// strip at the end. The flag and the tag must agree in both directions.
describe('RunIt placement', () => {
  const units = globSync('src/content/curriculum/**/*.mdx').map(f => ({ f, s: readFileSync(f, 'utf8') }));
  it('flags every unit that places <RunIt />', () => {
    const bad = units.filter(u => u.s.includes('<RunIt') && !/^runItPlaced:\s*true$/m.test(u.s)).map(u => u.f);
    expect(bad).toEqual([]);
  });
  it('places <RunIt /> in every flagged unit', () => {
    const bad = units.filter(u => /^runItPlaced:\s*true$/m.test(u.s) && !u.s.includes('<RunIt')).map(u => u.f);
    expect(bad).toEqual([]);
  });
});
```

- [ ] **Step 2: Place the strip in the Amiga exemplar and see the test fail**

In `src/content/curriculum/commodore-amiga/assembly/meet-the-machine/unit-02.mdx`:
- Add the import `import RunIt from "@components/RunIt.astro";` beside the other imports.
- After the paragraph under `## Assemble, master, and run` ("A green screen — the colour the CPU moved into the slot."), add:

```mdx
<RunIt
  capture="/images/commodore-amiga/assembly/meet-the-machine/unit-02/screenshot.png"
  watch="This unit's program, built and mastered for you. The screen turns green the moment the CPU writes the colour register."
  caption="What you should see: a green screen."
/>
```

Run: `npx vitest run src/lib/runit-placement.test.ts`
Expected: FAIL. "flags every unit that places <RunIt />" lists the Amiga unit.

- [ ] **Step 3: Add the flags**

- In that Amiga unit's frontmatter, add `runItPlaced: true`.
- In `src/content/curriculum/sinclair-zx-spectrum/assembly/meet-the-machine/unit-01.mdx`'s frontmatter, add `inlinePlayer: true`. It already runs its program in the permissioned-ROM `<Emulator>` and must not gain a firmware-hungry strip.

Run: `npx vitest run src/lib/runit-placement.test.ts`
Expected: PASS.

Check whether the content schema accepts the new key: `ggrep -n "inlinePlayer" src/content.config.ts`. If `inlinePlayer` is declared there, declare `runItPlaced: z.boolean().optional()` next to it.

- [ ] **Step 4: Implement the panel**

`src/components/RunPanel.astro`:
```astro
---
/**
 * The lesson's single run panel (spec §5.2). Docks in the right column when
 * the prose keeps 600px, overlays otherwise, fullscreen below 768px. Closing
 * pauses the machine: the player has no public resume, so the reader resumes
 * with its own Resume button. A new program replaces the element.
 */
---
<run-panel hidden>
  <div class="rp-head">
    <div><strong class="rp-title"></strong><br><span class="rp-model"></span></div>
    <button type="button" class="rp-close">Close <span aria-hidden="true">✕</span></button>
  </div>
  <div class="rp-screen"></div>
  <div class="rp-inspector" hidden></div>
</run-panel>

<script>
  import { panelMode } from '../lib/player-layout';

  class RunPanel extends HTMLElement {
    opener: HTMLElement | null = null;
    width = 416;
    connectedCallback() {
      document.addEventListener('runit:open', e => this.open((e as CustomEvent).detail.button));
      this.querySelector('.rp-close')!.addEventListener('click', () => this.close());
      document.addEventListener('keydown', e => {
        if (e.key !== 'Escape' || this.hidden) return;
        if (document.activeElement?.tagName === 'EMU198X-PLAYER') return; // Esc is a machine key there
        this.close();
      });
      addEventListener('resize', () => { if (!this.hidden) this.place(); });
    }
    async open(button: HTMLElement) {
      this.opener = button;
      const d = button.dataset;
      this.width = Number(d.runWidth) || 416;
      await import(/* @vite-ignore */ '/emulators/embed.js');
      const player = document.createElement('emu198x-player');
      player.setAttribute('system', d.runSystem!);
      if (d.runVariant) player.setAttribute('variant', d.runVariant);
      player.setAttribute('src', d.runSrc!);
      player.setAttribute('example-title', d.runTitle!);
      this.querySelector('.rp-screen')!.replaceChildren(player);
      this.querySelector('.rp-title')!.textContent = d.runTitle!;
      this.querySelector('.rp-model')!.textContent = d.runModel ?? '';
      this.hidden = false;
      this.place();
      (this.querySelector('.rp-close') as HTMLElement).focus();
    }
    place() {
      const layout = this.closest('.unit-layout') as HTMLElement;
      const gap = parseFloat(getComputedStyle(layout).columnGap) || 40;
      const mode = panelMode({ viewportWidth: innerWidth, containerWidth: layout.clientWidth, panelWidth: this.width, gap });
      this.dataset.mode = mode;
      layout.classList.toggle('is-docked', mode === 'docked');
      layout.style.setProperty('--panel-width', `${this.width}px`);
    }
    close() {
      (this.querySelector('emu198x-player') as (HTMLElement & { pause?: () => void }) | null)?.pause?.();
      this.hidden = true;
      (this.closest('.unit-layout') as HTMLElement).classList.remove('is-docked');
      this.opener?.focus();
    }
  }
  if (!customElements.get('run-panel')) customElements.define('run-panel', RunPanel);
</script>

<style is:global>
  run-panel { display: block; background: var(--h-ground); font-family: var(--font-family-sans); }
  run-panel[hidden] { display: none; }
  run-panel .rp-head { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-4); border-top: 4px solid var(--runit-rule, var(--h-ink)); padding: var(--space-3) 0; }
  run-panel .rp-model { font-family: var(--font-family-mono); font-size: var(--h-text-small); color: var(--h-ink-muted); }
  run-panel .rp-close { font: var(--h-text-small) var(--font-family-sans); background: none; border: 1px solid var(--color-border); border-radius: 4px; padding: .4rem .7rem; min-height: 44px; color: var(--h-ink); cursor: pointer; }
  run-panel[data-mode='docked'] { position: sticky; top: var(--space-4); align-self: start; order: 3; }
  run-panel[data-mode='overlay'] { position: fixed; inset: 0 0 0 auto; width: min(100vw, calc(var(--panel-width) + 2 * var(--space-5))); padding: 0 var(--space-5); overflow-y: auto; box-shadow: -12px 0 32px -16px rgb(0 0 0 / .45); z-index: 50; }
  run-panel[data-mode='fullscreen'] { position: fixed; inset: 0; padding: 0 var(--space-4); overflow-y: auto; z-index: 50; }
  @media (prefers-reduced-motion: no-preference) {
    run-panel[data-mode='overlay'] { animation: rp-in 160ms var(--h-ease); }
    @keyframes rp-in { from { transform: translateX(24px); opacity: 0; } }
  }
</style>
```

The animation uses the family's easing token `--h-ease`, and it is off under `prefers-reduced-motion`.

- [ ] **Step 5: Wire the layout**

In `src/layouts/UnitLayout.astro`:
- Replace line 2, `import LessonPlayer from '../components/LessonPlayer.astro';`, with:

```astro
import RunIt from '../components/RunIt.astro';
import RunPanel from '../components/RunPanel.astro';
```

- Replace the `<LessonPlayer … />` line inside `<article class="unit-content">` with:

```astro
        {!section && !frontmatter.inlinePlayer && !frontmatter.runItPlaced && <RunIt />}
```

- After `</article>` and before the closing `</div>` of `.unit-layout`, add:

```astro
      {!section && !frontmatter.inlinePlayer && <RunPanel />}
```

- In the `@media (min-width: 1200px)` block, add below the existing `.unit-layout` rule:

```css
      .unit-layout.is-docked { grid-template-columns: minmax(0, 1fr) var(--panel-width); }
      .unit-layout.is-docked .unit-sidebar { display: none; }
```

- Outside that media query, add `.unit-layout.is-docked { display: grid; grid-template-columns: minmax(0, 1fr) var(--panel-width); gap: var(--space-8); }`, so docking also works between 768px and 1199px when `panelMode` allows it.

Run: `ggrep -rn "LessonPlayer" src`
Expected: only the file itself. Then `git rm src/components/LessonPlayer.astro`.

- [ ] **Step 6: Build and look**

Run: `npx astro build && npx astro preview`, then check:
- `/systems/commodore-64/assembly/starfield/unit-03/`: the fallback strip at the end of the unit (text only, no capture), with the Run button and the `steps/step-02.prg` download.
- `/systems/commodore-amiga/assembly/meet-the-machine/unit-02/`: the strip after "Assemble, master, and run", with the 768px capture **above** the text.
- `/systems/sinclair-zx-spectrum/assembly/meet-the-machine/unit-01/`: no strip. The `<Emulator>` and the sandbox are unchanged.
- At 1440px, Run on the C64 page docks the panel and hides the contents list. Run on the Amiga page overlays.

- [ ] **Step 7: Commit**

```bash
git add src/components/RunIt.astro src/components/RunPanel.astro src/layouts/UnitLayout.astro src/lib/runit-placement.test.ts src/content/curriculum/commodore-amiga/assembly/meet-the-machine/unit-02.mdx src/content/curriculum/sinclair-zx-spectrum/assembly/meet-the-machine/unit-01.mdx src/content.config.ts
git commit -m "Run a lesson's program beside its text instead of at the end of the page"
```

---

### Task 8: Behaviour and accessibility tests

**Files:**
- Create: `tests/player-integration.spec.ts`
- Modify: `tests/a11y.spec.ts` (add four routes to `PAGES`)

**Interfaces:**
- Consumes: the built site (`npx astro build`) served by the Playwright config's web server. Check `playwright.config.ts` for how `test:a11y` serves `dist`, and reuse it.

- [ ] **Step 1: Write the behaviour tests**

```ts
import { expect, test } from '@playwright/test';

test.describe('system page stage', () => {
  test('loads no player script before Play, then swaps in the player', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', r => requests.push(r.url()));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/sinclair-zx-spectrum/');
    await expect(page.locator('.stage .pf-well img')).toBeVisible();
    expect(requests.some(u => u.includes('/emulators/embed.js'))).toBe(false);
    const width = await page.locator('.stage .pf-well img').evaluate(i => i.getBoundingClientRect().width);
    expect(width % 352).toBe(0);
    await page.getByRole('button', { name: /Play the/ }).click();
    await expect(page.locator('.stage emu198x-player')).toBeAttached();
    expect(requests.some(u => u.includes('/emulators/embed.js'))).toBe(true);
  });

  test('keeps route choice above the fold at 1440×900', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/sinclair-zx-spectrum/');
    const top = await page.locator('#routes').evaluate(h => h.getBoundingClientRect().top);
    expect(top).toBeLessThan(900 + 200);
  });

  test('has no Play button without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/systems/sinclair-zx-spectrum/');
    await expect(page.locator('.stage .pf-well img')).toBeVisible();
    await expect(page.getByRole('button', { name: /Play the/ })).toBeHidden();
    await context.close();
  });
});

test.describe('lesson run panel', () => {
  const c64 = '/systems/commodore-64/assembly/starfield/unit-03/';
  const amiga = '/systems/commodore-amiga/assembly/meet-the-machine/unit-02/';

  test('docks a narrow machine at 1440 and hides the contents list', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'docked');
    await expect(page.locator('.unit-sidebar')).toBeHidden();
  });

  test('overlays a wide machine at 1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(amiga);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'overlay');
  });

  test('goes fullscreen on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(c64);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'fullscreen');
  });

  test('Esc closes the panel and returns focus to the button', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    const run = page.getByRole('button', { name: 'Run it here' });
    await run.click();
    await page.keyboard.press('Escape');
    await expect(page.locator('run-panel')).toBeHidden();
    await expect(run).toBeFocused();
    await expect(page.locator('.unit-sidebar')).toBeVisible();
  });

  test('a second Run replaces the program rather than adding a player', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    const run = page.getByRole('button', { name: 'Run it here' });
    await run.click();
    await page.locator('.rp-close').click();
    await run.click();
    await expect(page.locator('run-panel emu198x-player')).toHaveCount(1);
  });

  test('never scrolls the page sideways on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of [c64, amiga, '/systems/sinclair-zx-spectrum/', '/systems/commodore-vic-20/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
```

- [ ] **Step 2: Add the accessibility routes**

In `tests/a11y.spec.ts`, add to `PAGES`:
```ts
  'system stage spectrum': '/systems/sinclair-zx-spectrum',
  'system stage vic-20': '/systems/commodore-vic-20',
  'lesson strip c64': '/systems/commodore-64/assembly/starfield/unit-03/',
  'lesson strip amiga': '/systems/commodore-amiga/assembly/meet-the-machine/unit-02/',
```

- [ ] **Step 3: Run them**

Run: `npx astro build && npx playwright test tests/player-integration.spec.ts && npm run test:a11y`
Expected: all pass, with no new serious or critical accessibility findings. Fix causes in the components, not in the tests.

- [ ] **Step 4: Commit**

```bash
git add tests/player-integration.spec.ts tests/a11y.spec.ts
git commit -m "Test the player stage and run panel in a browser"
```

---

### Task 9: Screenshots, spec amendments and the draft PR

**Files:**
- Modify: `docs/superpowers/specs/2026-09-25-browser-player-integration-design.md` (the Amiga figures in §5.3)
- Modify: `docs/superpowers/specs/2026-09-21-house-ui-preview-design.md` (§5.2 hero styling, §5.3 margin column, §6 PixelFrame)

- [ ] **Step 1: Screenshots**

Use Playwright to screenshot four routes, the Spectrum and VIC-20 system pages and the C64 and Amiga lessons, at 390, 1024, 1440 and 1920px in both themes. Set the theme with `page.addInitScript(t => localStorage.setItem('theme', t), theme)`, as `tests/a11y.spec.ts` does. Capture each lesson both with the panel closed and with it open.

Look at every image. Check:
- captures sit at integer widths (a multiple of 352, 416, 214 or 768);
- the prose keeps its measure;
- nothing overlaps;
- captions are Literata italic.

Save them outside the repo (for example `/tmp/bpi-shots/`) and attach a contact sheet to the PR description.

- [ ] **Step 2: Amend the specs**

- In this work's spec, §5.3: replace "the Amiga at 640px" and "At 1440px an Amiga docks with about 690px of prose; at 1280px it overlays" with "the Amiga at 768px (its frame at 1×)" and "An Amiga overlays at 1440px and docks from a viewport of about 1,560px". Also record the no-public-resume behaviour in §5.2: "Closing pauses the machine; the reader resumes it with the player's own Resume button."
- In the House UI spec:
  - **§5.2 Hero:** replace the frame's "2px border in the machine's contrast-adjusted colour … `--h-lift-2`" with "rendered by `PlayerStage` (see `2026-09-25-browser-player-integration-design.md`), in its specimen-sheet treatment".
  - **§5.3:** add "While the run panel is docked, margin figures render inline."
  - **§6:** mark `PixelFrame.astro` as already built by the player-integration work.

- [ ] **Step 3: Full check and PR**

Run: `npm run build`
Expected: passes, apart from the known `themed-highlight` failure. State in the PR whether that was the only failure.

```bash
git add docs/superpowers/specs
git commit -m "Record the Amiga's real frame width and the player's pause-only API in the specs"
git push -u origin feat/browser-player-integration
gh pr create -R code198x/website --draft --base main --head feat/browser-player-integration \
  --title "Show each machine's own screen before its player, and run lessons beside their text" \
  --body-file /tmp/bpi-pr.md
```

Write `/tmp/bpi-pr.md` with:
- a summary linking the spec and this plan;
- the screenshot contact sheet;
- the test results, including the known local failure;
- any step skipped, with the reason.

Don't merge the PR.
