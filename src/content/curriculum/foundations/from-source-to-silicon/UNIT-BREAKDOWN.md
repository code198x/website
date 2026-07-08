# From Source to Silicon — unit breakdown

Design sketch, not final unit bodies. Seven units, sitting between Numbers & Bits (6
units) and General Programming (11). Positioned as the **last foundation before Meet the
Machine** — the explicit on-ramp to assembly.

**The spine:** the same question runs through every unit — *when does the translating
happen?* — because that single choice, and nothing else, is what separates a game that
keeps up from one that can't.

**The applied thread:** for this module the honest practical hook is **performance**. An
enemy that chases you, a path that gets recomputed, sixty frames a second to fill — these
are the workloads that bust a BASIC frame budget and force the drop to the metal. So
pathfinding and AI aren't a side-topic here; they're the *reason the module exists*, and
they surface as the recurring example rather than a bolted-on "application" box.

Every unit keeps the house device: **the idea twice** — once as plain shape, once made
concrete (and here, timed) in Sinclair BASIC.

Frontmatter for each unit follows the existing pattern:
`title`, `description`, `pubDate`, `game`, `unit`, `tags: ["foundations", "from-source-to-silicon", …]`.

---

## Unit 1 — The Program Is Not What Runs

**description:** "You write words; the processor only understands numbers. Meet the
translator that has to stand in between — and the one question that decides how fast your
program will be."

**Core idea:** A program is text for humans. The CPU only ever consumes numbers. So
between what you write and what runs, *something translates* — and the interesting
question isn't *whether* it translates but *when*. Plant that question; the rest of the
module answers it.

**The idea twice:** *Shape* — a line of source, an arrow, a row of numbers the machine
actually executes. *BASIC* — type a line, then show the machine never stored the letters
`PRINT`; it stored a single token (a number) standing for it. The letters were for you.

**Applied hook:** Frame the destination up front — "by the end of this module you'll know
why an enemy can think in assembly but not in BASIC." Sets the debt the module pays off.

---

## Unit 2 — Translating As You Go

**description:** "How BASIC actually runs your program: read a line, puzzle out what it
means, do it — then start again from scratch the next time it meets that same line."

**Core idea:** The **interpreter**. It reads a line, works out its meaning *now*, acts,
and keeps no memory of having understood it — so the next time round the loop it works it
all out again. The meaning is recomputed on every pass. That re-working is invisible, and
it is never free.

**The idea twice:** *Shape* — a loop drawn as a cycle, with "work out what this means"
sitting *inside* the loop, happening every lap. *BASIC* — a `FOR` loop running the same
`LET` a thousand times; narrate that the machine has decoded that one line a thousand
times, not once.

**Applied hook:** An enemy's "decide where to move" code lives inside the game's main
loop — so an interpreter re-translates it *every frame*. First glimpse of why AI is where
BASIC hits the wall.

---

## Unit 3 — The Price, on the Clock

**description:** "A loop that does almost nothing, timed. It takes real time anyway — and
now you can see the translation tax your game pays on every single frame."

**Core idea:** Make the cost *visible*, the way Meet the Machine makes registers visible.
Interpreting isn't free, and you don't have to take that on faith — you can put it on a
clock. A near-empty loop still burns measurable time, and the time grows with the count.

**The idea twice:** *Shape* — cost = (work per lap) × (laps), with "translate the line"
folded into the work-per-lap whether you asked for it or not. *BASIC* — time an almost-
empty loop at 100, 1,000, 10,000 laps using the frame counter; watch the clock climb in
step. The tax was there all along; now it has a number.

**Applied hook:** A machine draws the screen 50 or 60 times a second — that's the whole
budget, fixed and unforgiving. Show that the interpreter can eat the frame before the
game has done anything. *This* is the wall pathfinding and AI run into.

---

## Unit 4 — Translate Once, Run Many

**description:** "The other bargain: turn the whole program into the machine's numbers
before it runs at all. Pay the translation price a single time, then run at full speed
forever."

**Core idea:** The **compiler**. Do all the translating up front, as a separate step,
before the program runs. What actually runs afterwards is pure machine numbers with no
puzzling-out left to do — so the loop that cost you in Unit 3 now costs almost nothing.
Same program, same idea; the price simply moved *out* of the loop and *before* the run.

