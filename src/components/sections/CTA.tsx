'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { COMPANY } from '@/data';

export function CTA() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 px-6 py-16 sm:px-12 sm:py-20 text-center"
        >
          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.06%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Let&apos;s build something great
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to build your next big idea?
            </h2>

            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Book a free 30-minute discovery call. We&apos;ll tell you honestly whether we are the right fit —
              and if we are not, we will point you to someone who is.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary-700 hover:bg-slate-50 border-0 group"
                >
                  Start Your Free Consultation
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
              <a href={`mailto:${COMPANY.email}`} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-white border-2 border-white/40 hover:bg-white/10 hover:border-white"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {COMPANY.email}
                </Button>
              </a>
            </div>

            <p className="mt-8 text-white/70 text-sm">
              No obligation &nbsp;•&nbsp; Reply within {COMPANY.responseTime} &nbsp;•&nbsp; NDA friendly
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
