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
  systemPage?: string;
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
  {
    system: 'sega-game-gear', name: 'Sega Game Gear', variant: 'Original Game Gear',
    description: 'The broad black handheld, colour-screen surround and blue Start button of the Game Gear.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Sega Game Gear handheld with a black case, directional pad and blue Start button' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Game Gear from directly above' },
      { id: 'controls', label: 'Controls', alt: 'Rendered illustration of the Game Gear screen surround and controls' },
    ],
  },
  {
    system: 'neo-geo', name: 'Neo Geo AES', variant: 'AES home console · main unit',
    description: 'The curved black shell, cartridge opening and gold lettering of the Neo Geo AES.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Neo Geo AES main unit with a curved black shell and gold lettering' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Neo Geo AES cartridge opening and top controls' },
      { id: 'controls', label: 'Controls', alt: 'Rendered illustration of the Neo Geo AES cartridge opening and controls in close view' },
    ],
  },
  {
    system: 'vectrex', name: 'Vectrex', variant: 'Main unit · controller excluded',
    description: 'The upright screen housing, recessed bezel and built-in handle of the Vectrex.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Vectrex upright main unit viewed from its front-right corner' },
      { id: 'straight-on', label: 'Straight on', alt: 'Rendered illustration of the Vectrex screen and recessed front bezel viewed straight on' },
      { id: 'rear', label: 'Rear', alt: 'Rendered illustration of the Vectrex rear housing, ventilation and handle' },
    ],
  },
  {
    system: 'commodore-128', name: 'Commodore 128', variant: 'Original C128 · integrated keyboard',
    description: 'The pale case, numeric pad and grouped function keys of the original Commodore 128.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Commodore 128 with a pale case, full keyboard and numeric pad' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Commodore 128 viewed from directly above' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Rendered illustration of the Commodore 128 keyboard, numeric pad and grouped function keys' },
    ],
  },
  {
    system: 'oric-atmos', name: 'Oric Atmos', variant: 'Atmos · black case and red modifiers',
    description: 'The compact black case, red modifier keys and black spacebar of the Oric Atmos.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Oric Atmos with a compact black case and red modifier keys' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Oric Atmos viewed from directly above' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Rendered illustration of the Oric Atmos keyboard with red modifiers and a black spacebar' },
    ],
  },
  {
    system: 'msx', name: 'Toshiba HX-10', variant: 'MSX · Toshiba HX-10',
    description: 'The Toshiba HX-10 implementation of the MSX standard, with blue cursor keys and a pale keyboard.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of a Toshiba HX-10 MSX computer with a pale keyboard and blue cursor keys' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Toshiba HX-10 MSX computer viewed from directly above' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Rendered illustration of the Toshiba HX-10 keyboard with blue cursor keys, red STOP and green GRAPH' },
    ],
  },
  {
    system: 'thomson-mo5', name: 'Thomson MO5', variant: 'MO5 · French rubber keyboard',
    description: 'The low rubber keys, French AZERTY layout and outlined MO5 wordmark of the Thomson MO5.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Thomson MO5 with a French rubber keyboard and outlined MO5 wordmark' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the Thomson MO5 viewed from directly above' },
      { id: 'keyboard', label: 'Keyboard', alt: 'Rendered illustration of the Thomson MO5 French AZERTY rubber keyboard' },
    ],
  },
  {
    system: 'robotron-kc85', name: 'KC85/3', variant: 'Mühlhausen KC85/3 · main unit',
    description: 'The module covers, cream connection strip and top vent banks of the Mühlhausen KC85/3.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the Mühlhausen KC85/3 main unit with module covers and a cream connection strip' },
      { id: 'straight-on', label: 'Straight on', alt: 'Rendered illustration of the KC85/3 module covers, connection strip and power switch viewed straight on' },
      { id: 'top', label: 'Above', alt: 'Rendered illustration of the KC85/3 top vent banks viewed from above' },
    ],
  },
  {
    system: 'sharp-x68000', name: 'Sharp X68000', variant: 'Original CZ-600C · main unit',
    description: 'The twin towers, central bridges and paired vertical drive slots of the original X68000.',
    views: [
      { id: 'front', label: 'Front', alt: 'Rendered illustration of the original Sharp X68000 main unit with twin towers and vertical drive slots' },
      { id: 'straight-on', label: 'Straight on', alt: 'Rendered illustration of the Sharp X68000 twin towers, drive slots and base connections viewed straight on' },
      { id: 'side', label: 'Side', alt: 'Rendered illustration of the Sharp X68000 case depth and twin-tower profile from the side' },
    ],
  },
  {
    system: "apple-ii", name: "Apple II", variant: "Apple II Plus",
    description: "The deep rear lid, rainbow badge and raised keyboard of the Apple II Plus.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of Apple II: view from above the front-right corner" },
      { id: "top", label: "Above", alt: "Rendered illustration of Apple II: view from directly above" },
      { id: "keyboard", label: "Keyboard", alt: "Rendered illustration of Apple II: close view of the keyboard" },
      { id: "low-angle", label: "Low angle", alt: "Rendered illustration of Apple II: low-angle view showing the case and controls" },
    ],
  },
  {
    system: "macintosh", name: "Apple Macintosh", variant: "Macintosh 128K \u00b7 main unit",
    description: "The upright case, recessed screen and front disk slot of the Macintosh 128K.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of Apple Macintosh: view from above the front-right corner" },
      { id: "straight-on", label: "Straight on", alt: "Rendered illustration of Apple Macintosh: view from the front" },
      { id: "rear", label: "Rear", alt: "Rendered illustration of Apple Macintosh: view from behind" },
    ],
  },
  {
    system: "atari-400", name: "Atari 400", variant: "Atari 400 \u00b7 membrane keyboard",
    systemPage: "atari-800",
    description: "The membrane keyboard, console buttons and cartridge-lid shoulder of the Atari 400.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of Atari 400: view from above the front-right corner" },
      { id: "top", label: "Above", alt: "Rendered illustration of Atari 400: view from directly above" },
      { id: "keyboard", label: "Keyboard", alt: "Rendered illustration of Atari 400: close view of the keyboard" },
    ],
  },
  {
    system: "acorn-archimedes", name: "Acorn A3010", variant: "A3010 \u00b7 UK keyboard",
    description: "The green function keys, numeric pad and integrated case of the Acorn A3010.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of Acorn A3010: view from above the front-right corner" },
      { id: "top", label: "Above", alt: "Rendered illustration of Acorn A3010: view from directly above" },
      { id: "keyboard", label: "Keyboard", alt: "Rendered illustration of Acorn A3010: close view of the keyboard" },
      { id: "low-angle", label: "Low angle", alt: "Rendered illustration of Acorn A3010: low-angle view showing the case and controls" },
    ],
  },
  {
    system: "trs-80", name: "TRS-80 Model III", variant: "Model III \u00b7 dual drive",
    description: "The raked screen surround, integrated keyboard and stacked drives of the Model III.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of TRS-80 Model III: view from above the front-right corner" },
      { id: "straight-on", label: "Straight on", alt: "Rendered illustration of TRS-80 Model III: view from the front" },
      { id: "keyboard", label: "Keyboard", alt: "Rendered illustration of TRS-80 Model III: close view of the keyboard" },
      { id: "low-angle", label: "Low angle", alt: "Rendered illustration of TRS-80 Model III: low-angle view showing the case and controls" },
    ],
  },
  {
    system: "amstrad-pcw", name: "Amstrad PCW 8256", variant: "8256 \u00b7 monitor/computer unit",
    description: "The recessed green screen and single vertical drive of the PCW 8256 main unit.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of Amstrad PCW 8256: view from above the front-right corner" },
      { id: "straight-on", label: "Straight on", alt: "Rendered illustration of Amstrad PCW 8256: view from the front" },
      { id: "side", label: "Side", alt: "Rendered illustration of Amstrad PCW 8256: view from the side" },
    ],
  },
  {
    system: "kim-1", name: "MOS KIM-1", variant: "Populated-board study",
    description: "The calculator-style keypad, dark six-digit display and component groups of the KIM-1.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of MOS KIM-1: view from above the front-right corner" },
      { id: "top", label: "Above", alt: "Rendered illustration of MOS KIM-1: view from directly above" },
      { id: "keypad", label: "Keypad", alt: "Rendered illustration of MOS KIM-1: close view of the keypad and unpowered display" },
      { id: "low-angle", label: "Low angle", alt: "Rendered illustration of MOS KIM-1: low-angle view showing the case and controls" },
    ],
  },
  {
    system: "game-boy-color", name: "Game Boy Color", variant: "Opaque purple shell study",
    description: "The purple shell, recessed screen, directional pad and circular speaker holes of the Game Boy Color.",
    views: [
      { id: "front", label: "Front", alt: "Rendered illustration of Game Boy Color: view from above the front-right corner" },
      { id: "top", label: "Above", alt: "Rendered illustration of Game Boy Color: view from directly above" },
      { id: "controls", label: "Controls", alt: "Rendered illustration of Game Boy Color: close view of the screen surround and controls" },
    ],
  },
];

export const hardwareModelFor = (system: string) => hardwareModels.find(model => model.system === system);
export const hardwareModelForVault = (system: string) => hardwareModels.find(model => (model.vaultSystem ?? model.system) === system);
export const modelImage = (system: string, view: string, width = 1280) => `/images/models/${system}-${view}-${width}.webp`;
export const modelSrcset = (system: string, view: string) => [640, 1280, 1920].map(width => `${modelImage(system, view, width)} ${width}w`).join(', ');
