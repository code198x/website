// Sources are maintained in code-samples; the page and downloads share this map.
export const crashTypeins = [
  {
    id: 'spectrum-logo', title: 'Bedroom coding, brought back.', machine: 'ZX Spectrum',
    source: '_capture/crash-live/typein-198x.bas', lang: 'sinclair-basic',
    note: 'Use a lower-case x in "198x" on line 20. Line 60 has one space between the quotes; lines 80 and 85 have two in each pair.',
    alt: '198x in Spectrum colours above a rainbow stripe', width: 256, height: 192,
    next: '/systems/sinclair-zx-spectrum/basic',
  },
  {
    id: 'spectrum-circles', title: 'Seven lines. One screen.', machine: 'ZX Spectrum',
    card: 1, cardHeadline: "We've all been here.",
    source: '_capture/crash-live/typein-rosette.bas', lang: 'sinclair-basic',
    note: 'Twenty-four circles share six colours. Change the final 40 on line 40 to 50 and the Spectrum stops with B Integer out of range: the fifth circle would reach above the top pixel row, y=175. What is the largest radius that fits all 24?',
    alt: 'Overlapping coloured circles forming a ring on a white Spectrum screen', width: 256, height: 192,
    next: '/systems/sinclair-zx-spectrum/basic',
  },
  {
    id: 'spectrum-qr', title: 'Time travel in motion.', machine: 'ZX Spectrum',
    card: 4, cardHeadline: 'Type this in 1982. Scan it in 2026.',
    source: '_capture/crash-live/typein-qr.bas', lang: 'sinclair-basic',
    note: 'Each DATA number holds one row of a prepared QR pattern; the program draws it with black squares. Enter all 19 lines, then RUN and let it finish drawing before scanning.',
    alt: 'Actual Spectrum output: a QR code linking to this event page above SCAN THIS CODE', width: 256, height: 192,
    next: '/systems/sinclair-zx-spectrum/basic',
  },
  {
    id: 'c64-logo', title: 'Also on the Commodore 64.', machine: 'Commodore 64',
    source: '_capture/crash-live/typein-198x-c64.bas', lang: 'basic',
    note: 'The program reads the built-in character shapes and draws them with coloured blocks. Enter the listing in BASIC on a Commodore 64 or an emulator.',
    alt: '198x in Commodore 64 colours above a diagonal stripe', width: 320, height: 200,
    next: '/systems/commodore-64',
  },
];
