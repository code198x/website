export interface ModelView {
  id: string;
  label: string;
  alt: string;
}

export interface HardwareModel {
  system: string;
  name: string;
  variant: string;
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
];

export const hardwareModelFor = (system: string) => hardwareModels.find(model => model.system === system);
export const modelImage = (system: string, view: string, width = 1280) => `/images/models/${system}-${view}-${width}.webp`;
export const modelSrcset = (system: string, view: string) => [640, 1280, 1920].map(width => `${modelImage(system, view, width)} ${width}w`).join(', ');
