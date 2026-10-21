/**
 * Options used by the custom service request and contact forms.
 */
export const PROJECT_TYPES = [
  { value: 'web-app', label: 'Custom Web Application' },
  { value: 'ecommerce', label: 'E-commerce Store' },
  { value: 'mobile-app', label: 'Mobile Application' },
  { value: 'ai-solution', label: 'AI / Machine Learning Solution' },
  { value: 'cloud-devops', label: 'Cloud & DevOps Setup' },
  { value: 'api-integration', label: 'API Development & Integration' },
  { value: 'web3-blockchain', label: 'Blockchain / Web3' },
  { value: 'consulting', label: 'Consulting / Architecture Review' },
  { value: 'other', label: 'Something Else' },
];

export const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 – $15,000' },
  { value: '15k-30k', label: '$15,000 – $30,000' },
  { value: '30k-50k', label: '$30,000 – $50,000' },
  { value: '50k-plus', label: '$50,000+' },
  { value: 'not-sure', label: 'Not Sure Yet' },
];

export const TIMELINES = [
  { value: 'asap', label: 'ASAP (Urgent)' },
  { value: '1-month', label: 'Within 1 Month' },
  { value: '1-3-months', label: '1 – 3 Months' },
  { value: '3-6-months', label: '3 – 6 Months' },
  { value: 'flexible', label: 'Flexible / Exploring' },
];

export const FEATURE_OPTIONS = [
  'User Authentication',
  'Payment Integration',
  'Admin Dashboard',
  'Real-time Updates',
  'AI / Chatbot',
  'File Upload & Storage',
  'Notifications',
  'Search & Filtering',
  'Analytics & Reporting',
  'Multi-language Support',
  'Third-party Integrations',
  'Mobile Responsive',
  'SEO Optimization',
  'Role-based Access',
  'Subscription Billing',
  'Dark Mode',
  'Multimedia Support',
  'API Documentation',
  'Testing & QA',
  'Performance Optimisation',
];

export const FORM_COPY = {
  customTitle: 'Tell Us What You Need',
  customSubtitle: 'The more detail you provide, the better we can help.',
  contactTitle: 'Send Us a Message',
  contactSubtitle: 'Have a question? Drop us a line.',
  responseNote: 'We reply within 24 hours — guaranteed.',
  successTitle: 'Request Received!',
  successBody:
    'Thank you. Our team has received your request and will get back to you within 24 hours with a detailed response and next steps.',
  contactSuccessBody: 'Thank you for reaching out. We’ll get back to you within 24 hours.',
};
