'use client';

import { motion } from 'framer-motion';
import { MessageSquare, PenTool, Code2, Rocket, MessageCircleQuestion } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FAQS } from '@/data/faqs';
import { PROCESS_STEPS } from '@/data/process';

const stepIcons: Record<string, typeof MessageSquare> = {
  MessageSquare,
  PenTool,
  Code2,
  Rocket,
};

export function Process() {
  return (
    <>
      <section id="process" className="py-20 sm:py-28 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              How We Work
            </span>
            <h2 className="section-title mb-4">A process built for clarity</h2>
            <p className="section-subtitle mx-auto">
              No black boxes, no surprise invoices. Here is exactly how a project runs from first call to launch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => {
                const Icon = stepIcons[step.icon] ?? MessageSquare;
                return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="hover" padding="lg" className="h-full relative overflow-hidden">
                  <div
                    className="absolute -top-4 -right-4 text-8xl font-black text-slate-50 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="badge badge-secondary text-xs mb-3 inline-block">{step.duration}</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 sm:py-28 bg-slate-50">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <MessageCircleQuestion className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="section-title mb-4">Frequently Asked Questions</h2>
            <p className="section-subtitle mx-auto">Straight answers to the questions we get asked most.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card padding="md" variant="bordered">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-slate-600 mb-4">Still have a question that isn&apos;t here?</p>
            <Link href="/contact" className="inline-flex">
              <Button>Ask Us Directly</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
