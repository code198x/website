# Show what each pattern's evidence establishes

F1's multiplexer correction is merged. The assessment also asks readers to be
able to distinguish illustrative code from assembled and executed examples.
The existing Pattern Library specification already requires that distinction.

The 71 entries currently have no consistent statement beside their code.
Six maintained assembly examples retain execution results whose 15 source
hashes match the current samples. Four BASIC entries include maintained
subroutines. The other 61 entries provide illustrative fragments or pseudocode;
a linked lesson's execution does not certify that fragment on its own.

1. Add a short **Code status** paragraph to each existing MDX entry before its
   first section. Use the current prose format, without new schema fields or
   components. State the configuration and link the retained record for each
   executed example. Name BASIC listings as maintained subroutines, without
   promoting a source include to execution evidence. Label the remaining code
   as illustrative and explain that it needs integration and checking.
2. Keep existing contracts and source intact. Original-hardware validation is
   a separate claim and none of the six execution records establishes it.
3. Verify all 71 paragraphs are rendered, all evidence links resolve to
   tracked files in the exact samples revision, and the six records still match
   the included sources. Build the site and exercise representative executed,
   BASIC and illustrative pages in the existing desktop/mobile browser suite.
   Make the check reject a missing status before trusting the complete pass.

This closes the evidence-labelling gap. It does not claim to have assembled or
executed the 61 illustrative entries.

## Verification

- Production build: 2,448 pages; shared-frame verification passed. Content
  checks and Ruff passed.
- The retained `verify.py --samples /path/to/code-samples` checks all 71 built
  status statements, ten immutable source/evidence links and 15 matching source
  hashes. `results.json` records six executed, four maintained BASIC, fifty
  illustrative code and eleven illustrative pseudocode entries.
- All twelve Pattern Library browser checks passed across desktop and mobile.
  Removing Hardware Sprites' status paragraph from the built page first made
  the new browser assertion fail: expected one statement, received zero. The
  built file was restored byte-for-byte before the passing suite.
- The first browser attempts could not exercise assertions: a port was already
  occupied, then the sandbox denied Chromium's macOS Mach port registration.
  A free port and authorised browser execution resolved those environment
  failures; they are not counted as the negative control.
- Build, content, intentional failure and passing browser logs are retained
  alongside this plan, compressed without altering their contents.
