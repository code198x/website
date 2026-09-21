import fs from 'node:fs';
import path from 'node:path';
import { crashTypeins } from '../../lib/crash-typeins';
export function GET() {
  const program = crashTypeins.find(program => program.id === 'c64-logo')!;
  const root = process.env.CODE_SAMPLES_PATH || path.resolve(process.cwd(), '../code-samples');
  return new Response(fs.readFileSync(path.join(root, program.source), 'utf8'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
