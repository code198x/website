# Game Feel — unit breakdown

**Placement:** this module lives in **The Craft**. It is the taught form of several
cross-platform reference patterns that were already wired into machine-specific games.
The patterns stay in the Pattern Library; this module gives the ideas a curriculum path.

**The spine:** make the rules visible. Each unit takes one invisible piece of game state
and turns it into something the player can read: a blink, a pause, a prompt, a gate, a
new press.

Frontmatter per unit when authored: `title`, `description`, `pubDate`, `game`, `unit`,
`tags: ["craft", "game-feel", ...]`.

---

## Unit 1 — Rules the Player Can See

**description:** "Fairness is not only what the code does; it is what the player can read. Meet the timers, flags and visible signs that make a constrained game feel honest."

**Core idea:** A hidden rule feels like a bug. If the player is temporarily safe, show it.
If a screen is ignoring input, give the screen a reason to exist. If a prompt is alive,
make it breathe. The unit names the three tools the module will use: clocks, gates and
visible feedback.

**Applied hook:** Title screens, respawns, game-over screens and win screens all become
state transitions the player can understand.

---

## Unit 2 — Blink on a Clock

**description:** "Use a free-running frame counter to alternate between two renders: prompt and blank, visible and hidden, calm and urgent. One bit is enough to make a screen breathe."

**Core idea:** A blink does not need its own state. A frame counter already exists; test
one bit and choose which renderer runs. A higher bit blinks slowly, a lower bit blinks
urgently. The trick generalises to prompts, alarms, idle pulses and small animation beats.

**Reference pattern:** [`Blink on a Clock`](/patterns/cross-platform/rendering/blink-on-a-clock)

**Machine application:** NES code must do the write in vblank; framebuffer machines can
draw and clear directly; both are the same Craft rule under different hardware.

---

## Unit 3 — The Grace Window

**description:** "After a respawn, harm is ignored briefly and visibly. One timer gates every damage path, and the blink tells the player the temporary rule."

**Core idea:** Dying once should cost one life, not all of them. A grace timer loaded on
respawn skips all damage checks while it runs. The visible blink is not decoration; it is
the rule being displayed. The player keeps movement and input so they can leave danger.

**Reference pattern:** [`The Grace Window`](/patterns/cross-platform/physics/grace-window)

**Machine application:** The timer may live in zero page, a C64 variable, or a 68000 word,
but the discipline is the same: gate every damage source and show the gate.

---

## Unit 4 — The Ending Dwell

**description:** "Win or lose, hold the screen for a beat before believing buttons. The pause is punctuation, and it prevents held input from skipping the ending."

**Core idea:** Players die with buttons held. Without a dwell, that held input can carry
through game over, title and restart before the player understands what happened. A dwell
timer belongs at the state transition and expires before the screen believes input.

**Reference pattern:** [`The Ending Dwell`](/patterns/cross-platform/framework/ending-dwell)

**Machine application:** The dwell is usually just one byte and a branch, but verification
often needs a scripted run because screenshots cannot prove an input was ignored.

---

## Unit 5 — Presses, Not Held Levels

**description:** "Some screens need a new press, not a button that was already down. Edge detection and dwell timers solve different halves of the same input problem."

**Core idea:** A held button is a level; a new button press is an edge. Title screens,
menus and ending screens often need the edge. A dwell gives the moment room to breathe;
edge detection prevents old input from counting as a new decision.

**Reference pattern:** [`Edge Detection`](/patterns/cross-platform/input/edge-detection)

**Machine application:** Each machine reads input differently, but all tracks eventually
need to remember the previous frame and compare it with the current frame.

---

## Unit 6 — A Finished State Loop

**description:** "Put the pieces together: title prompt, game, respawn, game over, restart. Every transition tells the player what happened and rejects accidental input."

**Core idea:** Synthesis. Build the smallest complete flow that uses every rule: a
clocked prompt on the title, visible invulnerability after damage, a dwell on game over,
and edge-based restart after the dwell expires. The unit makes the module's claim
concrete: feel is state, timing and feedback, not mystery.

**Machine application:** The state loop belongs in each machine track as real code: a
Z80 state byte, a 6502 jump table, an Amiga frame loop, or a BASIC dispatcher.

