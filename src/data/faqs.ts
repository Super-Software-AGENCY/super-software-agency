import type { FAQ } from '@/lib/types';

export const FAQS: FAQ[] = [
  {
    question: 'How much does a project cost?',
    answer:
      'Most projects land between $8,000 and $50,000+, depending on scope, timeline, and technology choices. We give you a fixed, itemized quote after the discovery call — never an open-ended hourly meter. If budget is tight, we will tell you honestly what is achievable within it rather than padding the scope.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'A focused MVP typically ships in 4 to 8 weeks. A full-featured web application takes 8 to 16 weeks. Mobile apps and complex AI systems run 12 to 24 weeks. We set the timeline during the proposal phase and hold ourselves to it, with weekly progress demos so there are never surprises.',
  },
  {
    question: 'Do you work with clients outside Pakistan?',
    answer:
      'Yes — roughly 60% of our clients are based in the US, UK, EU, UAE, and Australia. We work asynchronously across all time zones and schedule regular calls that respect your working hours. No time zone difference has ever cost a client a deadline on our projects.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'Every project includes 30 days of free post-launch support for bug fixes. After that, most clients move onto a monthly maintenance retainer covering monitoring, security patches, backups, and a small allocation of ongoing improvements. You can also just take the codebase and run it yourself — we hand over full documentation either way.',
  },
  {
    question: 'Do you sign NDAs and work on existing codebases?',
    answer:
      'Absolutely. We sign NDAs before any detailed discussion and are happy to work under your security requirements. We regularly take over half-finished projects and legacy codebases — our first step is always a thorough code audit so you know exactly what you are working with.',
  },
  {
    question: 'Can you work with our in-house development team?',
    answer:
      'Yes, and many of our best relationships work this way. We can lead the architecture, own a specific workstream, add capacity to a sprint, or mentor your team. We integrate into your existing tooling — Jira, Linear, GitHub, Slack — and adapt to your engineering standards rather than imposing ours.',
  },
  {
    question: 'What technologies do you specialize in?',
    answer:
      'Our core stack is TypeScript/JavaScript (Next.js, React, Node.js), Python (for AI/ML and backend services), and modern cloud infrastructure on AWS, GCP, and Azure. We also work with Go, Rust, Flutter, React Native, and a wide range of databases. We will recommend the stack that fits your problem, not the one we happen to like most.',
  },
  {
    question: 'How do payments work?',
    answer:
      'Projects typically run on a 30/40/30 milestone split — 30% to kick off, 40% at the agreed midpoint, and 30% on delivery. Monthly retainers are billed in advance. We accept bank transfer, Wise, PayPal, and cryptocurrency. Every invoice is fixed-price against a written scope, so you always know what you are paying for.',
  },
  {
    question: 'Do you offer free consultations?',
    answer:
      'Yes. The first 30-minute discovery call is completely free with no obligation. If you need help shaping a rough idea into a real specification, we will do that on the call at no cost. Many of our best projects started as exactly this kind of informal conversation.',
  },
  {
    question: 'Can you help with an idea that is not fully defined yet?',
    answer:
      'That is actually our favourite kind of project. We run a short discovery and validation phase to help you pin down the problem worth solving, identify the minimum viable scope, and estimate what it will realistically take. You leave with a clear technical roadmap even if you decide not to build with us.',
  },
];
