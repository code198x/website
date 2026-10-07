import fs from 'node:fs';
import path from 'node:path';
export function getStaticPaths() {
  return ['playground.html', 'app.mjs', 'model.mjs', 'style.css', 'lessons.html', 'lessons.css', 'lessons.mjs', 'lesson-model.mjs', 'immediate.mjs', 'acceleration.mjs', 'braking.mjs', 'reversal.mjs', 'approach.mjs'].map(file => ({params:{file}}));
}
export function GET({params}: {params:{file:string}}) {
  const root = process.env.CODE_SAMPLES_PATH || path.resolve(process.cwd(), '../code-samples');
  const file = params.file === 'playground.html' ? 'index.html' : params.file;
  let content = fs.readFileSync(path.join(root, 'craft/game-feel/movement', file), 'utf8');
  if (params.file === 'playground.html') {
    // The sample remains an isolated interactive document inside the site frame.
    content = content.replace('</head>', '<base target="_top"><style>body main{max-width:none;padding-inline:0}</style></head>');
  }
  const type = params.file.endsWith('.html') ? 'text/html' : params.file.endsWith('.css') ? 'text/css' : 'text/javascript';
  return new Response(content, {headers:{'Content-Type': type + '; charset=utf-8'}});
}
