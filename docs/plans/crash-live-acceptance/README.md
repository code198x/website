# CRASH! Live visitor acceptance — 12 October 2026

The flyer routes reach working assembly and BASIC lessons. The first BASIC
lesson needed an early route for touchscreen readers: its opening instructions
assumed a physical keyboard, while the editable listing appeared later without
an opening signpost. The correction links directly to that listing and explains
Run and Back to the listing. The website also consumes the published Spectrum
0.4.3 package, carrying the shared ROM-accurate BASIC tokeniser correction.

## Candidate and baseline

- Website baseline: `7f0caee5ec2000e5f814bb483a97d753430d863b`.
- Emu198x correction: PR #1742, merged as
  `a62248cf1303154c90d6b2d012e560bbaf31e50e`.
- npm publication: [workflow 38261456535](https://github.com/emu198x/emu198x/actions/runs/38261456535).
- `published-package.json` records the installed registry package's WASM hash.
  All 706 independent ROM-editor fixture bytes matched, and the refused listings
  threw errors. The fixtures are in Emu198x's
  `crates/emu198x-spectrum-web/tests/fixtures/rom-editor/` with public provenance.

## Checks

`scripts/verification/crash-live.mjs` follows the actual event-page links, both
the assembly CTA and the printed circles card's BASIC route. It checks edited
machine output, on-screen input, error/revert or reset, edited tape content and
checksums, pause/return/resume, restart and onward navigation. The restart check
requires a new INPUT session and a different result, so retained screen text
cannot pass it. `EXPECT_TOUCH_GUIDANCE=1` additionally follows the new jump link.

The profiles are Chromium 151.0.7922.34 desktop and Pixel 7 emulation, plus
WebKit 26.5 desktop and iPhone 13 emulation. These are browser profiles running
on a Mac, not measurements on those physical phones.

- `live/results.json`: initial deployed route observations. Chromium passed;
  both WebKit profiles exceeded a five-second final-navigation assertion.
- `webkit-recheck/results.json`: both complete WebKit journeys passed. The final
  navigation took 413 ms and 160 ms. A separate minimal navigation reproduction
  also passed. No production navigation code was changed; the intermittent
  observation is retained rather than labelled a fixed defect.
- `preview/results.json`: candidate journeys, including the new link, against
  the production build.
- `network/results.json` and `preview-network/results.json`: deliberately fail
  the first Spectrum WASM download, retry without reload, hold the second
  download while editing, then execute both the captured and subsequently
  edited source. Both browser engines passed. The check requires exactly two
  intercepted requests; an interception that never runs cannot pass.
- `sound/results.json` and `preview-sound/results.json`: existing lesson audio
  verification, including impact/boost samples, the BASIC 523 Hz tone, persisted
  sound choice, pause, Sound off, modal close and route cleanup. These measure
  samples delivered to the AudioWorklet, not listening quality.

The first candidate audio check completed its audio assertions but failed its
console-error gate with `net::ERR_SOCKET_NOT_CONNECTED` and
`net::ERR_CONNECTION_RESET` while served by Python's HTTP server. Retain that
failed run separately from the recheck using the project's normal Astro preview.
The recheck passed with no console errors. No error filter or production
workaround was added. The initial screenshot is retained as
`preview-sound/python-server-failure.png`.

## Hosted navigation follow-up

Website PR #681 merged as `a20246a6ee7a831f5a17ac1f193473945ef35a78`.
[Deployment 38263496641](https://github.com/code198x/website/actions/runs/38263496641)
served the new phone guidance and the exact published 0.4.3 WASM bytes; see
`published/deployment.json`.

The hosted journey completed in all four profiles, but WebKit desktop spent
18,566 ms reaching the next BASIC lesson (`published/results.json`). Tracing
the complete journey reproduced this in both WebKit profiles at 18,560 ms and
18,568 ms. The request to the slashless next-lesson URL failed with
`The request timed out.` Astro then recovered with a full document navigation.
The trace is in `published/navigation-timeout.json`. Page-local lifecycle events
were lost when that full navigation replaced the document.

Five minimal journeys took 74–275 ms. Separate minimal tape-download controls
also completed promptly. Those controls did not establish a download defect.
In the full journey, changing only the next link to the destination's canonical
trailing-slash URL before interaction produced 59 ms and 75 ms transitions,
without a failed request (`published/canonical-experiment.json`). The browser
experiment used `a.href = a.href.replace(/\/?$/, '/')` on the next-unit link.
The precise browser/network interaction behind the timeout remains unknown.

The bounded correction adds the missing slash to generated previous/next lesson
URLs. It preserves lesson selection and avoids the redundant redirect. The pager
regression compares links with the canonical URLs of their actual destinations
for BASIC, assembly and Foundations. Against the old build it failed with:

```text
Expected: "/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/"
Received: "/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer"
```

The visitor script again requires final navigation within five seconds; the
20-second diagnostic budget no longer allows the observed delay to pass.
The rebuilt production candidate passed all 10 learner-journey checks and all
four complete visitor profiles (`pager-preview/results.json`); the offline link
audit checked 227,289 references with zero errors.

## Native Safari

Safari 27.0 was also exercised through its native application UI in a separate
task tab. The live event CTA reached Meet Assembly. The source was edited to
`ld a,4`, run, and the green border visually observed. Revert restored the
original source before continuing to unit 2. On the candidate production
preview, the new BASIC jump link reached the listing; `10 PRINT "HELLO FROM
SAFARI"` ran and its actual screen text was read. Pause, close and the next
lesson link worked. The task tab was then closed.

## Loading observations

`loading/results.json` records a cold-cache Chromium Pixel 7 profile with
150 ms network latency and 1.6 Mbit/s download throughput, without CPU throttling.
The event heading appeared after 1,019 ms and the BASIC heading after 1,685 ms.
The BASIC program printed after 5,881 ms from tapping Run. Neither reading page
fetched the Spectrum WASM before Run. Observed layout-shift totals were 0.0024
and 0.0257. These are single observations, not worst-case limits or physical-phone
performance claims.

## Release validation and remaining boundaries

`npm run check:release` passed: 227 unit tests, seven announcement regressions,
content/prepared-asset checks, production build, 444 browser checks and the
offline link check (227,289 references, zero errors). The npm install reported
zero vulnerabilities. Full command logs are retained in the umbrella task output
directory alongside the named acceptance runs.

Physical phone use, audible quality on real speakers and an uncoached learner
trial remain unverified. Nothing here signs off every game, every audio pattern
or every page. The broader release checklist retains its existing scope.

To repeat the candidate journey, serve `dist/` with `npm run preview` and run:

```sh
EXPECT_TOUCH_GUIDANCE=1 node scripts/verification/crash-live.mjs http://127.0.0.1:1987 /tmp/crash-live-journey
node scripts/verification/crash-live-network.mjs http://127.0.0.1:1987 /tmp/crash-live-network
node scripts/verification/lesson-sound.mjs http://127.0.0.1:1987 /tmp/crash-live-sound
```

Each script closes its browser. Run sequentially; preserve the output before
removing temporary directories.
