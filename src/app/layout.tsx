import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import PageTransition from '@/components/PageTransition';
import { Navbar } from '@/components/sections/Navbar';
import { Analytics } from '@/components/Analytics';
import { COMPANY } from '@/data';
import { services } from '@/data/services';

// Self-hosted so builds never depend on Google Fonts being reachable, and no
// third-party request is made from visitors' browsers.
const inter = localFont({
  src: './fonts/InterVariable.woff2',
  display: 'swap',
  variable: '--font-inter',
  weight: '100 900',
  style: 'normal',
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.website),
  title: {
    // Under ~60 characters so Google does not truncate it. "Karachi" is in here
    // on purpose: it is the word the homepage needs to compete on locally, and
    // the city pages carry the longer variants.
    default: 'Software Development Agency in Karachi | Super Software',
    template: `%s | ${COMPANY.name}`,
  },
  description:
    'Karachi software development agency building web apps, mobile apps, AI and cloud systems for startups and businesses across Pakistan.',
  keywords: [
    'software development agency',
    'software development agency Karachi',
    'software company Karachi',
    'custom web development',
    'AI machine learning development',
    'mobile app development',
    'cloud devops services',
    'API development',
    'e-commerce development',
    'blockchain web3 development',
    'software consulting',
    'full stack development',
    'hire software developers',
    'MERN stack development',
    'Next.js development agency',
    'React development',
    'Node.js backend development',
  ],
  authors: [{ name: COMPANY.name, url: COMPANY.website }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  applicationName: COMPANY.name,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: COMPANY.website,
    siteName: COMPANY.name,
    title: `${COMPANY.name} — Custom Software Development Agency`,
    description: COMPANY.shortDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${COMPANY.name} — Software Development Agency`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.name} — Custom Software Development Agency`,
    description: COMPANY.shortDescription,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon-32.png'],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#17497a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${COMPANY.website}/#organization`,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: COMPANY.website,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    foundingDate: COMPANY.founded,
    description: COMPANY.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 24.8607,
      longitude: 67.0011,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: Object.values(COMPANY.social),
    areaServed: [
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'City', name: 'Lahore' },
      { '@type': 'City', name: 'Islamabad' },
      { '@type': 'City', name: 'Rawalpindi' },
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'AdministrativeArea', name: 'Worldwide' },
    ],
    // NOTE: no aggregateRating here on purpose.
    //
    // Google requires review markup to match reviews that are visible on the
    // page, and will ignore or penalise a site that claims ratings it cannot
    // show. Add it back only once real reviews are on the page AND on a Google
    // Business Profile. A fake one can cost far more traffic than it wins.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software Development Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.shortDescription },
      })),
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${COMPANY.website}/#website`,
    url: COMPANY.website,
    name: COMPANY.name,
    description: COMPANY.description,
    publisher: { '@id': `${COMPANY.website}/#organization` },
    inLanguage: 'en-US',
  };

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Software Development Services',
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
        offers: s.startingPrice
          ? {
              '@type': 'Offer',
              price: s.startingPrice.replace(/[^0-9]/g, ''),
              priceCurrency: 'USD',
            }
          : undefined,
      },
    })),
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen bg-white font-sans`}>
        {/* Navbar lives in the root layout so it renders on EVERY route */}
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Analytics />
      </body>
    </html>
  );
}
