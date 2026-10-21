import type { LucideIcon } from 'lucide-react';
import { Globe, Sparkles, Store, CheckSquare, LayoutDashboard } from 'lucide-react';

/**
 * Case studies built from the agency's own shipped, publicly viewable work.
 *
 * Every entry links to a real, public repository — these are demonstrable
 * builds, not anonymised claims. Keep `verified: true` only while the
 * repository is public and the described scope is accurate.
 */
export type CaseStudyCategory = 'web' | 'ai' | 'ecommerce' | 'web3' | 'platform';

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: CaseStudyCategory;
  icon: string;
  summary: string;
  challenge: string;
  solution: string;
  techStack: string[];
  highlights: string[];
  repoUrl: string;
  liveUrl?: string;
  year: string;
  verified: boolean;
}

const icons: Record<string, LucideIcon> = { Globe, Sparkles, Store, CheckSquare, LayoutDashboard };

export function caseIcon(name: string): LucideIcon {
  return icons[name] ?? Globe;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'karachi-fiber-doors',
    title: 'Immersive 3D Product Showcase',
    client: 'Karachi Fiber Doors',
    category: 'web',
    icon: 'Globe',
    summary:
      'A product website that renders doors in real-time 3D, so buyers can inspect finish and texture before visiting the showroom.',
    challenge:
      'A local door manufacturer was losing walk-in enquiries because photographs could not communicate the difference between finishes. Prospects wanted to see the product properly before travelling to the showroom.',
    solution:
      'Built an interactive React Three Fiber scene with real-time materials and lighting, wrapped in a marketing site with enquiry capture and email delivery to the business.',
    techStack: ['Next.js', 'React Three Fiber', 'three.js', 'Framer Motion', 'Tailwind CSS', 'Nodemailer'],
    highlights: [
      'Real-time 3D product viewer running in the browser',
      'Physically-based materials and lighting',
      'Scroll-linked animation for product storytelling',
      'Enquiry form wired to SMTP delivery',
      'Fully responsive across mobile and desktop',
    ],
    repoUrl: 'https://github.com/AbdulRehmanAzizSheikh/karachi-fiber-doors',
    year: '2026',
    verified: true,
  },
  {
    id: 'resume-wala-ai',
    title: 'AI Resume Screening & Parsing',
    client: 'Resume Wala AI',
    category: 'ai',
    icon: 'Sparkles',
    summary:
      'A production web app that reads, parses and evaluates uploaded resumes using Google Gemini, with authenticated accounts and stored candidate records.',
    challenge:
      'Recruiters were spending hours manually reading stacks of resumes. The brief was an intake tool that accepts a PDF, extracts structured data and returns an assessment automatically.',
    solution:
      'Implemented PDF text extraction, LLM-backed structured parsing and scoring, JWT authentication with bcrypt-hashed credentials, and Mongoose models for persistence.',
    techStack: ['Next.js', 'Google Gemini API', 'pdf-parse', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'Nodemailer'],
    highlights: [
      'PDF upload with server-side text extraction',
      'LLM integration for structured resume parsing',
      'Authenticated accounts with hashed passwords and JWT sessions',
      'MongoDB persistence for candidate records',
      'Automated email notifications',
    ],
    repoUrl: 'https://github.com/AbdulRehmanAzizSheikh/resumeWalaAi',
    year: '2026',
    verified: true,
  },
  {
    id: 'ecom-storefronts',
    title: 'Multi-Section Retail Storefronts',
    client: 'NK-Fragrances / Pak Hikmat',
    category: 'ecommerce',
    icon: 'Store',
    summary:
      'Two production storefronts for Karachi retail brands, each with product catalogues, enquiry capture and direct email delivery to the store owner.',
    challenge:
      'Two separate retail businesses needed online presence without adopting a heavyweight commerce platform that they could not afford to maintain.',
    solution:
      'Delivered lightweight, fast storefronts with structured product catalogues, responsive product pages, and an enquiry pipeline that emails the business owner directly — no monthly platform fee.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Nodemailer', 'React Icons'],
    highlights: [
      'Fast static-first storefront architecture',
      'Responsive catalogue and product pages',
      'Direct-to-owner email enquiries',
      'Zero platform subscription cost',
      'Deployed and maintainable by the owner',
    ],
    repoUrl: 'https://github.com/AbdulRehmanAzizSheikh/NK-Fragrances',
    year: '2026',
    verified: true,
  },
  {
    id: 'carrom-realtime',
    title: 'Realtime Multiplayer Platform',
    client: 'Carom',
    category: 'platform',
    icon: 'LayoutDashboard',
    summary:
      'A realtime web platform pairing an Express and Socket.io backend with Google authentication and persistent MongoDB storage.',
    challenge:
      'A multiplayer product needed live state synchronised between players, with reliable identity and durable game records.',
    solution:
      'Built a REST and WebSocket architecture with JWT-secured Google OAuth, hashed credentials, and Mongoose models for durable state across sessions.',
    techStack: ['Express', 'Socket.io', 'Google OAuth', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'Nodemailer'],
    highlights: [
      'Realtime bidirectional updates via Socket.io',
      'Google OAuth plus credential-based authentication',
      'Persistent MongoDB data models',
      'CORS-hardened REST API',
      'Transactional email on key events',
    ],
    repoUrl: 'https://github.com/AbdulRehmanAzizSheikh',
    year: '2026',
    verified: true,
  },
  {
    id: 'mern-auth-system',
    title: 'Reusable MERN Authentication Backend',
    client: 'Internal platform',
    category: 'platform',
    icon: 'CheckSquare',
    summary:
      'A production authentication service built to be dropped into any MERN application, paired with a MongoDB-backed task application.',
    challenge:
      'Auth boilerplate is the most common source of security bugs when each project rebuilds it. A reusable, audited implementation removes that risk.',
    solution:
      'Implemented hashed credentials, signed sessions and role-aware middleware as a standalone service, plus a full task application demonstrating persistence and CRUD against MongoDB.',
    techStack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'Next.js'],
    highlights: [
      'Bcrypt password hashing',
      'JWT issue and verification middleware',
      'Role-based access control',
      'Mongoose schemas with validation',
      'Documented and reusable across projects',
    ],
    repoUrl: 'https://github.com/AbdulRehmanAzizSheikh/smitMERNStackAuthSystemBE',
    year: '2025',
    verified: true,
  },
];

export const CASE_CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Work' },
  { id: 'web', label: 'Web' },
  { id: 'ai', label: 'AI' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'platform', label: 'Platforms' },
];

export const CASE_COPY = {
  eyebrow: 'Case Studies',
  title: 'Work we have actually shipped',
  lead:
    'Every project below links to its public repository — no anonymised claims, no invented metrics. Browse the code, judge the quality, then talk to us.',
  challenge: 'The challenge',
  solution: 'What we built',
  stack: 'Stack',
  highlights: 'Highlights',
  viewRepo: 'View repository',
  noneTitle: 'No case studies in this category yet',
  noneBody: 'Try another category, or ask us for work in this area directly.',
  ctaTitle: 'Want something like this built for you?',
  ctaBody:
    'Tell us what you are trying to ship. We will tell you honestly whether we are the right fit — and if we are not, we will point you to someone who is.',
};