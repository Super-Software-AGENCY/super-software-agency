import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Footer } from '@/components/sections/Footer';
import { Navbar } from '@/components/sections/Navbar';
import { ALL_CITY_PAGES, CITY_REGIONS, getCityPage, type CityPage } from '@/data/cities';
import { COMPANY } from '@/data/company';
import { services } from '@/data/services';

/**
 * One page per city, at /karachi-software-development-agency and friends.
 *
 * The folder is a plain [city] segment and the whole slug is generated, because
 * Next.js does not support partial-segment dynamic folders. The URL still reads
 * like the phrase people actually type, which is the whole point.
 */
// Only the cities we have real content for exist. Anything else 404s at the
// routing level, so a thin page can never be generated for a made-up place.
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_CITY_PAGES.map((c) => ({ city: `${c.slug}-software-development-agency` }));
}

type Params = { params: Promise<{ city: string }> };

/**
 * Turn "karachi-software-development-agency" back into the city it names, and
 * tolerate a few other ways the slug may have been written. Returns undefined
 * for anything we have no content for, so the caller renders a 404 rather than
 * a blank page.
 */
function resolve(slug: string | undefined): CityPage | undefined {
  if (!slug || typeof slug !== 'string') return undefined;

  const direct = getCityPage(slug);
  if (direct) return direct;

  const stripped = slug
    .replace(/-software-development-agency$/, '')
    .replace(/^software-development-agency-in-/, '')
    .replace(/-software-company$/, '')
    .replace(/-in$/, '');
  return getCityPage(stripped);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city: slug } = await params;
  const city = resolve(slug);
  if (!city) return { title: 'Page not found', robots: { index: false, follow: false } };

  // The root layout appends " | Super Software" to every title, so these must
  // not repeat the brand or the result reads "Super Software | Super Software".
  // Staying near 50 characters keeps the whole thing inside Google's cut-off.
  const title = `Software Development Agency in ${city.name}`;

  // Written out rather than sliced off `intro`, which used to chop mid-word.
  const description = `Looking for a software development agency in ${city.name}? Super Software builds web apps, mobile apps, AI and cloud systems. Free quote, fixed price.`;

  return {
    title,
    description,
    alternates: { canonical: `/${city.slug}-software-development-agency` },
    openGraph: {
      title: `${title} | ${COMPANY.name}`,
      description,
      url: `${COMPANY.website}/${city.slug}-software-development-agency`,
      type: 'website',
      siteName: COMPANY.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${COMPANY.name} — software development agency in ${city.name}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${COMPANY.name}`,
      description,
      images: ['/og-image.png'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function CityAgencyPage({ params }: Params) {
  const { city: slug } = await params;
  const city = resolve(slug);
  if (!city) notFound();

  const pageUrl = `${COMPANY.website}/${city.slug}-software-development-agency`;

  // LocalBusiness schema. This is what lets Google attach the address, hours and
  // phone to a local result rather than just showing a blue link.
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${pageUrl}/#business`,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: pageUrl,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    description: city.intro,
    image: `${COMPANY.website}/og-image.png`,
    logo: `${COMPANY.website}/logo.png`,
    foundingDate: COMPANY.founded,
    priceRange: '$$',
    currenciesAccepted: 'PKR, USD',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: 'PK',
    },
    geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
    areaServed: [
      { '@type': 'City', name: city.name },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'City', name: 'Lahore' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: Object.values(COMPANY.social),
    parentOrganization: { '@id': `${COMPANY.website}/#organization` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Software development services in ${city.name}`,
      itemListElement: services.slice(0, 6).map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.shortDescription },
        areaServed: { '@type': 'City', name: city.name },
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.website },
      { '@type': 'ListItem', position: 2, name: `Software development in ${city.name}`, item: pageUrl },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does software development cost for a business in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Most projects land between $8,000 and $50,000+. You get a fixed, itemised quote after a free 30-minute discovery call. If the budget is smaller than the idea, we will tell you honestly what is achievable within it rather than padding the scope.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do you work with clients outside ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Around 60% of our clients are in the US, UK, EU, UAE and Australia. We work asynchronously across time zones and hold calls that fit PKT business hours.',
        },
      },
      {
        '@type': 'Question',
        name: `Can you meet in person in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: city.localNote,
        },
      },
    ],
  };

  // Only same-country cities are suggested. A Lagos page linking to Bratislava
// helps nobody and spreads link equity across thirty unrelated markets; the
// neighbouring-city links are the ones a reader might actually be looking for.
const sameRegion = new Set(CITY_REGIONS[city.slug]);
const otherCities = ALL_CITY_PAGES.filter(
  (c) => c.slug !== city.slug && sameRegion.has(c.slug),
);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"
            aria-hidden="true"
          />
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Software development agency in {city.name}
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Software Development Agency in {city.name}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{city.intro}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get a fixed quote
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/services" className="inline-flex w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    See our services
                  </Button>
                </Link>
              </div>

              {/* Contact facts, in plain text as well as links. Google reads these
                  as well as people do. */}
              <dl className="mt-10 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">
                <div>
                  <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Phone className="h-4 w-4" aria-hidden="true" /> Phone
                  </dt>
                  <dd className="mt-1">
                    <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="font-semibold text-slate-900 hover:text-primary-700">
                      {COMPANY.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Mail className="h-4 w-4" aria-hidden="true" /> Email
                  </dt>
                  <dd className="mt-1">
                    <a href={`mailto:${COMPANY.email}`} className="font-semibold text-slate-900 hover:text-primary-700">
                      {COMPANY.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Clock className="h-4 w-4" aria-hidden="true" /> Hours
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">Mon–Fri, 9am–7pm PKT</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Why local */}
        <section className="py-16 sm:py-20">
          <div className="container-custom grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                What working with a {city.name} agency actually means
              </h2>
              <p className="mt-5 leading-relaxed text-slate-600">{city.localContext}</p>
              <p className="mt-4 text-sm text-slate-500">{city.localNote}</p>
            </div>

            <Card padding="lg">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Building2 className="h-5 w-5 text-primary-600" aria-hidden="true" />
                Industries we build for in {city.name}
              </h3>
              <ul className="mt-4 space-y-3">
                {city.industries.map((industry) => (
                  <li key={industry} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="text-slate-700">{industry}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* Common needs — the long-tail queries, answered properly. */}
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="container-custom">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-900">
              What businesses in {city.name} ask us for
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {city.commonNeeds.map((need) => (
                <Card key={need.title} padding="lg" variant="hover">
                  <h3 className="text-lg font-bold text-slate-900">{need.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-slate-600">{need.detail}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 sm:py-20">
          <div className="container-custom">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Software development services in {city.name}
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Every service below is delivered by the same senior team that scopes the project. No hand-off to
              a team you have not met.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="block h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <h3 className="font-bold text-slate-900">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.shortDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Other cities — real internal links, which help both users and Google. */}
        <section className="border-t border-slate-100 bg-white py-12">
          <div className="container-custom">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Also serving businesses in
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {otherCities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}-software-development-agency`}
                    className="inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800"
                  >
                    Software development in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 py-16 sm:py-20">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white">
              Need software built in {city.name}?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Tell us what you are trying to do. We will tell you honestly whether we are the right fit,
              and if we are not, we will point you to somebody who is.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-medium text-slate-900 transition-colors hover:bg-slate-100"
              >
                Book a free 30-minute call
              </Link>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 px-8 py-4 text-lg font-medium text-white transition-colors hover:border-white"
              >
                {COMPANY.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}