export interface ModelView {
  id: string;
  label: string;
  alt: string;
}

export interface HardwareModel {
  system: string;
  name: string;
  variant: string;
  vaultSystem?: string;
  description: string;
  views: ModelView[];
  credit?: { label: string; href: string };
}

export const hardwareModels: HardwareModel[] = [
  {
    system: 'commodore-amiga', name: 'Commodore Amiga', variant: 'Amiga 500 · UK keyboard',
    description: 'The wedge-shaped case, full keyboard and built-in disk drive of the Amiga 500.',
    views: [
      { id: 'front', label: 'Front', alt: '3D illustration of an Amiga 500 viewed from above its front-right corner' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close 3D illustration of the Amiga 500 UK keyboard, with dished keys and paired legends' },
      { id: 'top', label: 'Above', alt: '3D illustration of the Amiga 500 from directly above, showing its keyboard layout and rear ventilation' },
    ],
  },
  {
    system: 'commodore-64', name: 'Commodore 64', variant: 'Breadbin case',
    description: 'The brown keyboard, rainbow badge and curved case of the original breadbin design.',
    credit: { label: 'Keycap typeface: Levente Szabadkai · CC0', href: 'https://github.com/szabadkai/c64-keyboard-font' },
    views: [
      { id: 'front', label: 'Front', alt: '3D illustration of a Commodore 64 breadbin, with brown keys and a rainbow badge' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close 3D illustration of the C64 keyboard, including the front-face graphic symbols' },
      { id: 'rear', label: 'Rear', alt: '3D illustration showing the C64 rear connectors and their recessed surrounds' },
    ],
  },
  {
    system: 'sinclair-zx-spectrum', name: 'Sinclair ZX Spectrum', variant: '48K rubber-key model',
    description: 'A small black case with a rubber keyboard, colour commands and the familiar rainbow stripe.',
    views: [{ id: 'front', label: 'Front', alt: '3D illustration of a rubber-key ZX Spectrum 48K, with its printed metal faceplate and rainbow stripe' }],
  },
  {
    system: 'nintendo-entertainment-system', name: 'Nintendo Entertainment System', variant: 'NES-001 front loader',
    description: 'The cartridge flap, two-tone shell and front controller sockets of the NES-001.',
    views: [
      { id: 'front', label: 'Front', alt: '3D illustration of an NES-001 front-loading console with its cartridge flap closed' },
      { id: 'rear', label: 'Rear', alt: '3D illustration of the NES-001 viewed from behind, showing its rear connectors' },
    ],
  },
  {
    system: 'game-boy', name: 'Nintendo Game Boy', variant: 'Original DMG',
    description: 'The original handheld, with its recessed screen, directional pad and removable battery cover.',
    credit: { label: 'Shell reference scans: Wesk · Unlicense', href: 'https://bitbuilt.net/forums/threads/dmg-gameboy-scan.4479/' },
    views: [
      { id: 'front', label: 'Front', alt: '3D illustration of an original Game Boy with its grey shell, green screen and magenta buttons' },
      { id: 'rear', label: 'Rear', alt: '3D illustration of the Game Boy rear shell and fitted battery cover' },
      { id: 'side', label: 'Side', alt: 'Side-view 3D illustration of the original Game Boy case and controls' },
    ],
  },
  {
    system: 'bbc-micro', name: 'BBC Micro', variant: 'Model B',
    description: 'The cream case, black keyboard and red function-key row of the BBC Micro Model B.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of a BBC Micro Model B, with a cream case, dark base and red function keys' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close rendered illustration of the BBC Micro keyboard and indicator lights' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the BBC Micro Model B viewed from directly above' },
    ],
  },
  {
    system: 'sinclair-zx81', name: 'Sinclair ZX81', variant: 'UK keyboard study',
    description: 'The flat membrane keyboard, raised rear deck and black case of the ZX81.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of a black Sinclair ZX81 with a UK membrane keyboard and raised rear deck' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close rendered illustration of the ZX81 membrane keys and printed BASIC commands' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Sinclair ZX81 viewed from directly above' },
    ],
  },
  {
    system: 'sega-master-system', name: 'Sega Master System', variant: 'Master System I · overseas Power Base',
    description: 'The raised centre, red panel and front controller sockets of the original overseas Master System.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of a Master System I Power Base, with a red control panel and two front controller sockets' },
      { id: 'controls', label: 'Controls', alt: 'Close rendered illustration of the Master System reset and pause buttons and printed connection diagram' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Master System I Power Base from above, showing its cartridge slot and controls' },
    ],
  },
  {
    system: 'commodore-vic-20', name: 'Commodore VIC-20', variant: 'Brown keyboard · gold badge',
    description: 'A rounded cream case with brown keys, tan function keys and a gold VIC-20 badge.',
    credit: { label: 'Keycap typeface: Levente Szabadkai · CC0', href: 'https://github.com/szabadkai/c64-keyboard-font' },
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of a Commodore VIC-20 with a rounded cream case, brown keyboard and tan function keys' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close rendered illustration of the VIC-20 keyboard, including front-face graphics, colour names and Commodore marks' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Commodore VIC-20 viewed from directly above' },
    ],
  },
  {
    system: 'acorn-electron', name: 'Acorn Electron', variant: 'Original unexpanded case',
    description: 'The cream keyboard, front-face BASIC shortcuts and dark grid strip of the Acorn Electron.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of an Acorn Electron with a cream keyboard and dark strip carrying the acorn electron wordmark' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close rendered illustration of the Electron keyboard and its front-face BASIC shortcuts' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Acorn Electron viewed from directly above' },
    ],
  },
  {
    system: 'atari-800', name: 'Atari 800XL', variant: '800XL · cream and charcoal case', vaultSystem: 'atari-8-bit',
    description: 'The 800XL keyboard, silver console buttons and cartridge shutters from the Atari 8-bit family.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of an Atari 800XL with a charcoal keyboard deck, cream rear case and silver controls' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close rendered illustration of the Atari 800XL keyboard and silver console-button column' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Atari 800XL from directly above, showing its cartridge shutters and five console buttons' },
    ],
  },
  {
    system: 'amstrad-cpc', name: 'Amstrad CPC 464', variant: 'CPC 464 · English keyboard',
    description: 'The dark case, colourful keyboard and built-in cassette recorder of the CPC 464.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of an Amstrad CPC 464, with a dark case, green modifiers, blue Enter keys and built-in cassette recorder' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close rendered illustration of the CPC 464 keyboard, cursor keys, numeric pad and cassette controls' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Amstrad CPC 464 viewed from directly above' },
      { id: 'low-angle', label: 'Low angle', alt: 'Low-angle rendered illustration showing the CPC 464 key profiles and case moulding' },
    ],
  },
  {
    system: 'atari-st', name: 'Atari 520ST', variant: 'Original short case',
    description: 'The slanted function keys, pale keyboard and diagonal rear grille of the short-case 520ST.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of an original short-case Atari 520ST, with slanted function keys and a diagonal rear ventilation grille' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Close rendered illustration of the Atari 520ST keyboard, rounded function-key fronts and numeric pad' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the original short-case Atari 520ST viewed from directly above' },
      { id: 'low-angle', label: 'Low angle', alt: 'Low-angle rendered illustration showing the Atari 520ST key profiles and rounded rear shoulder' },
    ],
  },
  {
    system: 'sega-mega-drive', name: 'Sega Mega Drive', variant: 'Japanese Model 1 · HAA-2500',
    description: 'The circular cartridge deck, red power badge and front controls of the original Japanese Mega Drive.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Japanese Model 1 · HAA-2500, viewed from above its front-right corner' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Japanese Model 1 · HAA-2500 viewed from directly above' },
      { id: 'controls', label: 'Controls', alt: 'Close rendered illustration of the Japanese Model 1 · HAA-2500 cartridge opening and controls' },
      { id: 'rear', label: 'Rear', alt: 'Rendered illustration of the Japanese Model 1 · HAA-2500 viewed from behind' },
    ],
  },
  {
    system: 'super-nintendo', name: 'Super Nintendo', variant: 'PAL SNES',
    description: 'The raised deck, curved cartridge opening and recessed controls of the PAL Super Nintendo.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the PAL SNES, viewed from above its front-right corner' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the PAL SNES viewed from directly above' },
      { id: 'controls', label: 'Controls', alt: 'Close rendered illustration of the PAL SNES cartridge opening and controls' },
      { id: 'rear', label: 'Rear', alt: 'Rendered illustration of the PAL SNES viewed from behind' },
      { id: 'low-angle', label: 'Low angle', alt: 'Low-angle rendered illustration of the PAL SNES showing its raised deck and inset lower case' },
    ],
  },
  {
    system: 'atari-2600', name: 'Atari 2600', variant: 'Six-switch VCS · Light sixer',
    description: 'The woodgrain fascia, ribbed upper case and six switches of the Atari VCS.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Six-switch VCS · Light sixer, viewed from above its front-right corner' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Six-switch VCS · Light sixer viewed from directly above' },
      { id: 'controls', label: 'Controls', alt: 'Close rendered illustration of the Six-switch VCS · Light sixer cartridge opening and controls' },
      { id: 'rear', label: 'Rear', alt: 'Rendered illustration of the Six-switch VCS · Light sixer viewed from behind' },
    ],
  },
];

export const hardwareModelFor = (system: string) => hardwareModels.find(model => model.system === system);
export const hardwareModelForVault = (system: string) => hardwareModels.find(model => (model.vaultSystem ?? model.system) === system);
export const modelImage = (system: string, view: string, width = 1280) => `/images/models/${system}-${view}-${width}.webp`;
export const modelSrcset = (system: string, view: string) => [640, 1280, 1920].map(width => `${modelImage(system, view, width)} ${width}w`).join(', ');
