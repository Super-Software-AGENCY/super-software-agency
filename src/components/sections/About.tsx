'use client';

import { motion } from 'framer-motion';
import { Target, Heart, Zap, Users, Shield, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ABOUT_VALUES, ABOUT_EXPERTISE, ABOUT_TIMELINE, ABOUT_MISSION, ABOUT_INTRO } from '@/data/about';

const valueIcons: Record<string, typeof Target> = { Target, Zap, Heart };
const expertiseIcons: Record<string, typeof Users> = { Users, Shield, TrendingUp, Award };

export function About() {
  return (
    <section id="about" className="py-20 sm:py-28 lg:py-32 bg-slate-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              {ABOUT_INTRO.badge}
            </span>
            <h2 className="section-title mb-6">
              {ABOUT_INTRO.titleLead} <span className="gradient-text">{ABOUT_INTRO.titleHighlight}</span>
            </h2>
            {ABOUT_INTRO.paragraphs.map((text, i) => (
              <p key={i} className="text-lg text-slate-600 leading-relaxed mb-4 last:mb-8">
                {text}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ABOUT_VALUES.map((value, i) => {
                const Icon = valueIcons[value.icon] ?? Target;
                return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Card variant="hover" padding="sm" className="h-full">
                    <Icon className="w-8 h-8 text-primary-600 mb-3" aria-hidden="true" />
                    <h3 className="font-semibold text-slate-900 mb-1 text-sm">{value.title}</h3>
                    <p className="text-sm text-slate-600">{value.desc}</p>
                  </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {ABOUT_EXPERTISE.map((item, i) => {
                const Icon = expertiseIcons[item.icon] ?? Users;
                return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Card variant="hover" padding="md" className="h-full text-center">
                    <Icon className="w-7 h-7 text-primary-600 mx-auto mb-3" aria-hidden="true" />
                    <div className="text-2xl font-bold text-slate-900 mb-1">{item.value}</div>
                    <div className="text-sm font-medium text-slate-700 mb-1">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </Card>
                  </motion.div>
                );
              })}
            </div>

            <Card padding="lg" className="mt-4 bg-gradient-to-br from-primary-600 to-accent-600 border-0 text-white">
              <h3 className="text-xl font-bold mb-2">{ABOUT_MISSION.title}</h3>
              <p className="leading-relaxed opacity-95">{ABOUT_MISSION.body}</p>
            </Card>
          </motion.div>
        </div>

        <div className="mt-20 pt-16 border-t border-slate-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Our Journey</h3>
            <p className="text-slate-600">From a two-person freelance desk to a trusted agency partner.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ABOUT_TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                  {item.year.slice(2)}
                </div>
                <div className="absolute top-7 left-14 right-0 h-0.5 bg-slate-200 hidden lg:block" aria-hidden="true" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  <span className="text-primary-600 mr-2">{item.year}</span>
                  {item.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
