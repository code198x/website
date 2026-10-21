/**
 * Frame crops its content to fill a box, and a capture may be cropped only as
 * a deliberate, labelled detail, never to fill a box
 * (decisions/family-visual-identity.md). The capture components mark their
 * output with these classes, so rendered content that carries one is refused.
 */
const CAPTURE_MARKERS = ['native-capture', 'figure-capture', 'native-image'];

export function refuseCaptures(html: string): void {
  const found = html.match(new RegExp(`\\bclass="[^"]*\\b(${CAPTURE_MARKERS.join('|')})\\b`));
  if (found) {
    throw new Error(`Frame crops its content to fill a box, so it cannot hold a capture (found "${found[1]}"). Show captures with Figure or NativeImage; see decisions/family-visual-identity.md.`);
  }
}
