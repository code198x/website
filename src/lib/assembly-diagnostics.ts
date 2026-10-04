export interface SourceLocation { file?: string; line: number; }
export interface AssemblyDiagnostic { text: string; location?: SourceLocation; }

/** Translate assembler diagnostics without exposing their serialised metadata. */
export function formatAssemblyDiagnostics(value: unknown, locations: SourceLocation[] = []): AssemblyDiagnostic[] {
  if (typeof value === 'string') {
    try { return formatAssemblyDiagnostics(JSON.parse(value), locations); }
    catch { return [{ text: value.trim() || 'The source did not assemble.' }]; }
  }
  if (!Array.isArray(value)) return [{ text: 'The source did not assemble. Check the source and try again.' }];
  const messages = value.flatMap(item => {
    if (!item || typeof item.message !== 'string' || !item.message.trim()) return [];
    const line = item.span?.line;
    const location = Number.isInteger(line) && line > 0 ? locations[line - 1] : undefined;
    const prefix = location ? (location.file ? `${location.file}, line ${location.line}: ` : `Line ${location.line}: `)
      : Number.isInteger(line) && line > 0 ? `Line ${line}: ` : '';
    return [{ text: prefix + item.message.trim(), location }];
  });
  return messages.length ? messages : [{ text: 'The source did not assemble. Check the source and try again.' }];
}
