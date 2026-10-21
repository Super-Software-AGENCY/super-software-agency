import type { Metadata } from 'next';
import { About } from '@/components/sections/About';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/sections/Footer';
import { COMPANY } from '@/data';
import { services } from '@/data/services';

export const metadata: Metadata = {
  title: 'About Us — Software Agency Karachi',
  description:
    'A senior software development agency in Karachi, Pakistan. Since 2019 we have shipped 150+ production projects for startups and enterprises worldwide.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Super Software — Software Development Agency',
    description:
      'A senior engineering team building custom web apps, AI systems, mobile apps, and cloud infrastructure for businesses worldwide.',
    url: `${COMPANY.website}/about`,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630        ,
        alt: 'Super Software — Software Development Agency',
        type: 'image/png',
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${COMPANY.name}`,
    url: `${COMPANY.website}/about`,
    mainEntity: { '@id': `${COMPANY.website}/#organization` },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.website },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${COMPANY.website}/about` },
    ],
  };

  const teamSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Expertise Areas',
    itemListElement: services.map((s) => ({
      '@type': 'ListItem',
      item: { '@type': 'Service', name: s.title, description: s.shortDescription },
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen flex-col outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Page header — provides the page's single <h1> for SEO */}
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-12 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white text-primary-700 text-sm font-medium mb-6 shadow-soft">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto">
            The team behind <span className="gradient-text">Super Software</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A senior engineering team in Karachi building custom web applications, AI systems, mobile apps and
            cloud infrastructure for startups, scale-ups and enterprises since 2019.
          </p>
        </div>
      </section>
      <About />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
