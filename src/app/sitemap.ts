import type { MetadataRoute } from 'next';
import { COMPANY } from '@/data';
import { ALL_CITY_PAGES } from '@/data/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Spelled out rather than inferred: the map over the city list widens the
  // string type, which Next's Sitemap type rejects.
  const entries: MetadataRoute.Sitemap = [
    {
      url: COMPANY.website,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Every city page, local and international. This had been reading the local
    // three only, so the twenty-seven international pages existed, were
    // reachable and were fully built — and were not in the sitemap, which means
    // no search engine would ever have been told about them.
    //
    // The Pakistani cities are weighted above the rest: the primary keyword is
    // "software development agency Karachi", and a diluted equal-weight sitemap
    // would bury the page that matters most.
    ...ALL_CITY_PAGES.map((city) => ({
      url: `${COMPANY.website}/${city.slug}-software-development-agency`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: ['karachi', 'lahore', 'islamabad'].includes(city.slug) ? 0.95 : 0.7,
    })),
    {
      url: `${COMPANY.website}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${COMPANY.website}/case-studies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${COMPANY.website}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${COMPANY.website}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  return entries;
}
