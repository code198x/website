# Unit Pathfinding

Source and prose review complete; human sign-off pending.

| Claim | Verdict | Evidence (public citation) | Change made |
|---|---|---|---|
| RDF 1985 offers terrain-cost-based automatic movement by 1983 | VERIFIED | Neil Shapiro, Electronic Games September 1983 p. 78 | Retain observed feature; do not name an unverified algorithm. |
| Wargames were the first games to need routing | REMOVED | No priority evidence | Remove unsupported origin claim. |
| Turn-based games have time to think, RTS games do not | CORRECTED | Actual navigation examples do not support that binary distinction | Explain route search and movement responsibilities. |
| All pathfinding searches a grid | CORRECTED | Patel's original illustrated algorithm guide | Define a graph and identify a grid as one representation. |
| A heuristic automatically makes search fast enough for every unit | QUALIFIED | Patel's A* account and explicit limits | State optimality conditions and avoid a universal performance promise. |
| Paradroid's patrol points and door waiting | VERIFIED | Braybrook's June 1985 diary, part 3 | Retain dated first-person example. |
| Most period arcade games used the same algorithm-free patrol system | REMOVED | No representative evidence; stored data still needs processing | Remove generalisation. |
| Tribal Rage units got stuck near clear routes | VERIFIED | Case, CGW 171 review | Attribute observation without diagnosing unseen code. |
| Route finding alone handles local blockages and group arrival | CORRECTED | EA REDALERT/DRIVE.CPP | Add separate movement decisions visible in released code. |
| Tiberian Sun replaced pathfinding | VERIFIED | Bret Ambrose interview, Edge 68 printed p. 63 | Attribute development claim rather than guarantee results. |
| AoE II equal pathfinding promise admits previous cheating | REMOVED | Preview statement does not establish predecessor behaviour | Remove inference. |
| Preview promises establish fixes in shipped games | QUALIFIED | Original sources are previews/interviews | Distinguish announced implementation from demonstrated quality. |

Verdicts: 4 VERIFIED, 3 CORRECTED, 2 QUALIFIED, 3 REMOVED.

Prose: replace long repeated quotations and the catalogue of patch promises with examples that distinguish graph search, authored patrols and movement execution. Avoid diagnosing review symptoms as a specific implementation defect.

## Single-sourced claims

RDF's feature remains attributed to the contemporary review. Braybrook supplies the implementation history for his own game; it is not extrapolated to a whole era. Ambrose's statement is explicitly an interview account. Modern algorithm explanation comes from the author's own implementation guide, while released EA code independently demonstrates concrete movement decisions.

## Released source code

EA's official CnC_Remastered_Collection repository contains Red Alert vehicle movement logic. Inspected the branches around Basic_Path, close-enough arrival and friendly temporary blockages. Identify remaster provenance and do not assume exact identity with the 1990s binary.

## Vault candidates

RDF 1985, Bret Ambrose, Amit Patel, navigation graphs; check existing entries and candidates before adding.

## Commit title

Review unit pathfinding: separate route search from movement and remove unsupported history
