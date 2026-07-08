# Maths for Games — unit breakdown

**Placement (decided):** this module lives in **The Craft** — the cross-machine
techniques layer — not in Foundations. It's the first module there. See resolved
question 1 below.

Design sketch, not final unit bodies. Seven units, mirroring the economy of Numbers &
Bits, and deliberately shaped as a **staircase to one payoff**: a thing that chases you.

**The spine:** every unit is the same move — *spot the expensive sum a game seems to
demand, and find the cheap thing that gives the same answer before the next frame.* A
direction becomes a lookup; a distance test loses its square root; a fraction becomes an
accumulator.

**The applied thread — this time it's the subject, not the motivation.** You asked to
foreground pathfinding and AI, and this is the module where they *are* the content. The
first six units each forge one piece; Unit 7 assembles them into the arithmetic spine of a
pursuer — which is what "enemy AI" and "pathfinding" actually reduce to on an 8-bit
machine once you strip the mystique.

**The BASIC inversion (worth stating up front):** unlike the Foundations modules, here
Sinclair BASIC is the *expensive, honest reference* — it has `*` and `SIN`, the machine
underneath does not. So each unit shows the clear-but-unaffordable BASIC answer beside the
cheap technique, and checks they agree. BASIC stops being the demonstrator and becomes the
control group.

Frontmatter per unit as elsewhere: `title`, `description`, `pubDate`, `game`, `unit`,
`tags: ["craft", "maths-for-games", …]`.

---

## Unit 1 — The Maths a Game Needs, and the Maths a Machine Hates

**description:** "Position, speed, direction, distance — what a moving thing is made of,
and why the processor underneath is bad at every part of it. Meet the one skill this whole
module teaches: trade exactness or memory for speed."

**Core idea:** Framing. Lay out the four quantities a moving thing carries, then the four
things the machine can't do fast — multiply, fractions, square root, sine — and line them
up: the game wants exactly what the CPU is worst at. Name the escape route (tables,
fixed-point, approximation, comparison) so the rest of the module has a shape.

**The idea twice:** *Shape* — two columns, "what the game asks for" against "what the
machine charges for it." *BASIC* — a one-liner that moves a dot with `*` and `SIN`,
working perfectly, with the note: *every one of those operations is a luxury the machine
underneath can't pay for at speed. The rest of this module is how you fake them.*

**Applied hook:** Promise the destination — "by Unit 7 you'll have built the sums an enemy
uses to hunt you, and none of them will contain a multiply you can't afford."

---

## Unit 2 — Sub-pixel Motion

**description:** "Moving half a pixel a frame when the screen only has whole ones. A
fixed-point accumulator that hoards fractions until they add up to a step — smooth motion
on a grid with no in-between."

**Core idea:** The applied half of Numbers & Bits' fixed-point (that unit taught what a
fixed-point number *is*; this one puts it in motion). A slow-moving object adds a
fractional speed to an accumulator each frame and only moves a whole pixel when the
fraction rolls over. The screen has no half-pixel; the *maths* does, and that's where
smoothness lives.

**The idea twice:** *Shape* — an accumulator filling up over several frames, spilling one
pixel of movement when it crosses 1. *BASIC* — run a whole-number position (jerky) beside
a fixed-point one (smooth) and watch the difference on screen.

**Applied hook:** Slow drift, easing, a ship with momentum — anything that moves at less
than one pixel a frame, which is most things that feel good to control.

---

## Unit 3 — Multiplying When You Can't Multiply

**description:** "These machines have no multiply instruction. Free doubling by shifting,
general multiply built from shift-and-add, and the table you reach for when even that's
too slow — plus the one multiply hiding behind every screen position."

**Core idea:** Multiplication is not free and sometimes not even *available*. Reclaim
×2/×4/×8 as shifts (from N&B), build a general multiply from shift-and-add, and know when
to abandon computing it and just look it up. Land the practical case: a screen address is
`y × width + x`, so "where is this pixel" is a multiply — one you'll often precompute as a
row table.

**The idea twice:** *Shape* — 13 × 5 unrolled into shift-and-add. *BASIC* — compute a
product both with `*` and by shift-and-add, confirm they match; then build a small row-
address table and index it.

**Applied hook:** Every 2D grid lookup — tilemaps, the screen itself, a collision map —
rests on this multiply. Get it cheap and the whole playfield gets cheap.

---

## Unit 4 — Turning Without Trigonometry

**description:** "You can't call SIN sixty times a frame. A small precomputed table turns
an angle into an (x, y) step with a single lookup — so a thing can head any direction,
fire at any angle, or circle a point, with no trig at run time."

**Core idea:** Direction is the game-maths that most obviously screams "trigonometry," and
trig at run time is out of the question. The move: precompute sine and cosine *once* into a
small table, then a direction is an angle, and an angle is an index. Look up the step,
add it to the position, done. Circular motion and aiming fall straight out.

