'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { NAV_LINKS, NAV_SERVICE_LINKS, NAV_CTA, NAV_LEADS } from '@/data/navigation';
import logo from '@/assets/logo.png';



export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // While the mobile menu is open the page behind must not scroll, otherwise the
  // menu slides out of the fixed header and the links become unreachable.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  // Escape closes either menu, and a resize past the breakpoint clears the mobile
  // one so its scroll lock cannot survive into the desktop layout.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMobileMenuOpen(false);
      setServicesDropdownOpen(false);
    };
    document.addEventListener('keydown', onKey);

    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener('change', onChange);

    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  // Close the menus whenever navigation happens, so a back/forward or a link
  // click does not leave the page scroll-locked behind an invisible menu.
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        // An open mobile menu needs a solid backdrop of its own. Relying on the
        // page showing through leaves the links unreadable on any dark section.
        isScrolled || mobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-soft'
          : 'bg-transparent'
      )}
    >
      {/* Keyboard shortcut: lets users jump straight past the nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Super Software Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt="Super Software Agency"
              width={1762}
              height={298}
              className="h-7 sm:h-9 w-auto object-contain animate-logo"
            />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {item.name}
              </Link>
            ))}

            <div className="relative">
              <button
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
                aria-label="Services menu"
              >
                Services
                <ChevronDown className={cn('w-4 h-4 transition-transform', servicesDropdownOpen && 'rotate-180')} />
              </button>

              {servicesDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setServicesDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-card-hover py-2 z-50 animate-in">
                    {NAV_SERVICE_LINKS.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link href={NAV_LEADS.href} className="inline-flex">
              <Button variant="ghost" size="sm">{NAV_LEADS.name}</Button>
            </Link>
            <Link href="/contact" className="inline-flex">
              <Button variant="ghost" size="sm">{NAV_CTA.secondary.label}</Button>
            </Link>
            <Link href="/services" className="inline-flex">
              <Button size="sm">{NAV_CTA.primary.label}</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-slate-100 animate-in"
          >
            {/* The header is fixed, so on a short screen the menu is taller than
                the viewport. Without its own scroll area the links at the bottom
                would be permanently out of reach. */}
            <div
              className="py-4 overflow-y-auto overscroll-contain"
              style={{ maxHeight: 'calc(100dvh - 4rem)' }}
            >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/services"
                className="px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href={NAV_LEADS.href}
                className="px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {NAV_LEADS.name}
              </Link>
              <div className="pl-4 flex flex-col gap-1 border-l border-slate-200 ml-4">
                {NAV_SERVICE_LINKS.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="py-2 pl-3 text-sm text-slate-500 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link href="/contact" className="block px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Get in Touch
                </Link>
                <Link href="/services" className="block px-4 py-3 rounded-xl bg-primary-600 text-white font-medium transition-colors mt-2 text-center" onClick={() => setMobileMenuOpen(false)}>
                  {NAV_CTA.primary.label}
                </Link>
              </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}