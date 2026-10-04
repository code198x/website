import type { SourceLocation } from './assembly-diagnostics';

/** Expand only supplied companions, keeping a route back to each editor line. */
export function expandAssemblyProject(source: string, files: Record<string, string>): { source: string; locations: SourceLocation[] } {
  const lines: string[] = [];
  const locations: SourceLocation[] = [];
  source.split('\n').forEach((line, index) => {
    const include = line.match(/^\s*include\s+["']([^"']+)["']\s*(?:;[^\n]*)?$/i);
    if (!include) { lines.push(line); locations.push({ line: index + 1 }); return; }
    const name = include[1];
    if (!Object.hasOwn(files, name)) throw new Error(`The project has no companion file named ${name}.`);
    if (/^\s*include\b/im.test(files[name])) throw new Error('Nested companion includes are not supported.');
    lines.push(`; Begin ${name}`); locations.push({ line: index + 1 });
    files[name].split('\n').forEach((line, number) => { lines.push(line); locations.push({ file: name, line: number + 1 }); });
    lines.push(`; End ${name}`); locations.push({ line: index + 1 });
  });
  return { source: lines.join('\n'), locations };
}

export function expandAssemblyIncludes(source: string, files: Record<string, string>): string {
  return expandAssemblyProject(source, files).source;
}
