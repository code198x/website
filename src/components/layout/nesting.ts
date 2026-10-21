/**
 * Sidebar, Switcher and Reel style their children through inherited custom
 * properties. A direct child of the same kind sets its own, so the outer one's
 * rules would read the inner one's settings and size it wrongly. They refuse
 * that at build time instead of leaving it to a screenshot to notice.
 */

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);
// A comment, or a start or end tag whose quoted attribute values may hold `>`.
const TOKEN = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;

/** The class lists of the elements at the top level of an HTML fragment. */
export function topLevelClasses(html: string): string[][] {
  const found: string[][] = [];
  let depth = 0;
  TOKEN.lastIndex = 0;
  for (let match = TOKEN.exec(html); match; match = TOKEN.exec(html)) {
    const [whole, closing, rawName, attributes = '', selfClosing] = match;
    if (!rawName) continue;
    const name = rawName.toLowerCase();
    if (closing) { depth = Math.max(0, depth - 1); continue; }
    if (depth === 0) {
      const value = attributes.match(/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/);
      found.push((value?.[1] ?? value?.[2] ?? value?.[3] ?? '').split(/\s+/).filter(Boolean));
    }
    if (RAW_TEXT.has(name)) {
      // Skip to the matching end tag: what is inside is text, not markup.
      const end = html.toLowerCase().indexOf(`</${name}`, match.index + whole.length);
      TOKEN.lastIndex = end === -1 ? html.length : end;
      depth++;
    } else if (!VOID.has(name) && !selfClosing) {
      depth++;
    }
  }
  return found;
}

export function refuseSameKindChild(html: string, className: string, component: string): void {
  if (topLevelClasses(html).some(classes => classes.includes(className))) {
    throw new Error(`A ${component} is a direct child of another ${component}. Its settings reach its children by inheritance, so the outer one would size it with the inner one's. Wrap the inner ${component} in an element (docs/page-layouts.md, "Layout primitives").`);
  }
}
