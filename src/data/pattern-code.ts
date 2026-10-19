/** Maintained sources and caller contracts for the unpublished library prototype. */
export const machines = [
  {id:'commodore-64',name:'Commodore 64',cpu:'6502 · ACME'},
  {id:'sinclair-zx-spectrum',name:'ZX Spectrum',cpu:'Z80 · Pasmo'},
  {id:'commodore-amiga',name:'Amiga',cpu:'68000 · Motorola'},
  {id:'nintendo-nes',name:'NES',cpu:'6502 · ca65'},
] as const;
export type Machine = typeof machines[number]['id'];
export const sampleBase=(machine:Machine)=>`${machine}/patterns/assembly/framework/input-to-sound`;
export const sourceRoot='https://github.com/code198x/code-samples/blob/prototype/pattern-library-usable-code/';
export const codeVersions = {
 'commodore-64': {
  read:'commodore-64/patterns/assembly/input/joystick-reading/joystick.inc',
  presses:'commodore-64/patterns/assembly/input/joystick-reading/joystick.inc',
  sound:'commodore-64/patterns/assembly/audio/sid-note-trigger/sid-note.inc',
  usage:sampleBase('commodore-64')+'/demo.asm',
  held:'joy2',fresh:'joy2_new',fire:'$10',
  result:'Both ports return pressed bits: Up=1, Down=2, Left=4, Right=8, Fire=16. This caller uses case-labelled port 2.',
  init:'Call joy_init once, with I/O visible, CIA1 keyboard scanning stopped and timer port outputs disabled. It clears both held masks, new-press masks and counters. The complete caller below performs the takeover.',
  update:'Call joy_poll once per update. It reads both ports and derives their new presses together. Use joy2 for movement and joy2_new for actions; do not poll again for each consumer.',
  owns:'The reader owns CIA1 ports and six state bytes; A, X and flags change, Y survives. Keep keyboard keys released. The sound routines own one selected SID voice; A and flags change, X/Y survive. Master volume, filtering and other writers belong to the caller.',
  timing:'SID sound continues after the call. This caller releases the gate after six updates, even if Fire stays held. Release continues in the SID while the game runs. The frequency value targets PAL; NTSC needs a different pitch value.',
  evidence:'C64 composition executed in VICE 3.10 PAL: 14 held/released/repressed stages, trigger counts, gate duration and SID control writes checked. The reused reader and SID routines also have their own published execution records. No original-hardware claim.',
 },
 'sinclair-zx-spectrum': {
  read:sampleBase('sinclair-zx-spectrum')+'/input.inc',presses:sampleBase('sinclair-zx-spectrum')+'/presses.inc',
  sound:'sinclair-zx-spectrum/patterns/assembly/audio/sound-beep/sound-beep.inc',
  usage:sampleBase('sinclair-zx-spectrum')+'/use.asm',held:'controls',fresh:'new_presses',fire:'$10',
  result:'QAOP and Space return simultaneous held bits: Up=1, Down=2, Left=4, Right=8, Fire=16. This differs from the older single-direction example.',
  init:'Call initialise_input once. The fragment disables interrupts and clears previous_controls and the shared ULA output byte. Include input.inc, presses.inc and sound-beep.inc once in your own program.',
  update:'Call update_input once from your update loop. read_controls samples QAOP and Space; detect_presses compares the stored byte with the previous sample. Both held controls and new presses remain available to the rest of the update.',
  owns:'The reader changes AF, B and C; detect_presses changes AF and B. The beep changes AF, B, D and L. Keep the state in writable RAM and agree a shared ula_output byte with all border, MIC and speaker writers.',
  timing:'This 48K beeper routine blocks until its click finishes, with interrupts disabled. The rest of the game pauses during it. It is suitable for a short click; continuous music needs a different design. Do not add HALT to this interrupt-disabled caller.',
  evidence:'The new reader, edge routine and integration fragment have been assembled together. They have not been execution-tested as a combined program. The reused sound-beep routine has a separate published 48K PAL Emu198x execution record.',
 },
 'commodore-amiga': {
  read:sampleBase('commodore-amiga')+'/input.inc',presses:sampleBase('commodore-amiga')+'/presses.inc',
  sound:'commodore-amiga/patterns/assembly/audio/playing-a-sample/paula-sample.inc',
  usage:sampleBase('commodore-amiga')+'/use.asm',held:'controls',fresh:'new_presses',fire:'$0010',
  result:'Physical port 2: directions from JOY1DAT, Fire from CIA-A bit 7. The stored word uses Up=$0100, Down=$0001, Left=$0200, Right=$0002, Fire=$0010.',
  init:'Start inside a program that owns the controller and audio channel 0. Put $DFF000 in A5 and call initialise_input. Keep the channel off for at least a frame before the first update; the shown period is 424.',
  update:'Call update_input once per PAL frame. The caller starts the looping sample on a new Fire press and stops it on release. BTST on memory is byte-sized, so the fragment tests bit 4 in controls+1, the low byte of the word.',
  owns:'Reader and edge routines change D0/D1 and condition codes. A5 must remain the custom-chip base. The sound driver preserves registers but needs caller-supplied A0/D0/D1/D2. State must be writable; sample data must be even-aligned chip RAM. This is a hardware-owning caller, not an AmigaDOS-safe channel allocator.',
  timing:'Paula fetches samples while the CPU continues. This driver repeats its sample until stop_sample; it is not a one-shot effect. The channel must remain off for more than two sample periods before restarting. The caller’s once-per-frame policy and period 424 provide that gap.',
  evidence:'The new reader, edge routine, caller and sample data have been assembled together as a Hunk executable. The combined program has not been executed. The reused Paula driver has its own published A500 OCS PAL cold-boot execution record.',
 },
 'nintendo-nes': {
  read:sampleBase('nintendo-nes')+'/input.inc',presses:sampleBase('nintendo-nes')+'/presses.inc',sound:sampleBase('nintendo-nes')+'/tone.inc',
  usage:sampleBase('nintendo-nes')+'/use.asm',held:'controls',fresh:'new_presses',fire:'$80',
  result:'The NES keeps its own layout: A=$80, B=$40, Select=$20, Start=$10, Up=$08, Down=$04, Left=$02, Right=$01. A is the action button here.',
  init:'Include the three .inc files once in a ca65 program with writable BSS. Call initialise_input from your startup code. .res allocates RAM; it does not clear it. This bounded caller starts with the other audio channels disabled and no DMC playback.',
  update:'Call update_input once per update, after your normal frame synchronisation. read_controls latches and shifts eight controller bits. detect_presses keeps the previous byte. A new A press starts pulse 1; releasing A stops it.',
  owns:'The reader changes A/X and flags; edge and tone routines change A and flags. Y survives. The caller owns pulse 1 and the shared $4015 enable mask. Do not also write these registers in an NMI or music driver. This simple controller reader assumes no DMC sample DMA.',
  timing:'Pulse 1 continues after tone_on returns; tone_off disables that channel. The fixed timer $0FD is about 440 Hz on NTSC. PAL needs a different value. This is a bounded pulse caller, not a music engine or DMC-safe input routine.',
  evidence:'Reader, edge routine, pulse driver and caller have been assembled and linked together. They have not been executed as a cartridge. The fragment assumes an existing NES reset, frame synchronisation, memory map and vectors; it is not a complete bootable game.',
 },
} satisfies Record<Machine,Record<string,string>>;
