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

Same idea can live in both, in different modes, clasped by `taught_in`. That is exactly
what the field is for. **Almost nothing moves; the migration is mostly linking.**

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
| `physics/grace-window` | design pattern (wired) | **stay** — add Craft `taught_in` if a Game Feel unit is authored |
| `framework/ending-dwell` | design pattern (wired) | **stay** — ditto |
| `rendering/blink-on-a-clock` | design pattern (wired) | **stay** — ditto |
| `framework/escalation-as-data` | design pattern (wired) | **stay** — future Craft Difficulty/Data unit |
| `framework/three-caps` | design pattern (wired) | **stay** — ditto |
| `audio/tune-sequencer` | recipe (wired) | **stay** — future Craft Sound module |

## Executed in this pass

Two `taught_in` links added — the only actions unambiguously correct today, because
Maths for Games is the only Craft module that exists to point at:

- `cross-platform/physics/fixed-point-math` → `Maths for Games, Unit 2 (The Craft)`
- `cross-platform/framework/lfsr-random` → `Maths for Games, Unit 6 (The Craft)`

Nothing deleted, nothing moved.

## Recommended next step

The design-pattern cluster (`grace-window`, `ending-dwell`, `blink-on-a-clock`) is a
natural **Craft "Game Feel" module** — a taught progression on forgiveness, feedback and
timing. Building it is *new authoring*, not a move: the module teaches the cluster, and
each pattern gains a second `taught_in` (its existing game links, plus the Craft unit).
The Pattern Library stays whole; Craft grows; the clasp does the work.

The untaught cross-machine recipes (`aabb-collision`, `state-machine`, `sprite-animation`,
`edge-detection`) each get their `taught_in` link at the moment their Craft home is
authored — not before, to avoid pointing at units that do not yet exist.
