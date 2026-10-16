# Independent design assessment — 6 October 2026

Assessment A: `/root/site_design_review`. Completed independently of Assessment B; no detector output was read. This is a review of the current build served at `http://127.0.0.1:4396`, with source inspection in `Code198x/website`. No interface changes were made.

## Verdict

The identity is specific to Code198x: the paper, magazine typography, actual game output and source-led connections belong to this project. The strongest pages show something worth making or understanding. The weaker pages retain the same type and colours but turn the subject into a catalogue or a long document. The principal problem is the uneven translation of the learning promise into useful next actions.

Keep the approved homepage, Start Here and shared-subject direction. Extend their method—show an example, explain the question, offer a useful next step—to the Pattern Library, Timeline and setup journey. The Vault does not need another identity. Its inner pages need stronger editorial composition and more useful onward connections.

## Evidence and limits

I visually inspected opening desktop compositions on these 21 routes, normally at the browser's existing desktop size:

- `/`, `/start-here/`, `/foundations/`, `/craft/`, `/systems/`, `/from-the-metal/`.
- `/vault/`, `/vault/category/techniques/`, `/vault/techniques/colour-clash/`, `/vault/people/clive-sinclair/`.
- `/patterns/`, `/patterns/category/rendering/`, `/patterns/commodore-64/assembly/rendering/hardware-sprites/`.
- `/timeline/`, `/timeline/1980s/`.
- `/setup/`, `/setup/roms/`, `/setup/sinclair-zx-spectrum/native/`, `/systems/sinclair-zx-spectrum/getting-started/`.
- `/systems/sinclair-zx-spectrum/assembly/meet-assembly/`, `/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-01/`.

Stable 390 × 844 screenshots additionally covered the Pattern Library and native Spectrum setup openings. Several other phone screenshots were incorrectly scaled by the browser capture path; those are excluded from visual conclusions. The viewport was restored. These are representative page inspections, not a claim that all 2,443 generated pages, all article bodies, all mobile states or all interactions were personally inspected. Images captured before loading settled are not treated as missing-image findings.

Source review covered the Vault and pattern route templates; Timeline extraction, ordering and markup; setup pages and four machine getting-started sources; all four assembly track introductions; the catch-all curriculum routing and its module, unit, shared-section and getting-started layouts; the editorial layouts; generic system pages; the 404 recovery page; family Asm198x page; and assembler controls. The parent inventory supplies whole-site breadth and distinguishes other pages from these directly inspected representatives. About, teaching, press, colophon, contribution, system facet pages, individual editorial articles, experiments and remaining bespoke pages are not visually certified by this assessment.

Authorities read include umbrella `PRINCIPLES.md`, `PRODUCT.md`, `DESIGN.md`, `decisions/family-visual-identity.md`, Code198x org instructions, `docs/PROJECT.md`, `docs/website.md`, and the Vault and Pattern Library specifications. The Vault's five colour families and Timeline event colours are deliberate exceptions. They are not reported as generic palette violations.

## Design health

Scores concern this mixed learning/reference experience, with the limits above. They are design judgements, not accessibility certification or user-test measurements. All ten heuristics apply: setup choices make error prevention relevant, and setup help plus 404 recovery make recovery relevant. No heuristic was marked n/a.

| Heuristic | Score / 4 | Evidence |
|---|---:|---|
| Visibility of system status | 3 | Breadcrumbs, lesson position, catalogue totals and setup OS selection communicate location; pattern detail highlights Systems while its breadcrumb says Patterns. |
| Match with the real world | 3 | Strong concrete questions on newer entry pages; “Native Setup” and “production-ready” obscure the real tool choice and conditions. |
| User control and freedom | 3 | Breadcrumbs and directory links offer exits; Timeline has previous/next decades and year jumps. Complex workflows were not exercised. |
| Consistency and standards | 2 | Typography is recognisable, but page frames, opening density and contextual navigation change abruptly between template families. |
| Error prevention | 2 | ROM guidance explains distinctions, but alternative assembler pages do not give a direct route to the recommended Asm198x setup at the decision point. |
| Recognition rather than recall | 2 | Tool, concept, implementation and historical context are separate destinations whose connection the reader often has to reconstruct. |
| Flexibility and efficiency | 2 | Search is available globally; Vault title search and category alphabet support lookup. Pattern choices cannot be combined in the inspected catalogue; Timeline browsing is a long chronological list. |
| Aesthetic and minimalist design | 2 | Excellent material and restrained shell; repeated identity bands, large title blocks and uniform catalogue entries often precede the useful evidence. |
| Error recovery | 3 | Setup provides troubleshooting advice; 404 source offers clear destinations. This does not establish live editor or search failure handling. |
| Help and documentation | 3 | Substantial contextual prose and setup help exist, but finding the appropriate guide and seeing a successful first result need work. |
| **Total** | **25 / 40** | **Acceptable: significant targeted improvements needed.** |

