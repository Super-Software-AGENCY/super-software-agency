import type { Metadata } from 'next';
import { CaseStudiesGrid, CaseStudiesCTA } from '@/components/sections/CaseStudies';
import { Footer } from '@/components/sections/Footer';
import { CASE_STUDIES, CASE_COPY } from '@/data/case-studies';
import { COMPANY } from '@/data/company';

export const metadata: Metadata = {
  title: 'Case Studies — Software We Shipped',
  description:
    'Real, publicly viewable software we built: 3D product showcases, AI resume screening, e-commerce, realtime multiplayer and MERN backends.',
  keywords: [
    'software agency case studies',
    'Next.js portfolio',
    'AI development examples',
    'MERN stack projects',
    'three.js web development',
    'e-commerce development examples',
  ],
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: `Case Studies | ${COMPANY.name}`,
    description: 'Real software we have shipped — every project links to its public repository.',
    url: `${COMPANY.website}/case-studies`,
    type: 'website',
    siteName: COMPANY.name,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Super Software case studies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Case Studies | ${COMPANY.name}`,
    description: 'Real software we have shipped — every project links to its public repository.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function CaseStudiesPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Super Software Case Studies',
    numberOfItems: CASE_STUDIES.length,
    itemListElement: CASE_STUDIES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: s.title,
        applicationCategory: 'WebApplication',
        description: s.summary,
        url: s.repoUrl,
        codeRepository: s.repoUrl,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.website },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${COMPANY.website}/case-studies` },
    ],
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen flex-col outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="pt-24 pb-12 sm:pt-28 sm:pb-14 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white text-primary-700 text-sm font-medium mb-6 shadow-soft">
            {CASE_COPY.eyebrow}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            {CASE_COPY.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {CASE_COPY.lead}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <CaseStudiesGrid />
        </div>
      </section>

      <CaseStudiesCTA />
      <Footer />
    </main>
  );
}