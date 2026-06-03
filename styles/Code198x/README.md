# Code198x prose style (Vale)

Advisory prose rules encoding the project's [Writing Principles](../../../docs/specifications) and Design Context voice. **Everything is a suggestion, not a gate.** The point is to catch the *avoidable* kind of difficulty — bloated words, filler, condescension, American spellings — without touching the legitimate difficulty of the subject matter.

Run from `website/`:

```bash
npm run prose:style   # Vale — words, voice, spelling
npm run prose:read    # readability + long-sentence report (sentence length)
npm run prose:check   # both
```

## Rules

| Rule | Maps to | Notes |
|------|---------|-------|
| `Substitutions` | "short words beat long ones", "tighten in sweeps" | Long word / redundant phrase → plainer form. High precision. Omits domain-legit words like "initialise". |
| `Weasel` | "non-essential information is an obstacle" | Intensifiers and hedges that add words, not meaning (very, really, a lot…). |
| `Condescending` | Design Context — "never condescending" | simply, obviously, trivial, easy… Words that sting a stuck learner. **"just" is deliberately excluded** — too common and usually legitimate. |
| `BritishEnglish` | Critical Rule — British English | Clear American spellings (color→colour). Omits "program" (the documented exception), "-ise/-ize" (both valid British), and "meter" (a gauge is a meter; only the length unit is "metre"). |
| `Passive` | "strong verbs, active voice" | **OFF by default** (`Code198x.Passive = NO` in `.vale.ini`). Regex passive-detection is the noisiest rule, and passive is often correct in hardware prose. Toggle on for an occasional skim. |

## Why readability lives in a separate script

Readability formulas (Flesch-Kincaid, Fog) inflate grade level for unavoidable domain nouns ("Commodore", "emulator") and choke on tables, so their absolute scores are noisy. Vale can't measure sentence length anyway. `scripts/prose-report.mjs` owns that signal — the one genuinely actionable number is **sentences over ~30 words**, the splittable kind of sprawl. The curriculum currently averages grade 5.7; the vault (adult reference) runs higher by design.

## Tuning

Add or remove tokens in the `.yml` files. Re-run `npm run prose:style` and check the hit count stays proportionate (a rule firing hundreds of times is noise, not signal — see the "just" and Passive decisions above).
