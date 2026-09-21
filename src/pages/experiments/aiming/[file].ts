import fs from 'node:fs';
import path from 'node:path';

export function getStaticPaths() {
  const files = ['lessons.html', 'lessons.css', 'lessons.mjs', 'lesson-content.mjs', 'model.mjs', 'style.css'];
  return files.map(file => ({ params: { file } }));
}
export function GET({ params }: { params: { file: string } }) {
  const root = process.env.CODE_SAMPLES_PATH || path.resolve(process.cwd(), '../code-samples');
  let content = fs.readFileSync(path.join(root, 'craft/maths-for-games/aiming', params.file), 'utf8');
  if (params.file === 'lessons.html') {
    content = content.replace('<h1 id="title"></h1>', '').replace('<main>', '<main aria-label="Interactive maths experiment"><h1 id="title" class="embed-heading"></h1>');
    content = content.replace(/<footer>[\s\S]*?<\/footer>/, '').replace('<body>', '<body data-pagefind-ignore>');
    content = content.replace('</head>', `<meta name="robots" content="noindex"><style>.embed-heading{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);margin:0}header,#teaching,#neighbours,footer{display:none}main{padding:12px;max-width:none}.workbench{gap:20px}body{margin:0}</style></head>`);
    content = content.replace('</body>', `<script>
      const report = () => parent.postMessage({type:'aiming-height',height:document.querySelector('main').getBoundingClientRect().height}, location.origin);
      new ResizeObserver(report).observe(document.body);
      addEventListener('load', report);
    </script></body>`);
  }
  const type = params.file.endsWith('.html') ? 'text/html' : params.file.endsWith('.css') ? 'text/css' : 'text/javascript';
  return new Response(content, { headers: { 'Content-Type': type + '; charset=utf-8' } });
}
