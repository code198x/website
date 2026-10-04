/**
 * A machine's colours: its case, livery, badge, logo and what its screen shows.
 * Each one cites where it came from and how sure we are of it. The one marked
 * primary is the machine's spot ink (family-visual-identity.md §3).
 */
export type MachineColour = {
  name: string;
  hex: string;
  role: 'case' | 'keys' | 'livery' | 'badge' | 'logo' | 'screen';
  primary: boolean;
  confidence: 'exact' | 'measured' | 'estimate';
  source: string;
};

export const COLOUR_ROLES = ['case', 'keys', 'livery', 'badge', 'logo', 'screen'] as const;
export const CONFIDENCES = ['exact', 'measured', 'estimate'] as const;

export function primaryColour(colours?: MachineColour[]): MachineColour | undefined {
  return colours?.find((c) => c.primary);
}

export function validateColours(colours: MachineColour[]): string[] {
  const errors: string[] = [];
  for (const c of colours) {
    if (!/^#[0-9a-fA-F]{6}$/.test(c.hex)) errors.push(`${c.name}: ${c.hex} is not #rrggbb`);
    if (!c.source.trim()) errors.push(`${c.name}: no source`);
  }
  if (colours.filter((c) => c.primary).length > 1) errors.push('more than one primary colour');
  return errors;
}

type SystemEntry = {
  id: string;
  data: { name: string; shortName: string; year: number; color: string; colours?: MachineColour[] };
};

export function machinesJson(systems: SystemEntry[]) {
  const out: Record<string, { name: string; short: string; year: string; color: string; colours: MachineColour[] }> = {};
  for (const s of [...systems].sort((a, b) => a.id.localeCompare(b.id))) {
    out[s.id] = { name: s.data.name, short: s.data.shortName, year: String(s.data.year), color: s.data.color, colours: s.data.colours ?? [] };
  }
  return out;
}
