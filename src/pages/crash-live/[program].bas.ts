import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { crashTypeins } from '../../lib/crash-typeins';

export function getStaticPaths() {
  return crashTypeins.map(program => ({ params: { program: program.id }, props: { program } }));
}

export const GET: APIRoute = ({ props }) => {
  const root = process.env.CODE_SAMPLES_PATH || path.resolve(process.cwd(), '../code-samples');
  const code = fs.readFileSync(path.join(root, props.program.source), 'utf8');
  return new Response(code, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
