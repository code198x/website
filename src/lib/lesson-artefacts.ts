import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

/** Which lesson a URL belongs to: /systems/<system>/<language>/<module>/unit-NN… */
export function lessonContext(pathname: string) {
  const m = pathname.match(/^\/systems\/([^/]+)\/([^/]+)\/([^/]+)\/unit-(\d+)/);
  return m ? { system: m[1], language: m[2], module: m[3], unit: Number(m[4]) } : null;
}

/**
 * Runnable files the lesson build staged for a unit. A source listing or a
 * missing build must never masquerade as a runnable lesson. Cumulative-step
 * lessons publish their completed final step.
 */
export function stagedLessonFiles(directory: string, formats: string[]): string[] {
  if (!existsSync(directory)) return [];
  const runnable = (d: string) => readdirSync(d).filter(f => formats.includes(path.extname(f)) && statSync(path.join(d, f)).isFile());
  const top = runnable(directory).sort();
  if (top.length) return top;
  const steps = path.join(directory, 'steps');
  if (!existsSync(steps)) return [];
  const last = runnable(steps).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1);
  return last ? [`steps/${last}`] : [];
}
