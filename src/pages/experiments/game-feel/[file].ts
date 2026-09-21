import fs from 'node:fs';
import path from 'node:path';
export function getStaticPaths() {
  return ['index.html', 'app.mjs', 'model.mjs', 'style.css'].map(file => ({params:{file}}));
}
export function GET({params}: {params:{file:string}}) {
  const root = process.env.CODE_SAMPLES_PATH || path.resolve(process.cwd(), '../code-samples');
  const content = fs.readFileSync(path.join(root, 'craft/game-feel/movement', params.file), 'utf8');
  const type = params.file.endsWith('.html') ? 'text/html' : params.file.endsWith('.css') ? 'text/css' : 'text/javascript';
  return new Response(content, {headers:{'Content-Type': type + '; charset=utf-8'}});
}
