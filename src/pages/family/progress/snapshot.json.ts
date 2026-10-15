import snapshot from '../../../data/project-progress.json';
import { validateProgressSnapshot } from '../../../lib/project-progress.mjs';

export function GET() {
  return new Response(`${JSON.stringify(validateProgressSnapshot(snapshot), null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
