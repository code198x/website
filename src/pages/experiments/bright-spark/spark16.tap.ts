import fs from 'node:fs';
import path from 'node:path';

export function GET() {
  const root = process.env.CODE_SAMPLES_PATH || path.resolve(process.cwd(), '../code-samples');
  const tape = fs.readFileSync(path.join(root, 'sinclair-zx-spectrum/basic/bright-spark/opening/release/spark16.tap'));
  return new Response(tape, {headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename="spark16.tap"',
  }});
}
