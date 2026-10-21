'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { HERO_STATS, HERO_BADGES, HERO_BADGE_DETAIL, HERO_BANNER, HERO_TRUSTED_BY } from '@/data/hero';

const badgeIcons: Record<string, typeof Zap> = { speed: Zap, security: Shield, scale: Globe };

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-14 sm:pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" aria-hidden="true" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230ea5e9%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" aria-hidden="true" />

      <div className="container-custom relative z-10 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" aria-hidden="true" />
              {HERO_BANNER}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6"
          >
            We build <span className="gradient-text">software that scales</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Full-service software agency crafting custom web applications, AI solutions, mobile apps, and cloud infrastructure. 
            From idea to production — we handle it all.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/services" className="inline-flex w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group">
                Start Your Project
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact" className="inline-flex w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Schedule a Call
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500"
          >
            {HERO_BADGES.map((badge, idx) => {
              const Icon = badgeIcons[badge.id] ?? Zap;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05, duration: 0.35 }}
                  className="flex items-center gap-2"
                  title={HERO_BADGE_DETAIL[badge.id as keyof typeof HERO_BADGE_DETAIL]}
                >
                  <Icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  <span className="font-medium text-slate-700">{badge.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {HERO_STATS.map((stat, index) => (
            <div key={stat.label} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.25 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
        >
          <span className="font-medium text-slate-700">Trusted by innovative teams at:</span>
          <div className="flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
            {HERO_TRUSTED_BY.map((item) => (
              <span key={item} className="font-medium text-slate-400">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}