/**
 * City pages for local search.
 *
 * "software development agency Karachi" is a local intent query, and a dedicated
 * page per city is the single biggest on-site lever for it. Each city gets its
 * own URL, its own title, its own real content and its own LocalBusiness
 * schema — thin duplicated pages with just a swapped city name do the opposite
 * and get ignored.
 *
 * Every fact here has to stay true. Changing a claim to sound better is how a
 * page ends up ranking for nothing.
 */

export interface CityPage {
  slug: string;
  name: string;
  /** The word people actually search, used in the title and H1. */
  keyword: string;
  region: string;
  lat: number;
  lng: number;
  /** Short, specific paragraph for the meta description and the intro. */
  intro: string;
  /** Why being in this city matters for a software agency. Real, not filler. */
  localContext: string;
  /** Industries that actually buy software here. */
  industries: string[];
  /** What this city usually asks for first. */
  commonNeeds: { title: string; detail: string }[];
  /** A real, checkable local fact. Kept short so it cannot go stale fast. */
  localNote: string;
}

export const CITY_PAGES: CityPage[] = [
  {
    slug: 'karachi',
    name: 'Karachi',
    keyword: 'software development agency in Karachi',
    region: 'Sindh',
    lat: 24.8607,
    lng: 67.0011,
    intro:
      'Super Software is a software development agency based in Karachi. We build web applications, mobile apps, AI systems and cloud infrastructure for companies across Pakistan and abroad.',
    localContext:
      'Karachi is Pakistan’s commercial centre, so most of our work here comes from businesses that already have customers and now need the software to match. That usually means replacing a stack of disconnected tools, or building the first proper system rather than a prototype.',
    industries: [
      'Fintech and payments',
      'Logistics and freight',
      'Healthcare and clinics',
      'Retail and e-commerce',
      'Real estate and construction',
      'Education and edtech',
    ],
    commonNeeds: [
      {
        title: 'A real website that brings in leads',
        detail:
          'Most Karachi SMEs have a page on Google that a customer cannot use. We build fast, mobile-first sites with the enquiry path built in from the start.',
      },
      {
        title: 'Custom web applications',
        detail:
          'When spreadsheets stop scaling. We build internal tools, dashboards and portals that replace the manual work a small team is doing every day.',
      },
      {
        title: 'E-commerce that actually converts',
        detail:
          'Stores that load fast on a mid-range Android, work on mobile wallets, and can be maintained by your own team afterwards.',
      },
      {
        title: 'Mobile apps',
        detail:
          'Android-first, iOS-ready, built once against a shared API so you are not maintaining two separate products.',
      },
    ],
    localNote:
      'We work with Karachi businesses in English and Urdu, and can meet at a Karachi address if you would rather talk in person than on a call.',
  },
  {
    slug: 'lahore',
    name: 'Lahore',
    keyword: 'software development agency in Lahore',
    region: 'Punjab',
    lat: 31.5204,
    lng: 74.3587,
    intro:
      'Super Software builds software for companies in Lahore — web applications, mobile apps, AI systems and cloud infrastructure — from a senior team based in Karachi.',
    localContext:
      'Lahore’s software scene skews towards agencies and a large freelance pool, which makes choosing hard rather than easy. The difference is whether the team you get is the team that wrote the code, and whether they are still around in six months.',
    industries: [
      'Textiles and apparel',
      'Manufacturing',
      'Media and publishing',
      'Agri-tech',
      'Professional services',
      'NGOs and development sector',
    ],
    commonNeeds: [
      {
        title: 'An internal tool that replaces a manual process',
        detail:
          'Inventory, approvals, reporting — the spreadsheet-and-WhatsApp routine that quietly costs a team a day a week.',
      },
      {
        title: 'AI and document automation',
        detail:
          'We build RAG and fine-tuning work that turns your own documents and support history into something staff can actually query.',
      },
      {
        title: 'Rescuing a codebase',
        detail:
          'Plenty of projects were started and abandoned. We audit first, tell you honestly what is salvageable, then plan from there.',
      },
      {
        title: 'Cloud cost and reliability',
        detail:
          'Moving off an oversized bill, or fixing deploys that only work on one developer’s machine.',
      },
    ],
    localNote:
      'We meet clients in Lahore at a location of your choosing, and all project work happens on calls that fit PKT business hours.',
  },
  {
    slug: 'islamabad',
    name: 'Islamabad',
    keyword: 'software development agency in Islamabad',
    region: 'Capital Territory',
    lat: 33.6844,
    lng: 73.0479,
    intro:
      'Super Software is a software development agency serving Islamabad businesses with custom web applications, mobile apps, AI and cloud work.',
    localContext:
      'Islamabad has a high concentration of government-adjacent, NGO and enterprise work. That usually means procurement-grade expectations: documentation, security review, and code that survives an audit.',
    industries: [
      'Government and public sector',
      'NGOs and development organisations',
      'Banking and fintech',
      'Telecommunications',
      'Consulting',
      'Healthcare',
    ],
    commonNeeds: [
      {
        title: 'Procurement and audit readiness',
        detail:
          'Documentation, security posture and architecture records written so they pass review without a second round of questions.',
      },
      {
        title: 'Secure web platforms',
        detail:
          'Role-based access, audit logs, encryption at rest and in transit, and deployment you can hand to your own operations team.',
      },
      {
        title: 'Data and reporting systems',
        detail:
          'Turning scattered spreadsheets into one reporting layer that your leadership and your auditors can both use.',
      },
      {
        title: 'Team augmentation',
        detail:
          'Senior engineers joining an existing in-house team for a defined piece of work, with no hand-off to juniors afterwards.',
      },
    ],
    localNote:
      'We work with clients in Islamabad and Rawalpindi on site when a project needs face-to-face workshops.',
  },
];

