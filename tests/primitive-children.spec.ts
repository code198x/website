import { test, expect } from '@playwright/test';
import routes from '../scripts/css-routes.json' with { type: 'json' };

// A Sidebar, Switcher or Reel lays out its children by setting their flex and
// minimum width. A page rule that sets those on a child comes later in the
// cascade (blocks follows composition) and wins, and the primitive then stops
// stacking or wrapping where it promised to. Three such rules reached review
// during the restructure (docs/plans/2026-10-20-css-cascade-layers.md, Risks).
//
// For each primitive on each page, this builds a copy with the same classes
// and settings but plain children, which no page rule reaches, and compares
// the children's values. A child that intends to keep its own size says so
// with data-primitive-own="<reason>".

const PROPERTIES = ['flex-grow', 'flex-shrink', 'flex-basis', 'min-width'] as const;

for (const route of routes.filter(r => !('steps' in r))) {
  test(`primitive children keep the primitive's layout on ${route.path}`, async ({ page }) => {
    await page.goto(route.path);
    const overridden = await page.evaluate(properties => {
      const found: string[] = [];
      // A plain element shows each property's default, for telling what a primitive sets.
      const reference = document.body.appendChild(document.createElement('div'));
      const initial = getComputedStyle(reference);
      const describe = (element: Element) => `${element.tagName.toLowerCase()}${element.className && typeof element.className === 'string' ? `.${element.className.trim().split(/\s+/).join('.')}` : ''}`;
      for (const primitive of document.querySelectorAll('.l-with-sidebar, .l-switcher, .l-reel')) {
        const children = [...primitive.children].filter(child => !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(child.tagName));
        if (children.length === 0) continue;
        const copy = primitive.cloneNode(false) as HTMLElement;
        copy.removeAttribute('id');
        copy.style.position = 'absolute';
        copy.style.visibility = 'hidden';
        copy.style.insetInlineStart = '-10000px';
        for (let i = 0; i < children.length; i++) copy.append(document.createElement('div'));
        document.body.append(copy);
        children.forEach((child, index) => {
          if (child.hasAttribute('data-primitive-own')) return;
          const real = getComputedStyle(child);
          const plain = getComputedStyle(copy.children[index]);
          for (const name of properties) {
            // Only what the primitive sets: a value it leaves at the default is the page's to choose.
            if (plain.getPropertyValue(name) === initial.getPropertyValue(name)) continue;
            if (real.getPropertyValue(name) !== plain.getPropertyValue(name)) {
              found.push(`${describe(primitive)} > ${describe(child)}: ${name} ${real.getPropertyValue(name)}, primitive gives ${plain.getPropertyValue(name)}`);
            }
          }
        });
        copy.remove();
      }
      reference.remove();
      return [...new Set(found)];
    }, PROPERTIES);
    expect(overridden, 'page rules that override a layout primitive on its children').toEqual([]);
  });
}
