import type { Metadata } from 'next';
import { ServicesContent } from '@/components/sections/ServicesContent';
import { COMPANY } from '@/data';
import { services } from '@/data/services';

export const metadata: Metadata = {
  title: 'Software Development Services Karachi',
  description:
    'Custom web apps, AI & machine learning, mobile apps, cloud & DevOps, APIs, e-commerce, Web3 and consulting. Search, filter and request a build.',
  keywords: [
    'software development services',
    'custom web development services',
    'AI machine learning development services',
    'mobile app development services',
    'cloud devops services',
    'API development services',
    'e-commerce development agency',
    'blockchain web3 development',
    'software consulting services',
    'hire software developers',
    'MVP development agency',
    'Karachi software agency',
  ],
  alternates: { canonical: '/services' },
  openGraph: {
    title: `Software Development Services | ${COMPANY.name}`,
    description:
      'Custom web apps, AI & ML, mobile apps, cloud & DevOps, APIs, e-commerce, Web3 and consulting. Search, filter and request a custom build.',
    url: `${COMPANY.website}/services`,
    type: 'website',
    siteName: COMPANY.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Super Software — Software Development Services',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Software Development Services | ${COMPANY.name}`,
    description:
      '8 specialised software development service lines. Search, filter, and request a custom build.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Read filters on the server so the full page is server-rendered (SEO-safe).
  const params = await searchParams;
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category;
  const rawCustom = Array.isArray(params.custom) ? params.custom[0] : params.custom;
  const serviceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Software Development Services',
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.shortDescription,
        url: `${COMPANY.website}/services#${s.id}`,
        serviceType: s.title,
        provider: { '@id': `${COMPANY.website}/#organization` },
        areaServed: 'Worldwide',
        ...(s.startingPrice
          ? {
              offers: {
                '@type': 'Offer',
                price: s.startingPrice.replace(/[^0-9]/g, ''),
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
            }
          : {}),
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.website },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${COMPANY.website}/services` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicesContent initialCategory={rawCategory} openCustomForm={rawCustom === 'true'} />
    </>
  );
}
