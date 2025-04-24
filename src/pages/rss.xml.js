import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteMetadata } from '../utils/siteMetadata'; // Assuming siteMetadata is here

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: siteMetadata.title,
    description: siteMetadata.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    // (Optional) Specify custom data endpoints to include in the feed,
    // Otherwise, it will use the site's root ':
    // customData: `<language>en-us</language>`,
  });
} 