**The idea twice:** *Shape* — the Unit 2 cycle redrawn with "work out what this means"
lifted clean out of the loop and placed once, ahead of it. *BASIC* — the honest move
here is contrast rather than a live demo (BASIC interprets by nature); note that the
catalogue's games are built this way, and that even on the Spectrum, tools existed that
compiled BASIC to win exactly this.

**Applied hook:** The path computed once per frame with no translation overhead — the
enemy can afford to *think* because the thinking isn't taxed on every lap.

---

## Unit 5 — One Name, One Number

**description:** "The thinnest translation there is: a readable name for each of the
machine's own instructions, turned one-for-one into the numbers it runs. This is the door
to the metal."

**Core idea:** The **assembler**. Where a compiler translates *ideas* ("a loop") into
many instructions, an assembler translates *names* into numbers almost one-for-one: a
mnemonic like `LOAD` becomes a single byte the CPU recognises. Assembling is lookup and
lay-out, not interpretation — which is why it's the closest you can write to the machine
without writing raw numbers.

**The idea twice:** *Shape* — a two-column table, human name on the left, machine number
on the right, one row per instruction. *BASIC* — write five lines of BASIC that
"assemble" a tiny invented one-instruction language: read a name from a `DATA` table,
look up its number, print the number. You've just built, in miniature, the thing every
assembler is.

**Applied hook:** Forward-point hard: "the names are made up here so they belong to no
machine — in Meet the Machine they'll be *your* machine's, and the numbers will be real."

---

## Unit 6 — The Same Thousand, Three Ways

**description:** "Add one, a thousand times — interpreted, compiled, and assembled — and
the gulf between them. The reason a game drops to the machine's own language the moment it
needs to keep up."

**Core idea:** The payoff unit. One trivial task, three translation strategies, and the
orders of magnitude between them. The gap isn't about clever code — the code is identical.
It's purely about *when* the translating happened. That's the whole thesis of the module,
now on a single page.

**The idea twice:** *Shape* — three bars, same task, wildly different lengths, labelled by
*when* they translated. *BASIC* — reuse the timed thousand-add from Unit 3 as the slow
bar, and reason about the other two (a machine executing pre-made numbers does in a blink
what BASIC labours at).

**Applied hook:** Name the workloads that live or die on this gap — pathfinding across a
map, an enemy choosing a move, dozens of objects updated every frame. These are precisely
the things you *can't* do in BASIC and *can* do on the metal. The module's promise from
Unit 1, paid in full.

---

## Unit 7 — What Speed Costs You

**description:** "Going down to the metal buys speed and sells comfort: no safety net,
more to say, and a program that runs on one machine only. What you're agreeing to when you
meet the machine."

**Core idea:** Honesty about the trade, so nobody arrives at assembly feeling ambushed.
Speed is bought, not free: you lose the forgiving error messages, you say far more to
achieve the same thing, and the result runs on one machine and no other. Worth it — but a
choice, made with eyes open.

**The idea twice:** *Shape* — a two-column ledger, *gained* against *given up*. *BASIC* —
show BASIC catching a daft mistake and telling you kindly; contrast with the machine,
which will do *exactly* what you said, mistake and all, and never mention it.

**Applied hook:** Set the mindset Meet the Machine opens on — you'll debug by *watching*,
not by reading errors, because there are no errors to read. A clean handoff into the
machine track's "the machine trusts you."

---

## Open questions for you

1. **Seven vs eleven.** This lands at seven, matching Numbers & Bits' economy rather than
   General Programming's length. Feels right for a bridge module — but if you'd rather it
   carry more weight, Units 2–3 (interpreter + its cost) and 5 (assembler) could each
   split into two, taking it to ~10.

2. **Unit 4's missing live demo.** It's the one unit that can't fully honour "the idea in
   BASIC," because BASIC interprets by nature — the compiler is shown by contrast, not by
   running. Acceptable, I think, but worth a flag. If it bothers you, the invented-
   language toy from Unit 5 could be extended to "assemble then run" here instead.

3. **Placement of the applied thread.** Right now pathfinding/AI is woven through as
   motivation. If you'd prefer the applications collected into a closing "where this bites"
   section (closer to how a pattern-library entry reads), that's a different but equally
   valid shape.
