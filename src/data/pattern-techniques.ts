/** Curated review prototype. Does not replace the pattern collection or its URLs. */
export const prototypeRoot = '/catalogue/pattern-library/';
export type Evidence = 'illustrative' | 'emulator-executed' | 'verified-component';
export interface Implementation { id: string; evidence: Evidence; evidenceStatement?: string; note: string }
export interface Technique {
  slug: string; title: string; task: string; summary: string; terms: string;
  explanation: string; contract: string; next: string[]; implementations: Implementation[];
  experiment: 'input' | 'pursuit';
}
export const techniques: Technique[] = [
  {
    slug: 'read-input', title: 'Read the controls', task: 'Find out what the player is holding.',
    summary: 'Read a keyboard, joystick or controller. Keep one sample for the rest of the update to use.',
    terms: 'keyboard keys joystick joypad controller buttons directions held poll sample',
    explanation: 'Holding Right is useful information every time we move. Pressing Fire once is a different question. First we need a dependable reader: what is down now, and how will our program represent it?',
    contract: 'The machine reader owns the details of its interface. Agree a logical button format before passing its result onwards. One reader can return a direction code; another can return several pressed bits. They need an explicit adapter, not an assumption that their bytes mean the same thing.',
    next: ['detect-presses'], experiment: 'input',
    implementations: [
      {id: 'sinclair-zx-spectrum/assembly/input/keyboard-reading', evidence: 'verified-component', evidenceStatement: '**Code status: the maintained matrix reader is reused by executed 48K callers.**', note: 'The maintained matrix reader has executed 48K callers. The single-code adapter adds priority and state rules; read those before using it.'},
      {id: 'commodore-64/assembly/input/joystick-reading', evidence: 'emulator-executed', note: 'Both joystick ports, PAL and NTSC, in Emu198x and VICE. Caller owns CIA1; keyboard keys were released. Keyboard coexistence and hardware checks are separate.'},
      {id: 'nintendo-nes/assembly/input/controller-reading', evidence: 'verified-component', evidenceStatement: '**Code status: maintained reader reused by executed NTSC NROM callers.**', note: 'Executed NTSC NROM callers check press, hold and release with DMC disabled. Read the button layout and DMC limits before connecting another routine.'},
      {id: 'commodore-amiga/assembly/input/joystick-reading', evidence: 'verified-component', evidenceStatement: '**Code status: the maintained reader is reused by executed Amiga callers.**', note: 'The maintained reader has executed A500 callers using physical port 2. Movement examples are adapters with their own bounds and frame-wait requirements.'},
    ],
  },
  {
    slug: 'detect-presses', title: 'Act once per press', task: 'Stop a held button repeating an action.',
    summary: 'Compare the current sample with the previous one. Holding a control and newly pressing it stay separate.',
    terms: 'edge detection fire one press single action menu held release repeat',
    explanation: 'A held button can make a character keep walking. A menu selection or a single shot often needs one event. Remember the preceding sample and we can tell the two apart.',
    contract: 'Here, 1 means held and 0 means released. Compute current AND NOT previous, limited to the input byte. Advance history once per update; consumers share that result. A press and release between samples can be missed. Entering a screen with a button held needs a deliberate policy.',
    next: ['trigger-sound'], experiment: 'input',
    implementations: [
      {id: 'cross-platform/input/edge-detection', evidence: 'illustrative', note: 'Pseudocode and integration fragments. Explains normalisation, sampling and held-input transitions; not a tested driver for every machine.'},
      {id: 'commodore-64/assembly/input/joystick-reading', evidence: 'emulator-executed', note: 'The same executed C64 example displays held controls and counts new Fire presses. One implementation can serve more than one technique.'},
      {id: 'commodore-amiga/assembly/input/joystick-edge-detection', evidence: 'verified-component', evidenceStatement: '**Code status: the maintained reader is reused by executed Amiga callers; the edge adapter has a 1,024-case CPU/state check.**', note: 'The edge adapter has 1,024 synthetic CPU/state cases. Joystick decoding uses the reader’s separate A500 port-2 evidence; movement adapters need their own checks.'},
    ],
  },
  {
    slug: 'trigger-sound', title: 'Trigger a sound', task: 'Give an action an audible response.',
    summary: 'Turn one game event into a sound. The driver decides how it starts, ends and shares the machine.',
    terms: 'sound audio beep note trigger effect sid beeper feedback',
    explanation: 'One new Fire press can make one sound event. That does not tell us how to play it. A CPU-driven beep and a note on a synthesiser need different routines, different ownership and different timing.',
    contract: 'Name the sound resource and who owns it. Decide when to stop or release it, and whether the routine occupies the CPU while it sounds. The browser tone below only demonstrates event wiring; it does not reproduce either machine.',
    next: [], experiment: 'input',
    implementations: [
      {id: 'commodore-64/assembly/audio/sid-note-trigger', evidence: 'emulator-executed', note: 'PAL C64 in Emu198x, started through ROM RUN. One SID voice; the caller owns volume, filtering and coordination with other writers.'},
      {id: 'sinclair-zx-spectrum/assembly/audio/sound-beep', evidence: 'emulator-executed', note: '48K PAL Spectrum in Emu198x, interrupts disabled during tones. This is a different timing contract from the SID routine.'},
    ],
  },
  {
    slug: 'choose-a-target', title: 'Choose a target, then a turn', task: 'Make a pursuer aim somewhere different.',
    summary: 'Change where an opponent aims without changing how it chooses its next legal step.',
    terms: 'enemy chase anticipate ahead pursuit ai ghost pac-man target movement turn',
    explanation: 'An opponent aiming at our position can feel different from one aiming ahead. The Pac-Man study gives us a reason to separate two jobs: choosing the target and choosing the next turn. We can inspect each job on a small original board.',
    contract: 'This browser example chooses a legal neighbouring tile with the smallest squared distance to its target. Ties use Up, Left, Down, Right. It permits reversal and has no chase/scatter clock, original maze or historical offset quirks. Two tiles ahead is our experiment, not a claim to reproduce a particular Pac-Man ghost.',
    next: [], implementations: [], experiment: 'pursuit',
  },
];