## Strengths to preserve

1. The homepage demonstrates the promise with actual games, machine photographs, a bit-shift example and useful questions. Foundations likewise shows instruction and result. These are recognisable teaching decisions, not ornamental retro styling.
2. The Vault contents page's Commando → Rob Hubbard → SID → Arpeggio → HVSC relationships explain why each link matters. Its colour carries a labelled subject cue. This is an effective model for deeper connections elsewhere.
3. The curriculum respects independent entry points. Start Here, Spectrum getting-started and Meet Assembly make clear that BASIC, assembly and shared subjects are not compulsory preliminary stages for each other. Asm198x already has a substantive presence in those sources.

## Priority issues

### 1. P1 — Setup needs one clear recommended route, with Asm198x visible at the point of use

**Observed:** The setup index first asks readers to find the lesson and machine. Its system cards offer “Getting started” and “Alternative assembler setup”. The latter opens a large “Spectrum Native Setup” heading with instructions for Pasmo. Its introduction says Asm198x installs in one command, but gives neither that command nor a direct recommended-setup link there. The main Spectrum getting-started page does recommend Asm198x and supplies the command; the learner must find the relationship between these pages. The alternative title understates that it is specifically an alternative assembler route.

Asm198x is not absent. All four assembly track sources name it; all four main getting-started sources use it; Meet Assembly recommends it; the family page explains it; the footer links it. The missed opportunity is a clear, consistently placed explanation and route when the reader is about to assemble. `AssembleAndRun.astro` presents “Assemble and run” and “Edit the source, then assemble” without naming Asm198x in that visible control area. The NES control names it during assembly but its stable source link says “Assembler source”.

**Effect:** A beginner can treat a reference-tool alternative as the main setup, or use the browser assembler without understanding that the same family tool is available locally. Mobile spends its first screen on setup framing before showing the OS choice or any action.

**Recommendation:** Make each machine/language setup resolve an explicit choice: start in the browser where supported, or use the recommended local tools. Name Asm198x and explain that it turns source into the machine's output. Link directly to the applicable installation/build instructions beside the choice and browser assembler. Label reference-assembler alternatives by tool and purpose. Give each recommended path a supplied small source, exact expected output and return-to-lesson link; keep the ROM requirement beside the chosen emulator configuration. No universal browser or machine-support claim is warranted.

**Validation:** A first-time reader should identify the recommended assembler, find its installation route, and explain the source → assembled file → emulator relationship without visiting the family footer. Verify a real first-run result per configuration before claiming setup works. The Asm198x owning README confirms its assembler/disassembler role and the relevant dialects; this review did not execute installation commands or revalidate parity claims.

**Command:** `$impeccable onboard`, followed by `$impeccable clarify`.

### 2. P1 — Vault inner pages lose the editorial invitation of the contents page

**Observed:** Colour Clash and Clive Sinclair both open with a category band, a large title, subtitle, summary, rule, several paragraphs and a contents/details rail. The first substantial screen is mostly text. Colour Clash's useful visual evidence appears later than the explanation it could immediately clarify. The category's strong featured panel then gives way to 92 alphabetised technique entries, many named with specialist terms. “About this article” disclosures help density but still require a novice to know which title is promising.

**Effect:** The entry route promises discovery through evidence and connections; the inner route feels more like a generic encyclopaedia. This is editorial hierarchy and pacing, not an unreadable or fundamentally broken article template. Adding a decorative picture to every biography would not solve it.

