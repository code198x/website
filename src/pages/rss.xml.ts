import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPlatformBySlug } from '../lib/platforms';

interface FeedItem {
  title: string;
  pubDate: Date;
  description: string;
  link: string;
}

export async function GET(context: APIContext) {
  // Curriculum units with a pubDate
  const unitPages = await getCollection('unit-pages');
  const unitItems: FeedItem[] = await Promise.all(
    unitPages
      .filter(entry => entry.data.pubDate)
      .map(async (entry) => {
        // ID: "sinclair-zx-spectrum/assembly/game-01-shadowkeep/unit-06"
        const parts = entry.id.split('/');
        const platformSlug = parts[0];
        const moduleSlug = parts[2] ?? '';
        const gameName = moduleSlug
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
      })
  );

  // From the Metal essays (pubDate is required on the collection)
  const ftm = await getCollection('from-the-metal');
  const ftmItems: FeedItem[] = ftm.map((entry) => ({
    title: `From the Metal: ${entry.data.title}`,
    pubDate: entry.data.pubDate,
    description: entry.data.description ?? '',
    link: `/from-the-metal/${entry.id}/`,
  }));

  const items = [...unitItems, ...ftmItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    title: "Code Like It's 198x",
    description: "Learn programming by building games on classic 8-bit and 16-bit systems. New units, tutorials, and articles about retro game development.",
    site: context.site?.toString() || 'https://code198x.com',
    items,
    customData: `<language>en-gb</language>`,
  });
}
