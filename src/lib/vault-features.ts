import { vaultColourGroup } from './vault-colours';

export interface VaultFeatureSelection {
  article: string;
  headline: string;
  deck: string;
  linkText: string;
  images: Array<{ src: string; alt: string; caption: string; width: number; height: number }>;
  related: string[];
}
interface Article {
  id: string;
  body?: string;
  data: { title: string; category: string; reviewed: boolean; subtitle?: string };
}

export interface VaultExplorationSelection {
  article: string;
  headline: string;
  deck: string;
  connections: Array<{ from: string; to: string; label: string; explanation: string }>;
}

/** Curated introductions only use reviewed entries; no inferred relationships. */
export function resolveVaultDiscoveries<T extends Article>(ids: string[], entries: T[]) {
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate Vault discovery');
  return ids.map(id => {
    const entry = byId.get(id);
    if (!entry) throw new Error(`Vault discovery does not exist: ${id}`);
    if (!entry.data.reviewed) throw new Error(`Vault discovery must be reviewed: ${id}`);
    return entry;
  });
}

export function resolveVaultExploration<T extends Article>(selection: VaultExplorationSelection, entries: T[]) {
  const [entry] = resolveVaultDiscoveries([selection.article], entries);
  if (!selection.headline.trim() || !selection.deck.trim() || !selection.connections.length) {
    throw new Error('Vault exploration needs a headline, deck and connections');
  }
  const reached = new Set([entry.id]);
  const connections = selection.connections.map(connection => {
    const [from, to] = resolveVaultDiscoveries([connection.from, connection.to], entries);
    if (!reached.has(from.id) || reached.has(to.id)) throw new Error(`Disconnected or repeated Vault connection: ${to.id}`);
    // An authored explanation still needs editorial checking. This check only
    // confirms that its source entry actually links to the selected destination.
    const links = [...(from.body ?? '').matchAll(/\]\(\/vault\/([^\s)#]+)(?:#[^\s)]*)?\)/g)]
      .map(match => match[1].replace(/\/$/, ''));
    if (!links.includes(to.id)) throw new Error(`Vault connection needs an article link: ${from.id} -> ${to.id}`);
    if (!connection.label.trim() || !connection.explanation.trim()) throw new Error(`Vault connection needs an explanation: ${to.id}`);
    reached.add(to.id);
    return { ...connection, from, to, colour: vaultColourGroup(to.data.category) };
  });
  return { ...selection, entry, connections, colour: vaultColourGroup(entry.data.category) };
}

/** Fail the build for stale selections, unreviewed features or unowned imagery. */
export function resolveVaultFeatures<T extends Article>(selections: VaultFeatureSelection[], entries: T[]) {
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const seen = new Set<string>();
  return selections.map(selection => {
    const article = byId.get(selection.article);
    if (!article) throw new Error(`Vault feature does not exist: ${selection.article}`);
    if (!article.data.reviewed) throw new Error(`Vault feature must be reviewed: ${selection.article}`);
    if (seen.has(selection.article)) throw new Error(`Duplicate Vault feature: ${selection.article}`);
    seen.add(selection.article);
    for (const field of ['headline', 'deck', 'linkText'] as const) {
      if (!selection[field].trim()) throw new Error(`Vault feature needs ${field}: ${selection.article}`);
    }
    if (!selection.images.length) throw new Error(`Vault feature needs an image: ${selection.article}`);
    for (const image of selection.images) {
      if (!image.src.startsWith('/images/') || !article.body?.includes(image.src)) {
        throw new Error(`Vault feature image must belong to its article: ${image.src}`);
      }
      if (!image.alt.trim() || !image.caption.trim() || !Number.isInteger(image.width) || image.width < 1 || !Number.isInteger(image.height) || image.height < 1) {
        throw new Error(`Invalid Vault feature image: ${image.src}`);
      }
    }
    const related = selection.related.map(id => {
      const entry = byId.get(id);
      if (!entry) throw new Error(`Related Vault article does not exist: ${id}`);
      if (id === article.id) throw new Error(`Vault feature cannot relate to itself: ${id}`);
      return entry;
    });
    if (new Set(selection.related).size !== related.length) throw new Error(`Duplicate related Vault article: ${article.id}`);
    return { ...selection, entry: article, related, colour: vaultColourGroup(article.data.category) };
  });
}
