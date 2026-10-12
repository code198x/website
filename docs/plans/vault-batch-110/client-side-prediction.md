# Client-Side Prediction

Source and prose review complete; owner sign-off received through [PR #676](https://github.com/code198x/website/pull/676), merged on 12 October 2026.

| Claim | Verdict | Evidence (public citation) | Change made |
|---|---|---|---|
| Local simulation hides response delay | VERIFIED | Bernier, Latency Compensating Methods; id Software cl_pred.c | Explain provisional movement and server authority. |
| Prediction makes network latency disappear | CORRECTED | Same sources; CVG 184 limitations | Separate perceived responsiveness from packet travel time. |
| QuakeWorld invented all client prediction | QUALIFIED | CGW 147; PC Gamer UK 40 p. 18 establish this release, not priority | Present it as a documented example. |
| Preview October 1996; release mid-December 1996 | VERIFIED | CGW 147; PC Gamer UK 40 p. 18 | Retain dated contemporary accounts. |
| Replaying local inputs from the server state | VERIFIED | CL_PredictMove / CL_PredictUsercmd / PlayerMove call | Add concrete source-code explanation. |
| PUSHLATENCY player advice | VERIFIED | CVG 184, QuakeWorld Giblets box | Paraphrase advice and retain observed limitations. |
| Remote-player prediction is the same correction from another end | CORRECTED | Bernier separates local input, extrapolation and interpolation | Explain the different information available. |
| Prediction also solves delayed hit decisions | CORRECTED | Bernier lag-compensation section | Distinguish server-side historical evaluation. |
| Rubber-band phrase originated here and endured from this article | REMOVED | Period article supports its own analogy, not subsequent linguistic history | Remove lineage claim. |
| Registration/ranking changes are part of the prediction mechanism | REMOVED | CVG reports product features, not a technical dependency | Remove unrelated feature history. |

Verdicts: 4 VERIFIED, 3 CORRECTED, 1 QUALIFIED, 2 REMOVED.

Prose: remove repeated long extracts and promotional headings. Use a concrete input/replay explanation. Preserve contemporary coverage while resolving its ambiguous terminology through released code and a developer's technical paper.

## Single-sourced claims

The mid-December release date remains explicitly tied to PC Gamer's contemporary report. CVG's PUSHLATENCY instructions are period advice, not a universal configuration recommendation. The later released source independently demonstrates local prediction but is not assumed identical to the launch binary. Bernier's paper describes Valve's implementation where specified.

## Released source code

id Software's official Quake repository contains the directly inspected QuakeWorld prediction implementation under GPL-2.0-or-later. No code copied into the entry.

## Vault candidates

QuakeWorld, Yahn Bernier, lag compensation; check existing entries and candidates before adding.

## Commit title

Review client-side prediction: distinguish local movement, remote motion and lag compensation
