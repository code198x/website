# Game Feel — teaching direction

The organising question is: how do actions and consequences feel moment by moment?
Controls and response now has four locally authored lessons for review. The other
sequences remain planned; this is not a fixed lesson count.

Use **play, compare, explain**. Let the reader experience a difference, identify
its cause, inspect the rule and apply it deliberately. Distinguish player intent,
input sampling, simulation, animation and presentation. Avoid universal claims
that every game needs blinking, invulnerability, a delay or more effects.

| Sequence | Coverage | Experiment |
|---|---|---|
| Controls and response | Immediate response, acceleration, braking, turning, input edges, buffering and latency | Compare responsive, slippery and heavy ships under identical input |
| Jumping and forgiveness | Jump profiles, air control, variable height, buffered jumps and coyote time | Compare the same gap with one rule changed |
| Impact and feedback | Animation timing, sound, recoil, hit pauses and visual emphasis | Compare one hit with individual feedback layers enabled |
| Cameras and attention | Framing, follow, lead, dead zones, tracking and shake | Follow the same path with different camera rules |
| Readability and anticipation | Silhouette, contrast, warnings, action phases and competing cues | Read an incoming threat before acting |
| Failure and recovery | Checkpoints, respawns, protection, retries, input gates and ending transitions | Compare the time and actions needed to recover from the same failure |

Existing blink, grace-window, ending-dwell and edge-detection patterns remain
useful techniques. Teach their assumptions and alternatives in the relevant
sequence instead of treating them as the entire module.

Accessibility belongs in each comparison: keyboard and touch controls, redundant
cues, adjustable disruptive effects, and no unnecessary motion. Distinguish
purposeful game motion from decorative UI animation.

## Published comparison and focused lessons

`code-samples/craft/game-feel/movement/` contains a browser comparison, surfaced
at `/experiments/game-feel/index.html`. Three ships receive the same input and
share top speed. Acceleration and stopping rules differ. A repeatable comparison
lets readers observe the same hold, release and reversal without timing their
own input. The model uses seconds and fixed 1/60-second simulation steps; it is
not a native-machine performance claim or a completed lesson sequence.

The four local lesson pages isolate immediate response and speed, acceleration,
release braking and reversal braking. Each embeds a two-ship comparison with
identical input and one changed setting. Repeatable input, a pause control and a
single-update inspector expose position and velocity. Optional JavaScript is
included from the exact functions imported by the experiment; pseudocode and
worked arithmetic carry the main explanation. Lesson four deliberately compares
a zero-first reversal rule, distinguishing it from the published prototype's
approach towards the opposite velocity.
