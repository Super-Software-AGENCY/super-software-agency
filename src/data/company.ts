/**
 * Company profile — single source of truth for all business details.
 * Used by metadata, JSON-LD schema, llms.txt, footer, contact page and emails.
 */
export const COMPANY = {
  name: 'Super Software',
  legalName: 'Super Software',
  tagline: 'We build software that scales',
  email: 'hello@supersoftware.agency',
  phone: '+92 325 2069779',
  // Canonical host — the live site 308-redirects the apex domain to www,
  // so every canonical / og:url / sitemap entry must use the www form.
  website: 'https://www.supersoftware.agency',
  location: 'Karachi, Sindh, Pakistan',
  geo: { latitude: 24.8607, longitude: 67.0011 },
  founded: '2019',
  description:
    'Super Software is a full-service software development agency building custom web applications, AI and machine learning solutions, mobile apps, cloud infrastructure, and blockchain products for startups, scale-ups, and enterprises worldwide.',
  shortDescription:
    'Full-service software development agency specializing in web apps, AI/ML, mobile, and cloud solutions.',
  hours: 'Monday – Friday, 9:00 AM – 7:00 PM PKT (UTC+5)',
  responseTime: 'Within 24 hours',
  languages: ['English', 'Urdu'],
  social: {
    github: 'https://github.com/AbdulRehmanAzizSheikh',
    linkedin: 'https://www.linkedin.com/in/abdulrehmanazizsheikh',
    twitter: 'https://x.com/AbdulRehmanMERN',
    instagram: 'https://www.instagram.com/abdulrehmanazizsheikh',
  },
};
