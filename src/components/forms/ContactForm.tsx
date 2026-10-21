'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

const initialForm = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    else if (form.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message');
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
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
        <p className="text-slate-600 max-w-md mx-auto mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
          <MessageSquare className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>
          <p className="text-slate-600">Have a question? Drop us a line.</p>
        </div>
      </div>

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" role="alert">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          name="name"
          label="Your Name *"
          placeholder="Abdul Rehman"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          name="email"
          type="email"
          label="Your Email *"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>

      <Input
        name="subject"
        label="Subject *"
        placeholder="What is this about?"
        value={form.subject}
        onChange={handleChange}
        error={errors.subject}
        required
      />

      <Textarea
        name="message"
        label="Message *"
        placeholder="Tell us what's on your mind..."
        value={form.message}
        onChange={handleChange}
        error={errors.message}
        rows={6}
        required
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-sm text-slate-500">
          Or email us directly at{' '}
          <a
            href="mailto:hello@supersoftware.agency"
            className="inline-block py-1 text-primary-600 font-medium hover:underline"
          >
            hello@supersoftware.agency
          </a>
        </p>
        <Button type="submit" size="lg" loading={status === 'loading'} className="w-full sm:w-auto">
          {status === 'loading' ? 'Sending...' : (
            <>
              <Send className="w-4 h-4" aria-hidden="true" />
              Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
