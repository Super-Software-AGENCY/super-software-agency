'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  CASE_STUDIES,
  CASE_CATEGORIES,
  CASE_COPY,
  caseIcon,
  type CaseStudy,
} from '@/data/case-studies';
import { cn } from '@/lib/utils';

export function CaseStudiesGrid() {
  const [active, setActive] = useState('all');

  const visible = active === 'all' ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-12" role="group" aria-label="Filter case studies">
        {CASE_CATEGORIES.map((cat) => {
          const count =
            cat.id === 'all' ? CASE_STUDIES.length : CASE_STUDIES.filter((c) => c.category === cat.id).length;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              aria-pressed={isActive}
              className={cn(
                // min-h keeps the tap target at 44px, the accessible minimum on touch.
                'px-4 min-h-[44px] inline-flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              {cat.label}
              <span className={cn('ml-2 px-1.5 py-0.5 rounded text-xs', isActive ? 'bg-white/20' : 'bg-slate-100')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{CASE_COPY.noneTitle}</h2>
          <p className="text-slate-600">{CASE_COPY.noneBody}</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((study, i) => (
              <CaseCard key={study.id} study={study} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function CaseCard({ study, index }: { study: CaseStudy; index: number }) {
  const Icon = caseIcon(study.icon);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="h-fit"
    >
      <Card padding="none" className="overflow-hidden flex flex-col">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {study.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-bold">
                  Verified build
                </span>
              )}
              <span className="badge badge-secondary text-xs">{study.year}</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{study.title}</h2>
          <p className="text-sm font-medium text-primary-700 mb-3">{study.client}</p>
          <p className="text-slate-600 leading-relaxed mb-6">{study.summary}</p>

          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {CASE_COPY.challenge}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{study.challenge}</p>
          </div>

          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {CASE_COPY.solution}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{study.solution}</p>
          </div>

          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {CASE_COPY.highlights}
            </h3>
            <ul className="space-y-1.5">
              {study.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-primary-500 mt-1.5 shrink-0" aria-hidden="true">
                    •
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-1.5" aria-label="Stack">
            {study.techStack.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-slate-50/60">
          <a
            href={study.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            {CASE_COPY.viewRepo}
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Card>
    </motion.article>
  );
}

export function CaseStudiesCTA() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-4">{CASE_COPY.ctaTitle}</h2>
          <p className="section-subtitle mx-auto mb-8">{CASE_COPY.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="inline-flex">
              <Button size="lg">Start Your Free Consultation</Button>
            </Link>
            <Link href="/services" className="inline-flex">
              <Button variant="outline" size="lg">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}