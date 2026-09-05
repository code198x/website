import { describe, expect, it } from 'vitest';
import { prepareRedirectStub } from './redirect-stub.mjs';
import { runInNewContext } from 'node:vm';

const stub = (target: string) => `<!doctype html><meta http-equiv="refresh" content="0;url=${target}"><a href="${target}">Continue</a>`;
function destination(target: string, hash: string) {
  const html = prepareRedirectStub(stub(target));
  let result = '';
  runInNewContext(html.match(/<script>(.*?)<\/script>/)![1], {
    URL,
    document: { createElement: () => ({ set innerHTML(value: string) { this.value = value; }, value: '' }) },
    location: { href: 'https://code198x.com/old/', hash, replace: (url: string) => { result = url; } },
  });
  return result;
}
describe('retained lesson bookmarks', () => {
  it('keeps the incoming heading on the new page', () => {
    expect(destination('/reference/unit-02', '#what-youve-learnt')).toBe('https://code198x.com/reference/unit-02#what-youve-learnt');
  });
  it('respects a redirect to a specific heading', () => {
    expect(destination('/reference/#replacement', '#old')).toBe('https://code198x.com/reference/#replacement');
  });
  it('keeps a no-JavaScript fallback and is idempotent', () => {
    const prepared = prepareRedirectStub(stub('/reference/'));
    expect(prepared).toContain('<noscript><meta http-equiv="refresh"');
    expect(prepareRedirectStub(prepared)).toBe(prepared);
    expect(prepareRedirectStub('<!doctype html><html><p>A lesson</p></html>')).toBe('<!doctype html><html><p>A lesson</p></html>');
  });
});
