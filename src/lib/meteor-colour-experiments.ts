/** Source transformations for unit 28, starting from its maintained checkpoint. */
export function meteorColourExperiments(original: string) {
  const marker = 'draw_ship:\n ld a,1\n ld (ship_visible),a';
  if (!original.includes(marker)) throw new Error('Meteor colour experiment: ship routine changed.');
  function table(transform: (value: number, index: number) => number) {
    const start = original.indexOf('row_colours:\n');
    const end = original.indexOf('; Debris records:', start);
    if (start < 0 || end < 0) throw new Error('Meteor colour experiment: colour table changed.');
    let index = 0;
    const changed = original.slice(start, end).split('\n').map(line => {
      const split = line.indexOf(';');
      const code = split < 0 ? line : line.slice(0, split);
      const comment = split < 0 ? '' : line.slice(split);
      return code.replace(/\$[\da-f]+/gi, hex => '$' + transform(parseInt(hex.slice(1), 16), index++).toString(16).toUpperCase().padStart(2, '0')) + comment;
    }).join('\n');
    if (index !== 24) throw new Error(`Meteor colour experiment: expected 24 rows, got ${index}.`);
    return original.slice(0, start) + changed + original.slice(end);
  }
  return [
    { id: 'bands', title: 'Colour by place', source: original },
    { id: 'clash', title: 'One yellow cell', source: original.replace(marker, marker + '\n ld a,(ship_x)\n rrca\n rrca\n rrca\n and 31\n add a,$80\n ld l,a\n ld h,$5A\n ld (hl),$46') },
    { id: 'dim', title: 'Normal brightness', source: table(value => value - 0x40) },
    { id: 'red', title: 'Red in row 20', source: table((value, row) => row === 20 ? 0x42 : value) },
  ];
}
