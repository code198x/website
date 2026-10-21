// The installation directory is not part of a TypeScript error's identity.
// Keep the package subpath, message, source file and diagnostic code intact.
export function normaliseTypeKey(key) {
  return key.replace(/(['"])(?:[A-Za-z]:[\\/]|\/)[^'"\r\n]*?[\\/]node_modules[\\/]/g, '$1<checkout>/node_modules/');
}

export function normaliseTypeCounts(counts) {
  const result = {};
  for (const [key, count] of Object.entries(counts)) {
    const stable = normaliseTypeKey(key);
    result[stable] = (result[stable] ?? 0) + count;
  }
  return result;
}
