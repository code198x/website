import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const generator = fileURLToPath(new URL('./build-first-workbook.mjs', import.meta.url));
for (const failure of ['overflow', 'missing pages']) {
  test(`a teacher edition with ${failure} preserves the complete previous pack`, async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'workbook-recovery-test-'));
    const output = path.join(root, 'public/workbooks/spectrum-basic-first-session');
    await mkdir(output, { recursive: true });
    const originals = { 'learner.pdf': 'previous learner', 'teacher.pdf': 'previous teacher', 'pdf-manifest.json': 'previous manifest' };
    await writeFile(path.join(output, 'sources.json'), JSON.stringify({ version: 'test' }));
    for (const [name, content] of Object.entries(originals)) await writeFile(path.join(output, name), content);
    const server = createServer((request, response) => {
      const teacher = request.url.includes('/teacher/');
      const className = teacher && failure === 'missing pages' ? 'missing' : 'sheet';
      const height = teacher && failure === 'overflow' ? 5000 : 20;
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(`<style>.sheet{height:200px} @page{size:A4}</style><main class="${className}"><h1>Workbook</h1><div style="height:${height}px">Test content</div></main>`);
    });
    try {
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
      const result = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [generator, '--base-url', `http://127.0.0.1:${server.address().port}`], { cwd: root });
        let stderr = '';
        child.stderr.on('data', bytes => { stderr += bytes; });
        child.once('error', reject);
        child.once('exit', code => resolve({ code, stderr }));
      });
      assert.notEqual(result.code, 0);
      assert.match(result.stderr, failure === 'overflow' ? /teacher: content overflows/ : /teacher: no authored workbook pages/);
      for (const [name, content] of Object.entries(originals)) assert.equal(await readFile(path.join(output, name), 'utf8'), content);
      assert.deepEqual((await readdir(output)).sort(), [...Object.keys(originals), 'sources.json'].sort());
    } finally {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
      await rm(root, { recursive: true, force: true });
    }
  });
}
