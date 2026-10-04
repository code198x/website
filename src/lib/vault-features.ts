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
