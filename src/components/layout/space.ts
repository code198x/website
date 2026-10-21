/**
 * Shared props for the layout primitives in this folder
 * (docs/page-layouts.md, "Layout primitives").
 */

/** A step of the kit's spacing scale: `4` is `var(--h-space-4)`. */
export type Space = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;

export const space = (step: Space): string => (step === 0 ? '0' : `var(--h-space-${step})`);

/**
 * The style attribute for a primitive: its custom properties, then whatever
 * style the caller passed. Properties left undefined are omitted, so the
 * primitive's class default applies.
 */
export function primitiveStyle(
  properties: Record<string, string | number | undefined>,
  style?: string | Record<string, string | number>,
): string | undefined {
  const own = Object.entries(properties)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => `${name}: ${value}`);
  const passed = typeof style === 'string'
    ? [style.trim().replace(/;$/, '')]
    : Object.entries(style ?? {}).map(([name, value]) => `${name.startsWith('--') ? name : name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}: ${value}`);
  const all = [...own, ...passed].filter(Boolean);
  return all.length ? all.join('; ') : undefined;
}

/** A CSS length, so a typo fails `astro check` rather than the page. */
export type Length = `${number}${'px' | 'rem' | 'em' | 'ch' | '%' | 'vw' | 'vh' | 'vi' | 'svh'}` | '0';
