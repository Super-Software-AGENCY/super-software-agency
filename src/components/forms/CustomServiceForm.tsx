'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINES, FEATURE_OPTIONS } from '@/data/forms';

const initialForm = {
  name: '',
  email: '',
  company: '',
  phone: '',
  projectType: '',
  budget: '',
  timeline: '',
  description: '',
  features: [] as string[],
  integrations: '',
  additionalNotes: '',
};

export function CustomServiceForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.projectType) newErrors.projectType = 'Please select a project type';
    if (!form.budget) newErrors.budget = 'Please select a budget range';
    if (!form.timeline) newErrors.timeline = 'Please select a timeline';
    if (!form.description.trim()) {
      newErrors.description = 'Please describe your project';
    } else if (form.description.trim().length < 20) {
      newErrors.description = 'Please provide at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/custom-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        role="status"
        className="text-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Request Received!</h3>
        <p className="text-slate-600 max-w-md mx-auto mb-6">
          Thank you. Our team has received your custom service request and will get back to you within 24 hours with a detailed response and next steps.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => setStatus('idle')}>
            Submit Another Request
          </Button>
          <Button onClick={() => router.push('/services')}>
            Browse Our Services
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <Card padding="lg" className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Tell Us What You Need</h3>
            <p className="text-slate-600">The more detail you provide, the better we can help.</p>
          </div>
        </div>

        {status === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" role="alert">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 w-full">
              Your Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="name"
                label="Full Name *"
                placeholder="Abdul Rehman"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <Input
                name="email"
                type="email"
                label="Email Address *"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                name="company"
                label="Company / Organization"
                placeholder="Acme Inc."
                value={form.company}
                onChange={handleChange}
              />
              <Input
                name="phone"
                type="tel"
                label="Phone Number"
                placeholder="+92 300 1234567"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 w-full">
              Project Scope
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                name="projectType"
                label="Project Type *"
                placeholder="Select type"
                options={PROJECT_TYPES}
                value={form.projectType}
                onChange={handleChange}
                error={errors.projectType}
                required
              />
              <Select
                name="budget"
                label="Budget Range *"
                placeholder="Select budget"
                options={BUDGET_RANGES}
                value={form.budget}
                onChange={handleChange}
                error={errors.budget}
                required
              />
              <Select
                name="timeline"
                label="Timeline *"
                placeholder="Select timeline"
                options={TIMELINES}
                value={form.timeline}
                onChange={handleChange}
                error={errors.timeline}
                required
              />
            </div>

            <div className="mt-6">
              <Textarea
                name="description"
                label="Project Description *"
                placeholder="Describe your project, what you're trying to achieve, who will use it, and any specific requirements you have..."
                value={form.description}
                onChange={handleChange}
                error={errors.description}
                rows={5}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 w-full">
              Required Features
            </legend>
            <p className="text-sm text-slate-500 mb-4">Select all that apply to your project.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {FEATURE_OPTIONS.map((feature) => {
                const selected = form.features.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-200 ${
                      selected
                        ? 'bg-primary-50 border-primary-300 border text-primary-700 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    aria-pressed={selected}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        selected ? 'bg-primary-600 border-primary-600' : 'border-slate-300'
                      }`}
                      aria-hidden="true"
                    >
                      {selected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="truncate">{feature}</span>
                  </button>
                );
              })}
            </div>
            {form.features.length > 0 && (
              <p className="mt-3 text-sm text-primary-600 font-medium">
                {form.features.length} feature{form.features.length > 1 ? 's' : ''} selected
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 w-full">
              Additional Details
            </legend>
            <div className="space-y-4">
              <Textarea
                name="integrations"
                label="Integrations Needed"
                placeholder="Stripe, Salesforce, WhatsApp API, third-party services..."
                value={form.integrations}
                onChange={handleChange}
                rows={3}
              />
              <Textarea
                name="additionalNotes"
                label="Anything Else We Should Know?"
                placeholder="Links to reference sites, competitor analysis, brand guidelines, links to apps you like..."
                value={form.additionalNotes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </fieldset>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            We reply within <span className="font-semibold text-slate-700">24 hours</span> — guaranteed.
          </p>
          <Button type="submit" size="lg" loading={status === 'loading'} className="w-full sm:w-auto">
            {status === 'loading' ? (
              <>Sending Request...</>
            ) : (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                Send Custom Request
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
