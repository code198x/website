/** Keep redirect pages out of search and preserve bookmarked headings. */
export function prepareRedirectStub(html) {
  if (!html.includes('http-equiv="refresh"') || /<html[\s>]/i.test(html)) return html;
  const doctype = html.match(/^(\s*<!doctype html>)/i)?.[1];
  const refresh = html.match(/<meta\s+http-equiv="refresh"\s+content="[^"]*;url=([^"]+)"\s*\/?\s*>/i);
  if (!doctype || !refresh) return html;
  // Astro HTML-escapes the attribute. Decode it in the browser before URL parsing.
  const encoded = JSON.stringify(refresh[1]).replace(/</g, '\\u003c');
  const script = `<script>const text=document.createElement('textarea');text.innerHTML=${encoded};const destination=new URL(text.value,location.href);if(!destination.hash)destination.hash=location.hash;location.replace(destination.href);</script>`;
  const rest = html.slice(doctype.length).replace(refresh[0], `${script}<noscript>${refresh[0]}</noscript>`);
  return `${doctype}<html data-pagefind-ignore>${rest}</html>`;
}
