/**
 * A system's capability: what the machine can do, as sourced fields in its
 * catalogue entry (docs: specifications/system-profile.md). One list drives
 * the schema, the system page and scripts/system-depth.mjs.
 *
 * Pure module: no astro:content imports, so scripts can import it under Node.
 */
export const CAPABILITY_FIELDS = [
  { key: 'processor', label: 'Processor' },
  { key: 'memory', label: 'Memory' },
  { key: 'display', label: 'Display' },
  { key: 'sound', label: 'Sound' },
  { key: 'input', label: 'Input' },
  { key: 'storage', label: 'Storage' },
  { key: 'expansion', label: 'Expansion' },
  { key: 'firmware', label: 'Firmware' },
] as const;

export type CapabilityKey = (typeof CAPABILITY_FIELDS)[number]['key'];

// A source names a public, checkable work. A path on someone's machine or in
// the private research library must never reach the site.
export const PRIVATE_SOURCE = /(?<![\w.-])\/(?:Users|home|Volumes|private)\/|reference\/(?:_[a-z-]+|by-system|by-topic|contextual|assets)\b|facts\.sqlite|knowledge\.py/;