/* ----------------------- international cities ----------------------- */

/**
 * Why these cities get pages and others do not.
 *
 * A page is written for a market the business can actually sell into. That
 * means English-speaking or a language the team works in, and a market with
 * enough small business to be worth the effort. A page for somewhere nobody can
 * be reached is a page written for an audience that cannot read it.
 *
 * The UK, US and Western Europe are absent on purpose. They are saturated with
 * agencies competing on price, and being listed among them is worse than not
 * being listed at all.
 */
const INTERNATIONAL: {
  slug: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  /** Whether the city page is written in English. */
  english: boolean;
}[] = [
  { slug: 'dubai', name: 'Dubai', country: 'UAE', region: 'Dubai', lat: 25.2048, lng: 55.2708, english: true },
  { slug: 'lagos', name: 'Lagos', country: 'Nigeria', region: 'Lagos State', lat: 6.5244, lng: 3.3792, english: true },
  { slug: 'abuja', name: 'Abuja', country: 'Nigeria', region: 'FCT', lat: 9.0765, lng: 7.3986, english: true },
  { slug: 'accra', name: 'Accra', country: 'Ghana', region: 'Greater Accra', lat: 5.6037, lng: -0.187, english: true },
  { slug: 'nairobi', name: 'Nairobi', country: 'Kenya', region: 'Nairobi County', lat: -1.2921, lng: 36.8219, english: true },
  { slug: 'kampala', name: 'Kampala', country: 'Uganda', region: 'Central Region', lat: 0.3476, lng: 32.5825, english: true },
  { slug: 'dar-es-salaam', name: 'Dar es Salaam', country: 'Tanzania', region: 'Dar es Salaam', lat: -6.7924, lng: 39.2083, english: true },
  { slug: 'lusaka', name: 'Lusaka', country: 'Zambia', region: 'Lusaka Province', lat: -15.3875, lng: 28.3228, english: true },
  { slug: 'harare', name: 'Harare', country: 'Zimbabwe', region: 'Harare', lat: -17.8252, lng: 31.0335, english: true },
  { slug: 'delhi', name: 'Delhi', country: 'India', region: 'Delhi', lat: 28.6139, lng: 77.209, english: true },
  { slug: 'mumbai', name: 'Mumbai', country: 'India', region: 'Maharashtra', lat: 19.076, lng: 72.8777, english: true },
  { slug: 'dhaka', name: 'Dhaka', country: 'Bangladesh', region: 'Dhaka Division', lat: 23.8103, lng: 90.4125, english: true },
  { slug: 'colombo', name: 'Colombo', country: 'Sri Lanka', region: 'Western Province', lat: 6.9271, lng: 79.8612, english: true },
  { slug: 'kathmandu', name: 'Kathmandu', country: 'Nepal', region: 'Bagmati', lat: 27.7172, lng: 85.324, english: true },
  { slug: 'manila', name: 'Manila', country: 'Philippines', region: 'Metro Manila', lat: 14.5995, lng: 120.9842, english: true },
  { slug: 'cairo', name: 'Cairo', country: 'Egypt', region: 'Cairo Governorate', lat: 30.0444, lng: 31.2357, english: true },
  { slug: 'amman', name: 'Amman', country: 'Jordan', region: 'Amman Governorate', lat: 31.9454, lng: 35.9284, english: true },
  { slug: 'beirut', name: 'Beirut', country: 'Lebanon', region: 'Beirut Governorate', lat: 33.8938, lng: 35.5018, english: true },
  { slug: 'mexico-city', name: 'Mexico City', country: 'Mexico', region: 'CDMX', lat: 19.4326, lng: -99.1332, english: true },
  { slug: 'bogota', name: 'Bogotá', country: 'Colombia', region: 'Bogotá D.C.', lat: 4.711, lng: -74.0721, english: true },
  { slug: 'lima', name: 'Lima', country: 'Peru', region: 'Lima', lat: -12.0464, lng: -77.0428, english: true },
  { slug: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', region: 'Riyadh', lat: 24.7136, lng: 46.6753, english: true },
  { slug: 'doha', name: 'Doha', country: 'Qatar', region: 'Doha', lat: 25.2854, lng: 51.531, english: true },
  { slug: 'jakarta', name: 'Jakarta', country: 'Indonesia', region: 'Jakarta', lat: -6.2088, lng: 106.8456, english: false },
  { slug: 'hanoi', name: 'Hanoi', country: 'Vietnam', region: 'Hanoi', lat: 21.0278, lng: 105.8342, english: false },
  { slug: 'bucharest', name: 'Bucharest', country: 'Romania', region: 'Bucharest', lat: 44.4268, lng: 26.1025, english: true },
  { slug: 'chisinau', name: 'Chișinău', country: 'Moldova', region: 'Chișinău', lat: 47.0105, lng: 28.8638, english: true },
];

/**
 * What a business in this city is usually trying to fix.
 *
 * Written per market rather than reused across all of them. These markets were
 * picked because software demand is genuinely unmet in them, and the reason it
 * is unmet differs — a Nigerian retailer needs WhatsApp to become a storefront,
 * a Bangladeshi garment factory needs an export dashboard. Saying the same
 * sentence thirty times is exactly the thin-duplication Google ignores.
 */
function needsFor(country: string): { title: string; detail: string }[] {
  const byCountry: Record<string, { title: string; detail: string }[]> = {
    Nigeria: [
      { title: 'Turning WhatsApp into a real storefront', detail: 'Catalogue, payments and delivery tracking on one link a customer can open without installing anything.' },
      { title: 'Offline-tolerant field tools', detail: 'Software that keeps working through a power cut and syncs when the network comes back.' },
      { title: 'School and clinic records', detail: 'Patient or student history that a single practice can finally keep in one place.' },
    ],
    Ghana: [
      { title: 'Mobile money integration', detail: 'Accepting and reconciling mobile money payments without a spreadsheet in between.' },
      { title: 'Appointment booking', detail: 'Letting customers book and pay without calling, and reducing the no-shows that follow.' },
      { title: 'Inventory that matches the shop floor', detail: 'Stock levels that update at the point of sale instead of at the end of the month.' },
    ],
    Kenya: [
      { title: 'M-Pesa and card payments', detail: 'One checkout handling every payment method a Kenyan customer actually uses.' },
      { title: 'Agritech and supply chain', detail: 'Coordinating produce from smallholder farms through aggregation to the buyer.' },
      { title: 'Logistics and fleet tracking', detail: 'Route, delivery and fuel tracking for a growing transport operation.' },
    ],
    Uganda: [
      { title: 'Mobile-money first checkout', detail: 'Payments that work on an entry-level Android phone over a slow connection.' },
      { title: 'School management systems', detail: 'Enrolment, fees, exams and parent communication in one system.' },
      { title: 'Agricultural market data', detail: 'Price and buyer information for the smallholder trade.' },
    ],
    Tanzania: [
      { title: 'Mobile money commerce', detail: 'Selling and paying out over mobile money, with reconciliation built in.' },
      { title: 'Tourism and booking systems', detail: 'Availability, booking and payment for lodges and tour operators.' },
      { title: 'Logging and supply chain data', detail: 'Traceability from forest or farm through to the shipment leaving the country.' },
    ],
    Zambia: [
      { title: 'Mining supplier platforms', detail: 'Supplier registration, quotations and compliance in one place.' },
      { title: 'Mobile-money retail', detail: 'Retail systems that settle over mobile money without manual reconciliation.' },
      { title: 'Agriculture and aggregation', detail: 'Managing farmer intake, grading and payment at collection points.' },
    ],
    Zimbabwe: [
      { title: 'Payments that work locally', detail: 'Ecocash and bank transfer flows, with the reversals handled properly.' },
      { title: 'Clinic and pharmacy systems', detail: 'Patient records, stock and dispensing for clinics that still run on paper.' },
      { title: 'Cross-border trading support', detail: 'Managing orders and compliance across the region\'s informal trade routes.' },
    ],
    India: [
      { title: 'D2C commerce at scale', detail: 'Storefront, inventory, logistics and returns that hold up past the first festival sale.' },
      { title: 'Billing and GST compliance', detail: 'Invoicing and reporting that matches what the business must file.' },
      { title: 'Internal tooling', detail: 'Replacing the spreadsheets and WhatsApp groups that run operations day to day.' },
    ],
    Bangladesh: [
      { title: 'Garment factory systems', detail: 'Production tracking, line efficiency and buyer reporting for export manufacturers.' },
      { title: 'Remittance and payments', detail: 'Cross-border payment flows that reconcile cleanly on both ends.' },
      { title: 'Education platforms', detail: 'Coaching centres managing admission, fees and results without paper registers.' },
    ],
    'Sri Lanka': [
      { title: 'Tourism and booking', detail: 'Availability and reservations for hotels and tour operators.' },
      { title: 'Apparel supply chain', detail: 'Order, capacity and shipment tracking for export manufacturers.' },
      { title: 'SME accounting', detail: 'Books and payroll that small businesses can actually keep current.' },
    ],
    Nepal: [
      { title: 'Tourism and trekking booking', detail: 'Itineraries, deposits and availability for trekking and adventure operators.' },
      { title: 'Digital payments', detail: 'Wallet and bank integration for businesses that rarely deal in cash.' },
      { title: 'Education management', detail: 'Admissions, fees and results for schools and colleges.' },
    ],
    Philippines: [
      { title: 'BPO and support tooling', detail: 'Ticketing, QA and workforce management for support operations.' },
      { title: 'SMB commerce', detail: 'Storefront and delivery tracking for small retail and food businesses.' },
      { title: 'Bilingual back-office', detail: 'English and Tagalog interfaces for staff who work in both.' },
    ],
    Indonesia: [
      { title: 'Marketplace and commerce', detail: 'Multi-seller listings, orders and settlement.' },
      { title: 'Logistics tracking', detail: 'Delivery visibility across an archipelago where address quality is poor.' },
      { title: 'SME inventory and billing', detail: 'Stock, invoicing and tax reporting for small businesses.' },
    ],
    Vietnam: [
      { title: 'Manufacturing and export systems', detail: 'Production planning and buyer reporting for exporters.' },
      { title: 'Retail and e-commerce', detail: 'Storefront, inventory and delivery for growing brands.' },
      { title: 'Internal operations', detail: 'Order, inventory and finance systems replacing spreadsheets.' },
    ],
    Egypt: [
      { title: 'Local payments', detail: 'Cash-on-delivery and local card flows, which dominate Egyptian commerce.' },
      { title: 'Retail and marketplace', detail: 'Storefronts with the settlement rules Egyptian customers expect.' },
      { title: 'Service and booking platforms', detail: 'Scheduling and payment for clinics, salons and workshops.' },
    ],
    Jordan: [
      { title: 'Service booking systems', detail: 'Appointments and payment for clinics, salons and trades.' },
      { title: 'Retail and delivery', detail: 'Storefront, stock and delivery tracking for local retail.' },
      { title: 'Government and enterprise portals', detail: 'Secure forms, approvals and reporting behind a login.' },
    ],
    Lebanon: [
      { title: 'Accounting and tax compliance', detail: 'Books that produce what the tax authority requires, in local terms.' },
      { title: 'Service businesses', detail: 'Booking and payment for clinics, gyms, salons and workshops.' },
      { title: 'Resilience by default', detail: 'Systems that keep trading through unreliable power and network.' },
    ],
    UAE: [
      { title: 'Enterprise and government platforms', detail: 'Secure portals, approvals and reporting built to procurement standards.' },
      { title: 'Bilingual customer systems', detail: 'Arabic and English interfaces with content in both.' },
      { title: 'Logistics and trade systems', detail: 'Supporting the volume that moves through the emirate\'s ports and airports.' },
    ],
    Mexico: [
      { title: 'Commerce with local payment rails', detail: 'Checkout covering OXXO, SPEI and the cards customers actually use.' },
      { title: 'Field service operations', detail: 'Scheduling, routing and proof of delivery for service businesses.' },
      { title: 'Restaurant and retail systems', detail: 'Point of sale, inventory and delivery in one place.' },
    ],
    Colombia: [
      { title: 'Payments for local methods', detail: 'Checkout covering Nequi, PSE and cash-on-delivery.' },
      { title: 'Delivery and logistics', detail: 'Route planning and order tracking for last-mile delivery.' },
      { title: 'SME business systems', detail: 'Billing, inventory and tax reporting for small businesses.' },
    ],
    Peru: [
      { title: 'Payments and collections', detail: 'Local payment methods and reconciliation built into checkout.' },
      { title: 'Mining and agriculture data', detail: 'Field, compliance and reporting systems for resource operations.' },
      { title: 'SME retail systems', detail: 'Point of sale, stock and invoicing for small retail.' },
    ],
    'Saudi Arabia': [
      { title: 'Enterprise platforms', detail: 'Internal systems that meet local deployment and data-residency expectations.' },
      { title: 'Bilingual commerce', detail: 'Arabic and English storefronts and customer journeys.' },
      { title: 'Government and enterprise integration', detail: 'Systems that integrate with existing national infrastructure.' },
    ],
    Qatar: [
      { title: 'Enterprise and energy sector systems', detail: 'Software for energy, infrastructure and services companies.' },
      { title: 'Bilingual customer systems', detail: 'Arabic and English interfaces throughout the customer journey.' },
      { title: 'Event and hospitality platforms', detail: 'Booking, membership and attendee systems.' },
    ],
    Romania: [
      { title: 'Extended team augmentation', detail: 'Engineers embedded in an existing product team for a defined engagement.' },
      { title: 'E-commerce and logistics', detail: 'Storefront, warehouse and delivery systems for online retailers.' },
      { title: 'Custom software delivery', detail: 'Web and mobile products built end to end, with handover included.' },
    ],
    Moldova: [
      { title: 'Custom software delivery', detail: 'Web, mobile and back-end products built by a team that works European hours.' },
      { title: 'E-commerce', detail: 'Storefronts with the payments and shipping options local customers expect.' },
      { title: 'Team augmentation', detail: 'Developers joining an existing in-house team for defined work.' },
    ],
  };

  return (
    byCountry[country] ?? [
      { title: 'Custom web and mobile software', detail: 'Products built end to end, from the first wireframe through to handover and support.' },
      { title: 'Cloud infrastructure', detail: 'Hosting, deployment pipelines and monitoring set up so the system stays up.' },
      { title: 'Team augmentation', detail: 'Engineers joining an existing team for a defined piece of work.' },
    ]
  );
}

/** Industries that actually buy software in this market. */
function industriesFor(country: string): string[] {
  const byCountry: Record<string, string[]> = {
    Nigeria: ['Retail and e-commerce', 'Financial services', 'Logistics', 'Healthcare', 'Education'],
    Ghana: ['Mobile money and fintech', 'Retail', 'Agriculture', 'Tourism', 'Healthcare'],
    Kenya: ['Fintech and mobile money', 'Logistics', 'Agriculture', 'Tourism', 'Education'],
    Uganda: ['Mobile money', 'Education', 'Agriculture', 'Healthcare', 'Non-profit'],
    Tanzania: ['Agriculture', 'Tourism', 'Logging', 'Mining', 'Retail'],
    Zambia: ['Mining', 'Agriculture', 'Financial services', 'Retail'],
    Zimbabwe: ['Retail', 'Healthcare', 'Agriculture', 'Mining', 'Transport'],
    India: ['E-commerce', 'Manufacturing', 'Healthcare', 'Education', 'Logistics'],
    Bangladesh: ['Garments and textiles', 'Financial services', 'Education', 'Remittance', 'Logistics'],
    'Sri Lanka': ['Tourism', 'Apparel', 'Financial services', 'Education', 'Retail'],
    Nepal: ['Tourism', 'Education', 'Financial services', 'Agriculture'],
    Philippines: ['BPO and IT services', 'Retail', 'Finance', 'Logistics'],
    Indonesia: ['E-commerce', 'Logistics', 'Manufacturing', 'Financial services', 'Retail'],
    Vietnam: ['Manufacturing', 'E-commerce', 'Agriculture', 'Tourism', 'Logistics'],
    Egypt: ['Retail and e-commerce', 'Financial services', 'Tourism', 'Healthcare', 'Real estate'],
    Jordan: ['Services', 'Retail', 'Education', 'Government'],
    Lebanon: ['Accounting and tax', 'Services', 'Retail', 'Education'],
    UAE: ['Government', 'Energy', 'Financial services', 'Retail', 'Logistics'],
    Mexico: ['Retail and e-commerce', 'Financial services', 'Logistics', 'Restaurant', 'Manufacturing'],
    Colombia: ['Retail and e-commerce', 'Financial services', 'Logistics', 'Healthcare'],
    Peru: ['Retail', 'Mining and resources', 'Agriculture', 'Financial services'],
    'Saudi Arabia': ['Government', 'Energy', 'Financial services', 'Retail', 'Healthcare'],
    Qatar: ['Energy', 'Government', 'Hospitality', 'Financial services'],
    Romania: ['E-commerce', 'Financial services', 'Software', 'Manufacturing', 'Logistics'],
    Moldova: ['Software', 'E-commerce', 'Agriculture', 'Financial services'],
  };

  return (
    byCountry[country] ?? [
      'Retail and e-commerce',
      'Financial services',
      'Healthcare',
      'Education',
      'Logistics',
    ]
  );
}

/** A short, checkable fact about working with this market. */
function noteFor(country: string, english: boolean): string {
  const timeNote = english
    ? 'Calls run on your working hours — we overlap with every timezone we work with.'
    : 'English and the local language are both supported on calls and in writing.';
  return `${timeNote} All work is remote, invoiced in your currency, with source code and full handover documentation on completion.`;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Built once at module load. The static paths come from this list. */
export const INTERNATIONAL_CITY_PAGES: CityPage[] = INTERNATIONAL.map((c) => ({
  slug: c.slug,
  name: c.name,
  keyword: `software development agency in ${c.name}`,
  region: c.region,
  lat: c.lat,
  lng: c.lng,
  intro:
    `Super Software is a software development agency working with businesses in ${c.name}. ` +
    `We build web applications, mobile apps, AI systems and cloud infrastructure for clients in ${c.country}.`,
  localContext:
    `We work with companies across ${c.name} and the wider ${c.country} market. ` +
    `Our clients here are usually businesses that have customers already and need the software to match — ` +
    `replacing a stack of disconnected tools, or building the first proper system rather than another prototype.`,
  industries: industriesFor(c.country),
  commonNeeds: needsFor(c.country),
  localNote: noteFor(c.country, c.english),
}));

/**
 * Which cities to cross-link from each city page.
 *
 * Same country only. A Lagos page linking to thirty cities on other continents
 * helps nobody and spreads internal links across unrelated markets instead of
 * concentrating them where a reader might actually be looking.
 */
export const CITY_REGIONS: Record<string, string[]> = {
  karachi: ['lahore', 'islamabad', 'faisalabad', 'hydrabad', 'multan', 'peshawar', 'quetta', 'sialkot'],
  lahore: ['karachi', 'islamabad', 'faisalabad', 'sialkot', 'multan'],
  islamabad: ['karachi', 'lahore', 'faisalabad', 'multan'],
  dubai: ['doha', 'riyadh', 'amman', 'cairo'],
  lagos: ['abuja'],
  accra: [],
  nairobi: ['kampala', 'dar-es-salaam'],
  kampala: ['nairobi', 'dar-es-salaam', 'lusaka'],
  dhaka: ['kathmandu', 'colombo'],
  delhi: ['mumbai'],
  mumbai: ['delhi'],
  'dar-es-salaam': ['nairobi', 'kampala', 'lusaka'],
  lusaka: ['harare', 'dar-es-salaam'],
  harare: ['lusaka'],
  colombo: ['dhaka'],
  kathmandu: ['dhaka'],
  cairo: ['amman', 'beirut', 'dubai'],
  amman: ['beirut', 'cairo', 'dubai'],
  beirut: ['amman', 'cairo'],
  'mexico-city': ['bogota', 'lima'],
  bogota: ['lima', 'mexico-city'],
  lima: ['bogota', 'mexico-city'],
  riyadh: ['doha', 'dubai'],
  doha: ['dubai', 'riyadh'],
  manila: ['jakarta', 'hanoi'],
  jakarta: ['hanoi', 'manila'],
  hanoi: ['jakarta', 'manila'],
  bucharest: ['chisinau'],
  chisinau: ['bucharest'],
};

/** Everything that gets a page, local first. */
export const ALL_CITY_PAGES: CityPage[] = [...CITY_PAGES, ...INTERNATIONAL_CITY_PAGES];

export function getCityPage(slug: string): CityPage | undefined {
  const clean = toSlug(slug);
  return ALL_CITY_PAGES.find((c) => c.slug === clean);
}