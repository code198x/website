import { describe, expect, it } from 'vitest';
import { refuseSameKindChild, topLevelClasses } from './nesting';

describe('topLevelClasses', () => {
  it('lists only the outermost elements', () => {
    expect(topLevelClasses('<div class="a b"><p class="inner">x</p></div><aside class=\'c\'></aside>')).toEqual([['a', 'b'], ['c']]);
  });

  it('is not thrown off by void elements, comments, raw text or > in attributes', () => {
    const html = '<!-- <div class="x"> --><img class="pic" alt="a > b"><br><script>if (a<b) document.write("<div class=\\"l-reel\\">")</script><div data-json=\'{"a":">"}\' class="last"><span></span></div>';
    expect(topLevelClasses(html)).toEqual([['pic'], [], [], ['last']]);
  });
});

describe('refuseSameKindChild', () => {
  it('refuses a direct child of the same kind', () => {
    expect(() => refuseSameKindChild('<div class="l-with-sidebar" data-side="left"><div></div><div></div></div>', 'l-with-sidebar', 'Sidebar')).toThrow(/direct child of another Sidebar/);
  });

  it('allows one wrapped in another element', () => {
    expect(() => refuseSameKindChild('<div class="wrap"><div class="l-with-sidebar"></div></div>', 'l-with-sidebar', 'Sidebar')).not.toThrow();
  });

  it('allows a different primitive as a direct child', () => {
    expect(() => refuseSameKindChild('<div class="l-switcher"></div><div class="l-reel"></div>', 'l-with-sidebar', 'Sidebar')).not.toThrow();
  });
});