**The idea twice:** *Shape* — a ring of angles, each pointing to a stored (x, y) step.
*BASIC* — build the table with `SIN`/`COS` up front (the one time you're allowed to),
then move a dot purely by table lookup and show it tracing a circle with no trig in the
loop.

**Applied hook:** A turret tracking the player, a bullet fired along an angle, an enemy
orbiting its post, a starfield radiating out — all the same table.

---

## Unit 5 — Distance Without Square Roots

**description:** "How far away is the player? The honest formula has a square root in it,
and a root is agony. Compare squared distances to rank things with no root at all — and
approximate the real distance cheaply when you actually need the number."

**Core idea:** Distance is where AI *perceives*, and it's built on Pythagoras — which ends
in a square root the machine loathes. Two escapes: for "which is nearest / is it within
range," you never need the root at all, because comparing *squared* distances ranks them
identically; for "roughly how far," a cheap approximation (a max-plus-fraction-of-min
kind of rule) is close enough for a game. Exactness was never the requirement — the
*ranking* was.

**The idea twice:** *Shape* — two enemies, "who's closer" answered by comparing squared
distances, root never taken. *BASIC* — compute true distance with a real square root, then
the root-free comparison and the approximation, and show all three agree on the decision
that matters.

**Applied hook:** Aggro radius ("chase if within N"), target-the-nearest, proximity
before a fine collision check — the perception layer of every enemy, made affordable.

---

## Unit 6 — Chance Without a Random Number

**description:** "The machine is perfectly predictable, and games need surprise. Build it
from a few cheap bit operations — a stream that looks random enough for drops, spawns,
wander and twinkle."

**Core idea:** A processor is deterministic; there is no `RND` down on the metal. Yet
games need unpredictability. Manufacture a pseudo-random stream from cheap bit operations
(shift and XOR feedback — an LFSR, named plainly) that never repeats for a long time and
costs almost nothing. Understand it's *not* truly random, and why that's fine — and
occasionally an asset (same seed, same level).

**The idea twice:** *Shape* — a register shifting, one bit fed back by XOR, a long
non-repeating trail of values. *BASIC* — implement the shift/XOR generator by hand and
print its stream beside BASIC's `RND`; eyeball that it's "random enough," and note it
repeats — deterministically.

**Applied hook:** Item drops, spawn timing, enemy wander, star twinkle, procedural
variety — and reproducible runs when you *want* the dice loaded the same way twice.

---

## Unit 7 — A Thing That Chases You

**description:** "The payoff: assemble a pursuer from the pieces. A direction to the player,
a distance to decide whether to bother, a fixed-point step to close in smoothly, and a
pinch of chance so it isn't robotic — the arithmetic spine of pathfinding and enemy AI,
whole."

**Core idea:** Synthesis, and the reveal that "AI" was arithmetic all along. Build a
minimal chaser: measure distance to the player (Unit 5) to decide whether it's even
interested; take the direction toward them (Unit 4) to know which way to go; step along it
in fixed-point (Unit 2) so the approach is smooth; jitter it slightly (Unit 6) so it
reads as alive rather than mechanical. No pathfinding graph, no trig in the loop — just the
six cheap answers, composed.

**The idea twice:** *Shape* — the pursuer's per-frame decision as a little flow: in range?
→ which way? → step. *BASIC* — a runnable toy: a dot that hunts the cursor using only the
techniques built in Units 2–6, nothing the machine couldn't afford.

**Applied hook:** This *is* the entry point to enemy AI and pathfinding. Name where it
grows next — line-of-sight, waypoints, flocking, A* — and hand those off to the machine
tracks and pattern library, where they become real routines. The foundation gives the
spine; the machine gives the muscle.

---

## Open questions for you

1. **RESOLVED — is this a foundation at all? No.** It answers *what you do with numbers to
   make a game*, not *what a number is* — a step toward tactics, and it brushed against
   Numbers & Bits' own line ("what a number is, not what a machine does with one"). So it
   lives in **The Craft**, a new cross-machine techniques layer between Foundations and the
   machine tracks — distinct from the Pattern Library, which holds isolated per-machine
   recipes rather than taught fundamentals. Maths for Games is Craft's first module.

2. **Overlap with Numbers & Bits unit 6 (fixed-point).** I've split it cleanly — N&B keeps
   *what fixed-point is*, Maths for Games (Unit 2) takes *fixed-point in motion*. If you'd
   rather, N&B u6 could migrate wholesale into this module, tightening N&B to pure
   representation. That's the repositioning you floated earlier; this is where it'd happen.

3. **LFSR by name?** Unit 6 names the LFSR. It's the one place the module risks feeling
   like a technique catalogue rather than a taught fundamental. Fine to keep the plain-English
   "shift-and-XOR" framing and drop the acronym to a footnote if you want it gentler.

4. **Title spelling.** I set it as *Maths for Games* to match the British house voice
   (learnt, colour, the Spectrum). You wrote "Math" — trivially reverted if you'd rather
   keep your spelling.
