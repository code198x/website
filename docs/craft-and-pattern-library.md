# The Craft ↔ Pattern Library — migration map

Decision record for how the new **Craft** section relates to the existing **Pattern
Library**, and what (if anything) moves between them.

## The correction

The first pass (from pattern *summaries* only) proposed physically moving a cluster of
"lesson-shaped" cross-platform patterns into Craft. **Reading the bodies overturned
that.** Those entries — `grace-window`, `ending-dwell`, `escalation-as-data`,
`three-caps`, `blink-on-a-clock`, `tune-sequencer` — are not mis-shelved essays. Each
already carries `taught_in` links to specific *game* units across several machines
(Flock/Amiga, Starfield/C64, Dash/NES, Gloaming/Spectrum) and `related` cross-references
to sibling patterns. They are a deliberate, wired-in **reference tier**: the machine-
neutral distillation of a lesson taught concretely inside the games. Moving them would
strip working wiring out of the library and duplicate content the games already teach.

So the honest split is not *recipe vs lesson, some of which move*. It is:

- **Craft** is a **course** — sequenced modules and units, taught front-to-back.
- **The Pattern Library** is **reference** — standalone, dip-in entries.
- **Machine and language tracks** are **application** — where transferable ideas meet
  real syntax, registers, memory maps, chips, timing and toolchains.

Same idea can live in both, in different modes, clasped by `taught_in`. That is exactly
what the field is for. **Almost nothing moves; the migration is mostly linking.**

## Curriculum shape

The public model is:

1. **Foundations** teach concepts that are true before a machine or language matters:
   sequence, variables, loops, numbers, bits, source, interpreters, compilers and
   assemblers.
2. **Machine/language-specific primers** teach the first concrete vocabulary for a route:
   how Sinclair BASIC, Commodore BASIC, Z80, 6502, 68000, AMOS, Blitz, or another path says
   those ideas in practice.
3. **Craft** teaches transferable game-making techniques with practical backing:
   movement, timing, collision, fixed-point maths, chance, state, game feel, data, and
   the tradeoffs old machines make visible.
4. **Machine/language tracks** show the actual application under one machine's constraints:
   the syntax, memory layout, registers, ROM calls, video/audio hardware, build process and
   complete game structure.
5. **Pattern Library** keeps reusable final forms: recipes and distilled patterns that can
   point back to the Craft unit, primer unit, or game unit where the idea is taught.

The Craft can be more theoretical than a machine track, but never abstract for its own
sake. Each module should have proof: runnable examples, tables, diagrams, small programs,
or direct links to the concrete units where the idea becomes working code.

The primers are not the only language teaching in a route. They establish the initial
vocabulary; later **mid-language modules** can appear when a real game needs a new concept
or idiom before it can proceed. That keeps the main games practical without forcing every
language feature into the first on-ramp.

## The three tiers (all stay as reference)

1. **Per-machine recipes** (~56 entries: SID, Copper, blitter, AY, VIC-II, PPU,
   attribute clash, …). Concrete recipe on one machine. Untouched.
2. **Cross-machine recipes** — reusable, code-shaped, machine-neutral. These are the ones
   that gain a `taught_in` link to a Craft unit as the matching Craft module is authored.
3. **Cross-machine design patterns** — game-feel / architecture wisdom, already wired to
   game units via `taught_in`. Stay put. If Craft later *teaches* a cluster, the pattern
   gains an *additional* `taught_in` to the Craft unit — it is never moved.

## Classification of the 14 cross-platform patterns

| Pattern | Tier | Action |
|---|---|---|
| `physics/fixed-point-math` | cross-machine recipe | **Linked → Maths for Games U2** ✅ |
| `framework/lfsr-random` | cross-machine recipe | **Linked → Maths for Games U6** ✅ |
| `physics/aabb-collision` | cross-machine recipe | hold — link when a Craft Collision unit exists |
| `rendering/sprite-animation` | cross-machine recipe | hold — link when a Craft Movement/Animation unit exists |
| `input/edge-detection` | cross-machine recipe | hold — link when a Craft Input unit exists |
| `framework/state-machine` | cross-machine recipe | hold — link when a Craft Game-Structure unit exists |
| `audio/making-a-sound` | recipe / comparative essay | hold — future Craft Sound module |
| `physics/grace-window` | design pattern (wired) | **Linked → Game Feel U3** ✅ |
| `framework/ending-dwell` | design pattern (wired) | **Linked → Game Feel U4** ✅ |
| `rendering/blink-on-a-clock` | design pattern (wired) | **Linked → Game Feel U2** ✅ |
| `framework/escalation-as-data` | design pattern (wired) | **stay** — future Craft Difficulty/Data unit |
| `framework/three-caps` | design pattern (wired) | **stay** — ditto |
| `audio/tune-sequencer` | recipe (wired) | **stay** — future Craft Sound module |

## Executed in this pass

Five `taught_in` links added — only where a matching Craft module now exists:

- `cross-platform/physics/fixed-point-math` → `Maths for Games, Unit 2 (The Craft)`
- `cross-platform/framework/lfsr-random` → `Maths for Games, Unit 6 (The Craft)`
- `cross-platform/rendering/blink-on-a-clock` → `Game Feel, Unit 2 (The Craft)`
- `cross-platform/physics/grace-window` → `Game Feel, Unit 3 (The Craft)`
- `cross-platform/framework/ending-dwell` → `Game Feel, Unit 4 (The Craft)`

Nothing deleted, nothing moved.

## Recommended next step

The design-pattern cluster (`grace-window`, `ending-dwell`, `blink-on-a-clock`) now has a
Craft **Game Feel** module. The next likely migration is a **Difficulty as Data** module
for `escalation-as-data` and `three-caps`: new authoring, then `taught_in` links, with the
Pattern Library left whole.

The untaught cross-machine recipes (`aabb-collision`, `state-machine`, `sprite-animation`,
`edge-detection`) each get their `taught_in` link at the moment their Craft home is
authored — not before, to avoid pointing at units that do not yet exist.
