import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/sections/Footer';
import { COMPANY } from '@/data';

export default function HomePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does a project cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most projects land between $8,000 and $50,000+, depending on scope, timeline, and technology choices. We give you a fixed, itemized quote after the discovery call.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does a typical project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A focused MVP ships in 4 to 8 weeks. A full-featured web application takes 8 to 16 weeks. Mobile apps and complex AI systems run 12 to 24 weeks.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you work with clients outside Pakistan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — roughly 60% of our clients are based in the US, UK, EU, UAE, and Australia. We work asynchronously across all time zones.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens after launch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every project includes 30 days of free post-launch support for bug fixes. After that, most clients move onto a monthly maintenance retainer.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer free consultations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The first 30-minute discovery call is completely free with no obligation.',
        },
      },
    ],
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: COMPANY.website,
      },
    ],
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen flex-col outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <Hero />
      <Services />
      <About />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
