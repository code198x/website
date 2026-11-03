// Size the release browser run to the capacity the host can spare, and
// describe the host, so a failure can be read against its conditions.
//
// Playwright's default, half the cores, ignores whatever else is running. On
// an overloaded host whole browsers stopped answering for a test's full budget
// (#901). Timeouts and retries are deliberately unchanged.

import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

/** Workers for a host with `cores` cores and a one-minute load of `load`. */
export function workersFor({cores, load, override}) {
  const ceiling = Math.max(1, Math.floor(cores / 2));
  if (override !== undefined && override !== '') {
    const requested = Number(override);
    if (!Number.isInteger(requested) || requested < 1) {
      throw new Error(`PLAYWRIGHT_WORKERS must be a whole number of at least 1, not "${override}"`);
    }
    return requested;
  }
  const spare = Math.floor(cores - load);
  return Math.min(ceiling, Math.max(1, spare));
}

/** Swap in use, where the platform reports it. */
function swap() {
  try {
    if (process.platform === 'darwin') {
      const text = execFileSync('sysctl', ['-n', 'vm.swapusage'], {encoding: 'utf8'});
      const [, total, used] = text.match(/total = ([\d.]+)M\s+used = ([\d.]+)M/) ?? [];
      if (total) return {usedMB: Number(used), totalMB: Number(total)};
    }
    if (process.platform === 'linux') {
      const info = execFileSync('cat', ['/proc/meminfo'], {encoding: 'utf8'});
      const kb = (name) => Number(info.match(new RegExp(`^${name}:\\s+(\\d+)`, 'm'))?.[1] ?? 0);
      return {usedMB: (kb('SwapTotal') - kb('SwapFree')) / 1024, totalMB: kb('SwapTotal') / 1024};
    }
  } catch {
    // Reporting only: a host that hides its swap still gets the rest.
  }
  return null;
}

/** One line describing the host now. */
export function describeHost() {
  const cores = os.availableParallelism();
  const load = os.loadavg()[0];
  const freeGB = os.freemem() / 1e9;
  const totalGB = os.totalmem() / 1e9;
  const s = swap();
  const swapText = s && s.totalMB > 0 ? `, swap ${(s.usedMB / 1024).toFixed(1)}/${(s.totalMB / 1024).toFixed(1)} GB` : '';
  return `load ${load.toFixed(1)} on ${cores} cores, free memory ${freeGB.toFixed(1)}/${totalGB.toFixed(1)} GB${swapText}`;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const workers = workersFor({
    cores: os.availableParallelism(),
    load: os.loadavg()[0],
    override: process.env.PLAYWRIGHT_WORKERS,
  });
  console.error(`Release host: ${describeHost()}. Playwright workers: ${workers}.`);
  console.log(workers);
}
