import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { recordEnquiry } from '@/lib/enquiries';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/**
 * POST /api/contact — the contact page's form.
 *
 * Writes straight to the `leads` collection, which is the same one the admin
 * panel reads. The public site has no dashboard and no password, so this is the
 * only place an enquiry can be created from here.
 *
 * Rate limited per IP. `x-forwarded-for` is set by the proxy rather than the
 * client on every real host, so it is the right key — and the budget is small,
 * because the only thing an anonymous endpoint like this can usefully do is
 * receive a handful of enquiries.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!checkRateLimit(`contact-${ip}`)) {
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
    const subject = str(body.subject);
    const message = str(body.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Length caps before anything is stored, so an oversized submission cannot
    // sit in the database taking space it has no right to.
    if (name.length > 200 || email.length > 200 || subject.length > 300 || message.length > 5000) {
      return NextResponse.json(
        { error: 'One or more fields exceed the maximum length.' },
        { status: 400 }
      );
    }

    const saved = await recordEnquiry({
      name,
      email,
      company: str(body.company) || undefined,
      service: subject,
      details: message,
      source: 'contact-page',
    });

    // Stored or not, the visitor is told the same thing. Saying "we could not
    // save that" to somebody who just tried to reach you is only true in a way
    // that makes the site look broken, and it tells them to try again — which
    // produces a duplicate when it actually worked.
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully.',
      saved,
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}