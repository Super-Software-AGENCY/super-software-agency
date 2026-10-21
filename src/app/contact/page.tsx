import type { Metadata } from 'next';
import { Mail, MapPin, Clock, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/sections/Footer';
import { ContactForm } from '@/components/forms/ContactForm';
import { Card } from '@/components/ui/Card';
import { COMPANY } from '@/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us — Free Consultation',
  description:
    'Book a free 30-minute software development consultation with our Karachi team. Email hello@supersoftware.agency and get a reply within 24 hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Super Software',
    description: 'Get a free 30-minute software development consultation. Response within 24 hours.',
    url: `${COMPANY.website}/contact`,
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

const contactDetails = [
  {
    icon: Mail,
    label: 'Email',
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    note: 'Best for detailed enquiries',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: COMPANY.phone,
    href: `tel:${COMPANY.phone.replace(/\s/g, '')}`,
    note: 'Mon–Fri, 9am–7pm PKT',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: COMPANY.location,
    href: 'https://www.google.com/maps/search/?api=1&query=Karachi+Sindh+Pakistan',
    note: 'Working with clients worldwide',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: COMPANY.responseTime,
    note: 'Guaranteed for every enquiry',
  },
];

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${COMPANY.name}`,
    url: `${COMPANY.website}/contact`,
    mainEntity: { '@id': `${COMPANY.website}/#organization` },
  };

  const contactPointSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    url: COMPANY.website,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: COMPANY.phone,
        contactType: 'customer service',
        email: COMPANY.email,
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.website },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${COMPANY.website}/contact` },
    ],
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen flex-col outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPointSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />


      <section className="pt-24 pb-10 sm:pt-28 sm:pb-12 bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230ea5e9%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"
          aria-hidden="true"
        />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Let&apos;s build <span className="gradient-text">something great</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have a project in mind, a question about our services, or just want to explore whether we are the right
            fit? Send us a message — we reply within 24 hours, always.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 -mt-6 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="sr-only">Contact details</h2>
              {contactDetails.map((detail) => (
                <Card key={detail.label} variant="hover" padding="md">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                      <detail.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">
                        {detail.label}
                      </div>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          {...(detail.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="inline-block py-1 font-semibold text-slate-900 hover:text-primary-600 transition-colors break-words"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <div className="font-semibold text-slate-900">{detail.value}</div>
                      )}
                      {detail.note && <div className="text-sm text-slate-500 mt-0.5">{detail.note}</div>}
                    </div>
                  </div>
                </Card>
              ))}

              <Card padding="md" className="bg-gradient-to-br from-primary-600 to-accent-600 border-0 text-white">
                <MessageSquare className="w-7 h-7 mb-3" aria-hidden="true" />
                <h3 className="font-bold mb-1">Prefer a proper brief?</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  For detailed project requirements, use our custom service request form — it captures budget,
                  timeline, and every feature you need in one go.
                </p>
                <Link
                  href="/services?custom=true"
                  className="inline-flex items-center gap-1.5 py-1.5 text-white font-semibold text-sm hover:gap-2.5 transition-all"
                >
                  Open Custom Request Form
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <h2 className="sr-only">Send us a message</h2>
              <Card padding="lg">
                <ContactForm />
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
