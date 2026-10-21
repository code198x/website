// TypeScript includes the checkout directory in missing-declaration messages.
// Compare the package path while preserving the diagnostic and module identity.
export function diagnosticKey(key) {
  return key.replace(/'[^'\r\n]*\/node_modules\//g, "'<node_modules>/");
}