**Recommendation:** Design an article opening around one concrete claim or question and the best existing evidence for it. For Colour Clash, bring a verified cell/sprite comparison into the opening, with the caption explaining the trade-off. Where no useful visual exists, let a strong text opening lead without stacking overlapping subtitle/summary/introduction roles. Keep sources and contents; make the rail useful with a few explained next connections, including a pattern or lesson only when relevant. Category pages can retain their full A–Z archive while offering a few question-led starting points and a scoped title lookup.

**Validation:** Compare one illustrated technique, one biography without new imagery and one hardware/reference entry at desktop and phone widths. Check that the main idea and next useful route are visible without flattening their different content needs.

**Command:** `$impeccable layout`, then `$impeccable typeset`.

### 3. P1 — Pattern Library offers classification before showing why a pattern helps

**Observed:** The opening presents a generic promise, totals, five platform choices, five categories and three difficulty levels. The rendering category presents many text entries grouped by machine. Hardware Sprites opens with description and two rows of chips, then Overview and a long listing; it has no article contents navigation in the template. The global homepage already links to Pattern Library, Vault and Timeline under its richer shared-subject examples. The concern is their relative explanatory weight, not missing homepage links.

The “PRODUCTION-READY CODE” kicker also conflicts with the Pattern Library specification's instruction to retain assumptions rather than hide them behind that label.

**Effect:** Readers must translate a problem into the library taxonomy before seeing an applicable result. The homepage demonstrates concepts and games much more persuasively than reusable implementations. A technically useful catalogue remains a secondary destination.

**Recommendation:** Lead with a real example of a problem solved, its visible result and the machine/language conditions. Keep machine/category/difficulty browsing as lookup aids. On a pattern, make problem, contract, implementation, costs and example-in-a-game easy to scan; distinguish a runnable sample from schematic code. Connect relevant lessons and Vault context with a reason, and return from a lesson to the reusable technique when useful. Replace the unconditional readiness claim with what has actually been built or checked.

**Validation:** Ask a reader looking for bounded sprite movement or a short sound to choose a suitable implementation and explain its assumptions. Ensure an experienced reader can still go straight to the code. Existing pattern URLs and categories need not change.

**Command:** `$impeccable shape` and `$impeccable clarify`.

### 4. P1 — Timeline counts events but does little to help readers understand a period

**Observed:** The index gives eleven decade cards equal structural emphasis, starting in the 1920s, with total and category counts. The 1980s page advertises 454 events and presents year jumps followed by a long stack of similarly weighted event panels. The opening says “golden age”, but supplies no concrete comparison or evidence that develops the claim. A card's total is not explained by its four displayed subtotals: the 1980s card shows 454 overall, then 27 systems, 184 games, 3 people and 10 world events.

**Source-backed coverage concern:** `getStartYear` on the index maps only people, companies, games, techniques, culture, hardware and systems. The Vault schema has dated fields for other subjects, including languages, software, tools, magazines and demos. Before making this a more prominent route, explicitly define which dated records it includes. A large event count does not establish a comprehensive chronology.

**Effect:** Visitors have a database navigation problem instead of a historical question to follow. Similar card weight makes landmark hardware, contextual events and biographical dates feel equally consequential. More entry links alone would send more people into the same undifferentiated list.

**Recommendation:** Keep the complete chronological browse, but give each period a short evidence-backed orientation and a small selection of connections worth exploring. Offer category filtering or clearly described subsets without hiding the complete archive. Let a machine or Vault article link into the relevant year/context. Explain event-count semantics and date precision, and reconcile the extraction against the intended scope before presenting it as complete.

**Validation:** A visitor entering in 1982 should be able to locate a machine, distinguish a dated event from background biography, and follow one meaningful contemporary connection. Verify counts against the same event set that is rendered. Timeline event colours are permitted by the family decision; the issue is meaning and hierarchy.

**Command:** `$impeccable shape`, then `$impeccable distill`.

### 5. P2 — Template families apply the shared identity with different page frames and opening costs

