# CSS Custom Highlight API Syntax Highlighter

Proof of concept for high-performance syntax highlighting using the CSS Custom Highlight API.

## What is this?

Traditional syntax highlighters (including Shiki) wrap every token in a `<span>` element. For a 200-line code block with ~10 tokens per line, that's **2000+ DOM nodes**.

This implementation uses the **CSS Custom Highlight API** to achieve the same visual result with:
- **1 text node per line** (200 nodes instead of 2000+)
- **Range objects** for token positions (lightweight, no DOM nodes)
- **`::highlight()` pseudo-elements** for styling (pure CSS)

## Performance Gains

Example from a 25-line BASIC program:
- **Traditional (Shiki):** ~200 `<span>` elements
- **Highlight API:** 25 text nodes (one per line)
- **Reduction:** ~87% fewer DOM nodes

For pages with 5-10 code blocks, this means **thousands fewer DOM nodes**.

## Browser Support

- Chrome 105+ (September 2022)
- Firefox 140+ (2024)
- Safari 17.2+ (January 2024)

## Testing

### 1. Start dev server

```bash
npm run dev
```

### 2. Visit test page

Navigate to: `http://localhost:4321/test-highlight-api`

### 3. Compare results

The test page shows:
- **Left column:** Traditional Shiki (DOM spans)
- **Right column:** Highlight API (Range objects)

Both should look identical if your browser supports the API.

### 4. Check browser console

You'll see performance stats:
```
Performance Comparison
Traditional approach: 200 DOM nodes
Highlight API: 25 DOM nodes
Reduction: 87%
```

### 5. Inspect DOM

Open DevTools and inspect both code blocks:
- **Left:** Deeply nested `<span>` elements
- **Right:** Clean structure with one text node per line

## How It Works

### 1. Tokenization (Shiki)

Uses Shiki's excellent tokenizer to parse code:
```typescript
const tokens = await codeToTokens(code, { lang: 'basic', theme: 'dark-plus' });
```

### 2. HTML Generation (Clean)

Generates single text node per line:
```html
<pre class="shiki" data-highlight-block="hl-abc123">
  <code>
    <span id="hl-abc123-L0" class="line">100 PRINT "HELLO"</span>
    <span id="hl-abc123-L1" class="line">110 GOTO 100</span>
  </code>
</pre>
```

### 3. CSS Generation (`::highlight()`)

Creates CSS highlight styles:
```css
::highlight(hl-abc123-0) { color: #569cd6; }  /* Keywords */
::highlight(hl-abc123-1) { color: #ce9178; }  /* Strings */
```

### 4. JavaScript Registration (Client-side)

Registers Range objects with browser:
```javascript
const range = new Range();
range.setStart(textNode, 4);  // Start of "PRINT"
range.setEnd(textNode, 9);    // End of "PRINT"

const highlight = new Highlight(range);
CSS.highlights.set('hl-abc123-0', highlight);
```

## API Usage

```typescript
import { codeToHighlightHtml } from './lib/highlight-api';

const { html, css, script, stats } = await codeToHighlightHtml(code, {
  lang: 'basic',
  theme: 'dark-plus',
  blockId: 'optional-id',  // Auto-generated if omitted
});
```

**Returns:**
- `html`: Clean HTML structure
- `css`: `::highlight()` styles
- `script`: Client-side registration code
- `stats`: Performance metrics

**Astro Integration:**
```astro
---
import { codeToHighlightHtml } from '../lib/highlight-api';
const result = await codeToHighlightHtml(code, { lang: 'basic' });
---
<Fragment set:html={result.html} />
<Fragment set:html={result.css} />
<Fragment set:html={result.script} />
```

## Limitations

1. **Browser support:** Requires modern browsers (Chrome 105+, Firefox 140+, Safari 17.2+)
2. **Client-side registration:** Requires JavaScript to register highlights
3. **No SSR highlighting:** Highlighting happens client-side (graceful degradation possible)

## Fallback Strategy

For unsupported browsers, provide fallback:
```typescript
import { codeToHtmlFallback } from './lib/highlight-api';

if (!CSS.highlights) {
  // Use traditional Shiki
  const html = await codeToHtmlFallback(code, { lang: 'basic' });
}
```

## Next Steps

### If proof of concept succeeds:

1. **Measure real-world performance** on actual lesson pages
2. **Add fallback rendering** for older browsers
3. **Extract to npm package:** `shiki-highlight-api`
4. **Documentation site** with interactive demos
5. **Performance benchmarks** comparing to traditional approaches

### Package Goals:

- Drop-in replacement for Shiki's renderer
- Framework agnostic (Astro, React, Vue, Svelte)
- Progressive enhancement (works everywhere, optimal on modern browsers)
- All Shiki languages supported
- Custom themes supported

## Resources

- [CSS Custom Highlight API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API)
- [Blog post introducing the API](https://pavi2410.com/blog/high-performance-syntax-highlighting-with-css-highlights-api/)
- [Shiki documentation](https://shiki.style/)

## License

TBD (will match Code198x project license)
