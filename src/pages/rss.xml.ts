import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getActivePlatforms } from '../lib/platforms';

export async function GET(context: APIContext) {
  const platforms = await getActivePlatforms();
  const gamesEntries = await getCollection('games');

  const items = platforms
    .map(platform => {
      const entry =
        gamesEntries.find(g => g.data.platform === platform.id && g.data.track === 'assembly') ||
        gamesEntries.find(g => g.data.platform === platform.id);
      const game = entry?.data.games?.[0];

      if (!entry || !game) return null;

      return {
        title: `${game.name} - ${platform.data.name}`,
        pubDate: new Date(),
        description: game.tagline,
        link: `/${platform.id}/${entry.data.track}/${game.slug}/`,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 4);

  return rss({
    title: "Code Like It's 198x",
    description: "Learn assembly by building games on classic 8-bit and 16-bit systems. New lessons, tutorials, and articles about retro game development.",
    site: context.site?.toString() || 'https://code198x.stevehill.xyz',
    items,
    customData: `<language>en-gb</language>`,
  });
}
