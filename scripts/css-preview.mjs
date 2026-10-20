// Serve dist/ with `astro preview` for the CSS measurement scripts.
import { spawn } from 'node:child_process';

// Never adopt a server already on the port: it may be serving another build.
export async function startPreview(port) {
  const base = `http://localhost:${port}`;
  const up = () => fetch(base).then(() => true, () => false);
  if (await up()) throw new Error(`Port ${port} is already serving; choose another`);
  const server = spawn('npx', ['astro', 'preview', '--port', String(port)], {
    env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '0' },
    stdio: 'ignore',
    detached: true,
  });
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await up()) return { base, stop: () => process.kill(-server.pid) };
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  process.kill(-server.pid);
  throw new Error('astro preview did not start');
}
