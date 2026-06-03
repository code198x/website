/**
 * Accessible-ink helpers.
 *
 * Brand/platform colours are used both as fills (bars, borders, shadows) and as
 * small text on light or dark surfaces. As text they must meet WCAG AA (4.5:1),
 * but many brand colours are too light for a light surface or too dark for a
 * dark one. `accessibleInk` nudges a colour's lightness — and ONLY as far as
 * needed — toward the contrasting end until it meets the ratio, preserving hue
 * and saturation. Colours that already pass are returned unchanged, so vibrant
 * colours stay vibrant. Compute once per theme (light + dark) and apply the
 * result to text usages only.
 */

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '').trim();
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      default: h = (rn - gn) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  if (s === 0) return { r: l * 255, g: l * 255, b: l * 255 };
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}

function relativeLuminance({ r, g, b }: RGB): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Linear sRGB blend of two hex colours; `ratioA` is the fraction of `a` (0–1). */
export function mix(a: string, b: string, ratioA: number): string {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  return rgbToHex({
    r: ra.r * ratioA + rb.r * (1 - ratioA),
    g: ra.g * ratioA + rb.g * (1 - ratioA),
    b: ra.b * ratioA + rb.b * (1 - ratioA),
  });
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(hexToRgb(a));
  const lb = relativeLuminance(hexToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Standard surfaces the brand-as-text usages sit on (light + dark themes).
 * Light uses the page background (#f4f1e8, the C64 beige) rather than the
 * lighter card surface (#fdfcf7) so the derived ink is conservative — it
 * passes AA on the darker page bg and therefore on cards too.
 */
export const SURFACE_LIGHT = '#f4f1e8';
export const SURFACE_DARK = '#242019';

/**
 * Build the `--ink-l` / `--ink-d` custom-property pair for a brand colour,
 * ready to drop into a `style` attribute. The global `--ink` switch (see
 * Layout.astro) resolves these to the theme-correct value, so descendant text
 * can use `color: var(--ink)` and stay accessible in both themes. Returns ''
 * for non-hex inputs (e.g. a CSS var), leaving prior behaviour untouched.
 */
export function inkStyle(color: string): string {
  if (!/^#[0-9a-fA-F]{3,6}$/.test(color)) return '';
  return `--ink-l: ${accessibleInk(color, SURFACE_LIGHT)}; --ink-d: ${accessibleInk(color, SURFACE_DARK)};`;
}

/**
 * Return `fg` adjusted in lightness just enough to meet `ratio` against `bg`,
 * preserving hue/saturation. If `fg` already passes, it's returned unchanged.
 * On a light bg the colour darkens; on a dark bg it lightens.
 */
export function accessibleInk(fg: string, bg: string, ratio = 4.5): string {
  if (contrastRatio(fg, bg) >= ratio) return fg;

  const { h, s, l } = rgbToHsl(hexToRgb(fg));
  const darken = relativeLuminance(hexToRgb(bg)) > 0.18; // light-ish bg → darken
  const candidate = (lightness: number) =>
    rgbToHex(hslToRgb(h, s, Math.min(1, Math.max(0, lightness))));

  // Binary search the lightness nearest the original that still meets ratio.
  let lo = darken ? 0 : l;
  let hi = darken ? l : 1;
  let best = candidate(darken ? 0 : 1); // worst-case extreme is guaranteed-ish
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const hex = candidate(mid);
    if (contrastRatio(hex, bg) >= ratio) {
      best = hex;
      // move toward the original lightness (less adjustment)
      if (darken) lo = mid;
      else hi = mid;
    } else {
      if (darken) hi = mid;
      else lo = mid;
    }
  }
  return best;
}
