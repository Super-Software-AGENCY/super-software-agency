import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { recordEnquiry } from '@/lib/enquiries';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * POST /api/custom-service — the "Request a service" form.
 *
 * Same destination as the contact form and the same deal with it: append to the
 * `leads` collection, which the admin panel reads, and never tell the visitor
 * more than "that worked".
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!checkRateLimit(`service-${ip}`)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const name = str(body.name);
    const email = str(body.email);
    const service = str(body.service);
    const details = str(body.details);

    const fieldErrors: Record<string, string> = {};
    if (name.length < 2) fieldErrors.name = 'Please give your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      fieldErrors.email = 'Please give a valid email address.';
    }
    if (service.length < 3) fieldErrors.service = 'Please choose what you need.';
    if (details.length < 15) fieldErrors.details = 'Please add a little more detail.';

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { error: 'Please fix the highlighted fields.', fieldErrors },
        { status: 400 }
      );
    }

    const saved = await recordEnquiry({
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      company: str(body.company).slice(0, 200) || undefined,
      phone: str(body.phone).slice(0, 40) || undefined,
      service: service.slice(0, 200),
      details: details.slice(0, 5000),
      budget: str(body.budget).slice(0, 60) || undefined,
      source: 'custom-service',
    });

    return NextResponse.json({
      success: true,
      message: 'Request sent. We will reply within one working day.',
      saved,
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}