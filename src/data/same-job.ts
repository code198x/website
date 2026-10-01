/**
 * "Same job, different machine": the homepage explorer's one job (paint the
 * screen red) in every language each live machine is taught in.
 *
 * Keyed by system id, then by the track slug the module catalogue uses
 * (src/content/modules/<system>/<track>.yaml). The homepage checks both ways
 * at build time: every taught track needs a snippet here, and every snippet
 * needs a catalogue track, so the language count it shows is the catalogue's.
 *
 * Colours are the emulator's own, so the small TV shows what the machine
 * really paints. Each is from Emu198x's palette for that machine:
 *
 * - Spectrum: crates/common-sinclair-zx-spectrum/src/palette.rs, red (2)
 *   #C20000 and white (7) #C2C2C2, the border and paper at power-on.
 * - C64: crates/mos-vic-ii/src/palette.rs (VICE PAL), red (2) #883932, light
 *   blue (14) #7868C0 for the border and blue (6) #40318D for the screen at
 *   power-on.
 * - Amiga: COLOR00 = $F00 is full red, #FF0000.
 * - NES: crates/ricoh-ppu-2c02/src/palette.rs, $16 = #B53120.
 *
 * `fill` says what the machine paints: the border only, or the whole screen
 * (the NES has no separate border; colour 0 is the Amiga's background and
 * border alike). A machine with no `border0`/`paper` starts dark.
 */
export interface SameJob {
  red: string;
  border0?: string;
  paper?: string;
  fill: 'border' | 'screen';
  note: string;
  /** Track slug → the language's name and the snippet. */
  langs: Record<string, { label: string; code: string }>;
}

export const sameJob: Record<string, SameJob> = {
  'sinclair-zx-spectrum': {
    red: '#c20000', border0: '#c2c2c2', paper: '#c2c2c2', fill: 'border',
    note: 'The ULA paints the border. The paper inside stays as it was.',
    langs: {
      basic: { label: 'Sinclair BASIC', code: 'BORDER 2' },
      assembly: { label: 'Z80 assembly', code: 'ld   a,2       ; red\nout  ($fe),a   ; set the border' },
    },
  },
  'commodore-64': {
    red: '#883932', border0: '#7868c0', paper: '#40318d', fill: 'border',
    note: 'The border is one VIC-II register; the screen inside is the next one along.',
    langs: {
      basic: { label: 'Commodore BASIC', code: 'POKE 53280,2' },
      assembly: { label: '6510 assembly', code: 'lda  #2        ; red\nsta  $d020      ; border colour' },
    },
  },
  'commodore-amiga': {
    red: '#ff0000', fill: 'screen',
    note: 'Colour 0 is the background, border and all, so the whole screen turns red.',
    langs: {
      amos: { label: 'AMOS', code: 'Colour 0,$F00' },
      blitz: { label: 'Blitz BASIC', code: 'RGB 0,15,0,0' },
      assembly: { label: '68000 assembly', code: 'move.w #$0f00,$dff180 ; COLOR00' },
    },
  },
  'nintendo-entertainment-system': {
    red: '#b53120', fill: 'screen',
    note: "There is no border. The backdrop colour fills whatever the tiles don't cover.",
    langs: {
      assembly: {
        label: '6502 assembly',
        code: 'lda  #$3f\nsta  $2006      ; address high\nlda  #$00\nsta  $2006      ; $3f00: backdrop\nlda  #$16       ; red\nsta  $2007',
      },
    },
  },
};
