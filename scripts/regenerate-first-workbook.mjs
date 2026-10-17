/** Build fresh printable sources and regenerate both editions without a manual preview. */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const relative = 'workbooks/spectrum-basic-first-session';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.pdf': 'application/pdf' };
function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code, signal) => code === 0 ? resolve() : reject(new Error(`${command} failed (${signal ?? code})`)));
  });
}

await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build']);
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.resolve(dist, `.${pathname}`);
    if (!file.startsWith(`${dist}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }
    const bytes = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream' });
    response.end(bytes);
  } catch {
    response.writeHead(404).end();
  }
});
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  await run(process.execPath, ['scripts/build-first-workbook.mjs', '--base-url', base]);
  for (const file of ['learner.pdf', 'teacher.pdf', 'pdf-manifest.json']) {
    await copyFile(path.join(root, 'public', relative, file), path.join(dist, relative, file));
  }
  console.log('\nWorkbook ready: public/workbooks/spectrum-basic-first-session/');
  console.log('The local dist copy is current too. Review both PDFs, then commit and publish through the normal PR process.');
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
