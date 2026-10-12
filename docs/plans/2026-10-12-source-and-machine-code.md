# Clarify source, translation and machine code

Agreed scope: correct the existing Foundations explanation and add a concrete
clarification to the Spectrum introduction. Keep the existing lesson sequence.

The current Foundations opening treats words versus numbers and translation time
as the whole distinction. This obscures that source is also stored as bytes,
assembly is source, compilers can produce native code, and an interpreter itself
executes as machine code while reading a different representation of the program.

1. Update `src/content/curriculum/foundations/from-source-to-silicon/index.mdx`
   and `unit-01.mdx` with definitions and the three routes. Preserve the toy
   machine and distinguish its invented instructions from real hardware.
2. Update `unit-02.mdx` to explain execution by an interpreter without implying
   that Spectrum BASIC creates new native instructions on every pass. Update
   `unit-03.mdx` to distinguish assembly from native compilation, explain the
   shared output, and give readers a way to check their understanding.
3. Update
   `src/content/curriculum/sinclair-zx-spectrum/assembly/meet-assembly/unit-01.mdx`
   with the actual bytes of its existing first two instructions, the meaning of
   native for the target, and the difference from the Spectrum BASIC interpreter.
   The feedback specifically mentions `DEFB`: compare an instruction with its
   manually supplied bytes, and clarify assembly time versus execution in
   `meet-assembly/unit-02.mdx`, where `DEFB` supplies picture data.
4. Verify the bytes by assembling the unchanged existing example. Check Spectrum
   token and ROM claims against Sinclair's manual, and compiler pipeline wording
   against primary tool documentation. Review the prose against the agreed
   beginner audience and the adjacent lessons.
5. Run the existing content checks and production build. Inspect the rendered
   changed pages, including the table, byte example and understanding check.
   Record results here. No new dependencies or executable lesson changes.

## Verification

- Asm198x and Pasmo both assemble the unchanged first program to
  `3E 02 D3 FE 18 FE`. Replacing `ld a,2` with `defb $3E,$02` preserves all
  six bytes. The negative control `defb $3E,$04` changes the operand byte to 04
  in both assemblers.
- In the built lesson's browser editor, the mnemonic and DEFB forms both render
  a red border (RGBA 194, 0, 0, 255). Changing the DEFB operand to 04 renders
  green (RGBA 0, 194, 0, 255). This checks the reader's actual experiment.
- `npm run check`: 31 test files and 227 tests passed, along with content,
  link, browser-asset and NES assembler checks.
- `npm run build`: 2,448 public pages built; shared frame checks and Pagefind
  passed. Existing prepared sibling samples, decoder and browser assets were used.
- All six edited pages return successfully at 1440px and 390px with no page
  overflow. Table row/column structure and the new expandable answer were checked.
  Screenshots of the mobile comparison table and desktop DEFB explanation were
  visually inspected.
- Chromium initially could not launch inside the sandbox (`Permission denied
  (1100)`); the approved launch outside it worked. The first browser check then
  reported `locator.click: Timeout 30000ms exceeded.` because its selector used
  a straight apostrophe where the renderer produces a curly one. After correcting
  the test selector, all browser checks passed. No product workaround was needed.
