'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, CheckCircle, Star, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { services, serviceCategories, searchServices } from '@/data/services';
import { CustomServiceForm } from '@/components/forms/CustomServiceForm';
import { getIcon } from '@/components/ui/Icons';
import { Footer } from '@/components/sections/Footer';
import { cn } from '@/lib/utils';

type ServicesContentProps = {
  initialCategory?: string;
  openCustomForm?: boolean;
};

export function ServicesContent({ initialCategory, openCustomForm }: ServicesContentProps) {
  const validCategory =
    initialCategory && serviceCategories.some((c) => c.id === initialCategory)
      ? initialCategory
      : 'all';

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(validCategory);
  const [sortBy, setSortBy] = useState('popular');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(!!openCustomForm);

  // Keep the URL in sync so filters are shareable / back-button friendly.
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (showCustomForm) params.set('custom', 'true');
    const qs = params.toString();
    const nextUrl = qs ? `/services?${qs}` : '/services';
    window.history.replaceState(null, '', nextUrl);
  }, [category, showCustomForm]);

  useEffect(() => {
    if (showCustomForm) {
      // Wait a frame so the form is painted before scrolling to it.
      const id = window.setTimeout(() => {
        document.getElementById('custom-service')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return () => window.clearTimeout(id);
    }
  }, [showCustomForm]);

  const filtered = (() => {
    let result = query ? searchServices(query) : services;
    if (category !== 'all') result = result.filter((s) => s.category === category);

    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'price-low') {
      result = [...result].sort(
        (a, b) => (parseInt(a.startingPrice?.replace(/\D/g, '') || '0') || 0) - (parseInt(b.startingPrice?.replace(/\D/g, '') || '0') || 0)
      );
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  })();

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    setSortBy('popular');
  };

  const activeFiltersCount = (query ? 1 : 0) + (category !== 'all' ? 1 : 0) + (sortBy !== 'popular' ? 1 : 0);

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen flex-col outline-none">
      {/* Hero */}
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-12 bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230ea5e9%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"
          aria-hidden="true"
        />
        <div className="container-custom relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
          >
            Our Services
          </motion.span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Software services built <span className="gradient-text">for your business</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Eight specialised service lines covering everything from MVP development to production AI systems.
            Search below, or request a custom solution built exactly around your requirements.
          </motion.p>
        </div>
      </section>

      {/* Search & Filter Bar — compact, sticky directly under the fixed navbar (h-14 / h-16) */}
      <section className="py-3 sm:py-4 bg-white/95 backdrop-blur-md sticky top-14 sm:top-16 z-30 border-b border-slate-100">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-2.5 items-stretch">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search services, technologies, features..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-11"
                aria-label="Search services"
                id="service-search"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 lg:flex-none">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full lg:w-auto h-full pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
                  aria-label="Sort services"
                >
                  <option value="popular">Sort: Popular First</option>
                  <option value="name">Sort: A – Z</option>
                  <option value="price-low">Sort: Price (Low to High)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {serviceCategories.map((cat) => {
              const count = cat.id === 'all' ? services.length : services.filter((s) => s.category === cat.id).length;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'px-4 min-h-[44px] inline-flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50'
                  )}
                  aria-pressed={isActive}
                >
                  {cat.label}
                  <span className={cn('ml-2 px-1.5 py-0.5 rounded text-xs', isActive ? 'bg-white/20' : 'bg-slate-200 text-slate-600')}>
                    {count}
                  </span>
                </button>
              );
            })}

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 sm:py-16 flex-1">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <p className="text-slate-600" role="status" aria-live="polite">
              Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{services.length}</span> services
            </p>
            {(query || category !== 'all') && (
              <span className="text-sm text-slate-500">
                {query && `Search: "${query}"`}
                {query && category !== 'all' && ' • '}
                {category !== 'all' && serviceCategories.find((c) => c.id === category)?.label}
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-9 h-9 text-slate-400" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No matching services</h2>
              <p className="text-slate-600 mb-6">
                We don&apos;t have a service matching that search — but we almost certainly can build it for you.
                Request a custom solution below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4" aria-hidden="true" />
                  Clear Filters
                </Button>
                <Button onClick={() => setShowCustomForm(true)}>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Request Custom Service
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {filtered.map((service, index) => {
                const Icon = getIcon(service.icon);
                const isExpanded = expandedId === service.id;

                return (
                  <motion.article
                    key={service.id}
                    id={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.15) }}
                    className="scroll-mt-40 h-fit"
                  >
                    <Card padding="none" className="overflow-hidden">
                      <div className="p-6 sm:p-8 pb-5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                            <Icon className="w-6 h-6" aria-hidden="true" />
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {service.popular && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-bold">
                                <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                                Popular
                              </span>
                            )}
                            <span className="badge badge-primary text-xs capitalize">{service.category}</span>
                          </div>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{service.title}</h2>
                        <p className="text-slate-600 leading-relaxed">{service.shortDescription}</p>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-5 pt-5 border-t border-slate-100 overflow-hidden"
                          >
                            <p className="text-slate-600 leading-relaxed mb-5">{service.fullDescription}</p>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">What&apos;s Included</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                              {service.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                  <CheckCircle className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" aria-hidden="true" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>

                      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <div className="flex flex-wrap gap-1.5 mb-5" role="group" aria-label="Technology stack">
                          {service.techStack.map((tech, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="text-xs text-slate-500 mb-0.5">Starting from</div>
                            <div className="text-2xl font-bold text-slate-900">{service.startingPrice}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedId(isExpanded ? null : service.id)}
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? 'Hide Details' : 'Full Details'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setShowCustomForm(true);
                              }}
                              className="group"
                            >
                              Get Quote
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Custom service CTA */}
          {!showCustomForm && (
            <Card
              padding="lg"
              className="mt-12 bg-gradient-to-br from-primary-600 to-accent-600 border-0 text-white"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Don&apos;t see what you need?</h2>
                  <p className="text-white/90 leading-relaxed max-w-xl">
                    Tell us exactly what you want to build. We&apos;ll design a solution around your requirements
                    and send you a detailed proposal within 48 hours.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => setShowCustomForm(true)}
                  className="bg-white text-primary-700 hover:bg-slate-50 border-0 shrink-0"
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Request Custom Service
                </Button>
              </div>
            </Card>
          )}

          {/* Custom service form */}
          {showCustomForm && (
            <section id="custom-service" className="mt-16 scroll-mt-32">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                  Request a <span className="gradient-text">Custom Service</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Every submission is reviewed by our engineering lead personally. You&apos;ll hear back within 24
                  hours with next steps.
                </p>
              </div>
              <CustomServiceForm />
            </section>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

