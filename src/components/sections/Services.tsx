'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { services, serviceCategories, searchServices } from '@/data/services';
import type { Service } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);

  const filteredServices = useMemo(() => {
    let result = services;

    if (searchQuery) {
      result = searchServices(searchQuery);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }

    if (showOnlyPopular) {
      result = result.filter(s => s.popular);
    }

    return result;
  }, [searchQuery, selectedCategory, showOnlyPopular]);

  const categoryCounts = useMemo(() => {
    return serviceCategories.map(cat => ({
      ...cat,
      count: cat.id === 'all' 
        ? services.length 
        : services.filter(s => s.category === cat.id).length
    }));
  }, []);

  return (
    <section id="services" className="py-20 sm:py-28 lg:py-32 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
          >
            Our Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            Solutions tailored to your needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto"
          >
            From custom web applications to AI-powered solutions, we deliver end-to-end software development services that drive real business results.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search services... (e.g., AI, React, Kubernetes)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                  aria-label="Search services"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showOnlyPopular ? 'primary' : 'outline'}
                  onClick={() => setShowOnlyPopular(!showOnlyPopular)}
                  className="gap-2"
                >
                  <Star className={cn('w-4 h-4', showOnlyPopular && 'fill-current')} aria-hidden="true" />
                  Popular Only
                </Button>
                {searchQuery && (
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                    <X className="w-4 h-4" aria-hidden="true" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Service categories">
              {categoryCounts.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-4 min-h-[44px] inline-flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  )}
                  aria-pressed={selectedCategory === category.id}
                >
                  {category.label}
                  <span className={cn('ml-2 px-2 py-0.5 rounded-full text-xs', selectedCategory === category.id ? 'bg-primary-500/20 text-white' : 'bg-slate-100 text-slate-500')}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={filteredServices.join(',')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
          >
            {filteredServices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-20"
              >
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No services found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setShowOnlyPopular(false); }}>
                  <X className="w-4 h-4 mr-2" aria-hidden="true" />
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              filteredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-4">Don&apos;t see what you&apos;re looking for?</p>
          <Link href="/services?custom=true" className="inline-flex">
            <Button variant="primary" size="lg" className="gap-2">
              Request Custom Service
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = getIcon(service.icon);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card variant="hover" padding="lg" className="relative flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-5">
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

        <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
        <p className="text-slate-600 mb-5 flex-1">{service.shortDescription}</p>

        <ul className="space-y-2 mb-5 flex-1">
          {service.features.slice(0, 4).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
          {service.features.length > 4 && (
            <li className="text-sm text-primary-600 font-medium">
              +{service.features.length - 4} more features
            </li>
          )}
        </ul>

        <div className="flex flex-wrap gap-1.5 mb-5" role="group" aria-label="Technology stack">
          {service.techStack.slice(0, 5).map((tech, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
              {tech}
            </span>
          ))}
          {service.techStack.length > 5 && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
              +{service.techStack.length - 5}
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            {service.startingPrice && (
              <span className="text-2xl font-bold text-slate-900">{service.startingPrice}</span>
            )}
          </div>
          <Link
            href={`/services#${service.id}`}
            // `block` so the link itself covers the whole button. As an inline
            // element it was only 22px tall and a small tap target.
            className="block w-full text-center"
          >
            <Button variant="outline" className="w-full group">
              View Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.article>
  );
}