**Observed:** The homepage, Start Here and Foundations hold a coherent inset page frame. Pattern, Timeline, native setup and Craft start their body much nearer the browser edge under a full-width band; pattern detail then shifts the reading body inward. Vault article combines another inset reading column with a rail close to the opposite edge. Several pages repeat section identity in breadcrumb, masthead, eyebrow and title. These transitions are visible in successive screenshots even though the typography and paper remain familiar.

**Effect:** The site feels assembled from different generations of pages. Large opening stacks use the first phone screen before the content decision, and the changes in alignment weaken the family rhythm.

**Recommendation:** Align outer page gutters and establish consistent reading/browsing widths across the existing templates. Preserve purposeful full-bleed mastheads. Reduce repeated section labels and use heading scale according to the job: a reference detail does not need the same opening as a major landing page. Resolve this through the current design system, not a new visual language or sitewide decorative treatment.

**Validation:** Review a fixed comparison set—homepage, Vault category/article, pattern detail, Timeline decade and setup—at narrow, normal and wide desktop widths. Assess first useful action and reading measure as well as shared edges.

**Command:** `$impeccable layout` and `$impeccable polish`.

## Cognitive load

Using the critique checklist, the representative Pattern Library entry fails clear action hierarchy, one decision at a time, minimal choices and progressive disclosure: four failures, high load. It groups choices sensibly, but presents five platforms, five categories and three difficulty choices before a useful example. These are visible alternatives rather than thirteen facts everyone must memorise; the count alone is not proof of failure.

Timeline's decade list similarly fails those four items for an exploratory visitor: eleven similarly treated decades and many numeric summaries offer no chosen route. Its chronological grouping and year jumps remain useful for someone who already knows a date. Vault category browsing is moderate load: A–Z and disclosures help, while specialist titles still make recognition difficult. Setup is moderate load: choices are grouped, but the reader carries machine, language, local/browser and recommended/alternative tool context between pages. A single relevant recommendation would reduce that memory bridge.

## Emotional journey

The opening peak is tangible possibility: a game, a machine, a small change with an observable result. Start Here reassures readers that they can enter where curiosity leads. Vault contents offers a second peak by connecting people, software and hardware. The valley is a text-heavy catalogue or setup detour that asks the reader to classify or install before showing the next result. The satisfying end should be a visible success and a relevant continuation. The setup pages currently finish mainly with generic curriculum/back links; a successful first program would provide a stronger end. This is a design inference, not measured sentiment or abandonment data.

## Persona checks

- **First-time learner:** The setup index says to choose a lesson; the machine guide mixes BASIC and assembly; the alternative route is called “Native”. The next action is discoverable, but the reader has to interpret the tool choice. Make Asm198x's role explicit and keep the chosen route visible.
- **Experienced programmer adapting a technique:** Rendering Patterns has useful machine grouping, but no combined machine/technique view in the inspected UI. Hardware Sprites makes code available after a short overview; its missing local contents/contract navigation slows repeated reference. Do not turn the improvement into forced onboarding.
- **Distracted phone reader:** At 390 × 844 the Pattern Library screen ends before any platform choice, and the native setup screen ends before its OS tabs. The repeated section framing and explanatory introduction use the opening viewport. This is an opening-density observation; no claim is made about every mobile article or touch interaction.

## Smaller observations and follow-up questions

- Global search is consistently available in the header and exposes a keyboard hint in its accessible description. Vault title search is visibly labelled at its own entry. Functional search testing belongs to the parent's separate browser check; no search result-quality claim is made here.
- Spectrum getting-started exposes the raw `sinclair-zx-spectrum` slug in its breadcrumb, unlike the human-readable native setup breadcrumb.
- Pattern catalogue difficulty chips use colour while the detail template explicitly describes neutral difficulty chips. Investigate the actual computed contrasts and reconcile this local inconsistency; do not mistake the deliberate Vault palette for the same issue.
- Reference, biography and implementation pages should not all receive identical hero media. The material should determine what evidence earns that space.

Questions for the synthesis: Which setup result should demonstrate the recommended Asm198x path first? Which one pattern best shows the library's promise? Which historical connection makes the Timeline worth entering without already knowing a date?

Questions skipped in this sub-agent: the parent owns the user-facing synthesis and closing question.
