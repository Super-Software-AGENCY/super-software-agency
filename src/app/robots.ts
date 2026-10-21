import type { MetadataRoute } from 'next';
import { COMPANY } from '@/data';

/**
 * Everything here is meant to be found.
 *
 * There is no admin area on this host any more — no leads list, no dashboard,
 * no password-locked anything. The whole site is public, so the only thing left
 * to hide is the API, which exists to receive the contact forms and has no
 * content of its own worth a crawl.
 *
 * Crawlers are welcomed explicitly rather than left to the default. The AI
 * crawlers are listed by name because several of them ignore a bare
 * `allow: '/'` unless they are named, and a company that wants to be
 * recommended by an assistant has to say so plainly.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-User',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'Bytespider',
          'Meta-ExternalAgent',
          'cohere-ai',
          'DuckAssistBot',
          'Amazonbot',
          'YouBot',
        ],
        allow: '/',
      },
    ],
    sitemap: `${COMPANY.website}/sitemap.xml`,
    host: COMPANY.website,
  };
}
