import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPlatformBySlug } from '../lib/platforms';

export async function GET(context: APIContext) {
  const unitPages = await getCollection('unit-pages');

  // Only include units with a pubDate
  const published = unitPages
    .filter(entry => entry.data.pubDate)
    .sort((a, b) => b.data.pubDate!.getTime() - a.data.pubDate!.getTime());

  const items = await Promise.all(published.map(async (entry) => {
    // ID: "sinclair-zx-spectrum/assembly/game-01-shadowkeep/unit-06"
    const parts = entry.id.split('/');
    const platformSlug = parts[0];
    const gameSlug = parts[2] ?? '';
    const gameName = gameSlug
      .replace(/^game-\d+-/, '')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const platform = await getPlatformBySlug(platformSlug);
    const platformName = platform?.data.shortName ?? platformSlug;

    return {
      title: `Unit ${entry.data.unit}: ${entry.data.title} — ${gameName} (${platformName})`,
      pubDate: entry.data.pubDate!,
      description: entry.data.description ?? '',
      link: `/${entry.id}/`,
    };
  }));

  return rss({
    title: "Code Like It's 198x",
    description: "Learn programming by building games on classic 8-bit and 16-bit systems. New units, tutorials, and articles about retro game development.",
    site: context.site?.toString() || 'https://code198x.com',
    items,
    customData: `<language>en-gb</language>`,
  });
}
