import Link from 'next/link';
import { Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcons';
import { COMPANY } from '@/data';
import { CITY_PAGES } from '@/data/cities';
import logo from '@/assets/logo.png';

const services = [
  { name: 'Custom Web Development', href: '/services?category=development' },
  { name: 'AI & Machine Learning', href: '/services?category=ai' },
  { name: 'Mobile App Development', href: '/services?category=mobile' },
  { name: 'Cloud & DevOps', href: '/services?category=cloud' },
  { name: 'API Development', href: '/services?category=development' },
  { name: 'Software Consulting', href: '/services?category=consulting' },
];

const company = [
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About Us', href: '/about' },
  { name: 'Our Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
  { name: 'Request a Quote', href: '/contact' },
  { name: 'Request a Service', href: '/services?custom=true' },
  { name: 'GitHub', href: COMPANY.social.github },
];

const socials = [
  { name: 'GitHub', href: COMPANY.social.github, icon: GithubIcon },
  { name: 'LinkedIn', href: COMPANY.social.linkedin, icon: LinkedinIcon },
  { name: 'X', href: COMPANY.social.twitter, icon: TwitterIcon },
  { name: 'Instagram', href: COMPANY.social.instagram, icon: InstagramIcon },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-5" aria-label="Super Software Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt="Super Software Agency"
                width={1762}
                height={298}
                className="h-11 w-auto object-contain rounded"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              {COMPANY.shortDescription} Trusted by 50+ clients worldwide to design, build, and scale
              production software.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-[18px] h-[18px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Services</h2>
            <ul className="space-y-1">
              {services.map((service) => (
                <li key={service.name}>
                  {/* py-1.5 keeps the hit area at 24px+ for touch, which the
                      bare text link did not. */}
                  <Link
                    href={service.href}
                    className="inline-block py-1.5 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h2>
            <ul className="space-y-1">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 py-1.5 text-slate-400 hover:text-white transition-colors text-sm"
                    {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.name}
                    {item.href.startsWith('http') && <ArrowUpRight className="w-3 h-3" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Get In Touch</h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-start gap-3 py-1 text-slate-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
                  <span className="break-all">{COMPANY.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
                <span>{COMPANY.location}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
                <span>{COMPANY.hours}</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="text-xs font-semibold text-primary-400 mb-1">Response Time</div>
              <div className="text-sm text-slate-300">{COMPANY.responseTime} guaranteed</div>
            </div>
          </div>
        </div>

        {/* City links. Every page links here, which is what tells Google these
            pages exist and how they relate to each other. */}
        <div className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
            Software development in
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {CITY_PAGES.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/${city.slug}-software-development-agency`}
                  className="inline-block py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 text-center sm:text-left">
            &copy; {currentYear} {COMPANY.name}. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 text-center sm:text-right">
            Built with Next.js, Tailwind CSS &amp; TypeScript.
          </p>
        </div>
    </footer>
  );
}
