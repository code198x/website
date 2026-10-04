interface Firmware { optional?: boolean; bundled?: boolean; }
interface PlayerEntry { demo?: unknown; variants: Array<{ id: string; firmware: Firmware[] }>; }

/** Hardware needs and firmware included by this build are different facts. */
export function playerFirmwareNote(entry: PlayerEntry | undefined, variantId: string | undefined): string {
  const variant = entry?.variants.find(variant => variant.id === variantId);
  const required = variant?.firmware.filter(file => !file.optional);
  if (required?.length && required.every(file => file.bundled)) return 'ROM included · no files needed';
  if (entry?.demo) return 'Runs a built-in demo · add your ROMs for the full machine';
  if (!required || required.some(file => !file.bundled)) return 'Needs your own ROM files · nothing is uploaded';
  return 'Runs without ROM files · add yours for the original firmware';
}
