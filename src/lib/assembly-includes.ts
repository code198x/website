/** Expand only the explicitly supplied companion files; never fetch source paths. */
export function expandAssemblyIncludes(source: string, files: Record<string, string>): string {
  return source.replace(/^\s*include\s+["']([^"']+)["']\s*(?:;[^\n]*)?$/gmi, (_, name: string) => {
    if (!Object.hasOwn(files, name)) throw new Error(`The project has no companion file named ${name}.`);
    if (/^\s*include\b/im.test(files[name])) throw new Error('Nested companion includes are not supported.');
    return `; Begin ${name}\n${files[name]}\n; End ${name}`;
  });
}
