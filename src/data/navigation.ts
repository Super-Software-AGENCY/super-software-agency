/**
 * Site navigation structure.
 */
export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  // Services is covered by the dropdown below, so it is not repeated here.
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

/**
 * High-intent action — kept in the main nav so it is easy to share on
 * WhatsApp.
 *
 * It points at the "Request a Custom Service" form on the services page.
 * There is no separate `/leads` page on the public site: that page belonged
 * to the old all-in-one app, and a link to it now goes nowhere.
 */
export const NAV_LEADS = { name: 'Request a Service', href: '/services?custom=true' };

export const NAV_SERVICE_LINKS = [
  { name: 'All Services', href: '/services' },
  { name: 'Web Development', href: '/services?category=development' },
  { name: 'AI & ML', href: '/services?category=ai' },
  { name: 'Mobile Apps', href: '/services?category=mobile' },
  { name: 'Cloud & DevOps', href: '/services?category=cloud' },
  { name: 'Consulting', href: '/services?category=consulting' },
];

export const NAV_FOOTER_CASE_STUDIES = [
  { name: 'Case Studies', href: '/case-studies' },
];

export const NAV_CTA = {
  secondary: { label: 'Get in Touch', href: '/contact' },
  primary: { label: 'Start a Project', href: '/services' },
};
