/**
 * Storing an enquiry from the public website.
 *
 * The public site has no dashboard, no admin password and no pipeline of its
 * own. So an enquiry is written straight to the shared lead store — one
 * document, no status beyond "new". The admin panel reads the same store and
 * picks them up from there.
 *
 * That is the whole relationship between the two sites: the public one
 * appends, the admin one does everything else.
 *
 * The store is the same one the admin panel and the employee workspace use, so
 * an enquiry lands in exactly one place whichever way it is deployed: MongoDB
 * when there is one, and the shared file when there is not. Writing to
 * MongoDB here directly would have meant a second, subtly different writer
 * that quietly did nothing when the database was unreachable.
 */

import { insert, didWriteStore } from '@/shared/store';

import { COMPANY } from '@/data/company';

const FROM = process.env.SMTP_USER?.trim() || COMPANY.email;
const TO = process.env.LEADS_INBOX?.trim() || COMPANY.email;

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  details: string;
  budget?: string;
  /** Which form it came from. */
  source: 'contact-page' | 'custom-service';
  status: 'new';
  urgency: 'planning';
  createdAt: string;
  updatedAt: string;
}

/**
 * Save the enquiry, then try to email about it.
 *
 * In that order, and independently. A visitor who loses the notification must
 * not lose the enquiry — that is how a real enquiry disappears without anybody
 * noticing — and a mail server having a bad day must not be reported to the
 * visitor as a failure to submit.
 *
 * Returns whether it was stored, which is the only thing the caller needs to
 * decide what to tell the visitor.
 */
export async function recordEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'urgency' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
  const now = new Date().toISOString();
  const record: Enquiry = {
    ...enquiry,
    id: '',
    status: 'new',
    urgency: 'planning',
    createdAt: now,
    updatedAt: now,
  };

  let saved = false;
  try {
    const stored = await insert({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      company: enquiry.company,
      service: enquiry.service,
      details: enquiry.details,
      budget: enquiry.budget,
      source: enquiry.source,
      status: 'new',
      urgency: 'planning',
    });
    record.id = stored.id;
    saved = didWriteStore();
  } catch {
    saved = false;
  }

  // Best effort. Never throws, never affects the result above.
  try {
    await notify(record);
  } catch {
    /* notification only */
  }

  return saved;
}

/* ------------------------------ notification ---------------------------- */

async function notify(e: Enquiry): Promise<void> {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return;

  // Imported here so a visitor is not made to wait for an SMTP module that
  // only matters when there is a password configured.
  const { default: nodemailer } = await import('nodemailer');

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  const rows: [string, string][] = [
    ['Name', e.name],
    ['Email', e.email],
    ['Phone', e.phone || '—'],
    ['Company', e.company || '—'],
    ['Needs', e.service],
    ['Budget', e.budget || '—'],
    ['Came from', e.source === 'contact-page' ? 'Contact page' : 'Request a service'],
  ];

  await transport.sendMail({
    from: `"Website enquiry" <${FROM}>`,
    to: TO,
    replyTo: e.email,
    subject: `New enquiry — ${e.name}${e.company ? ` (${e.company})` : ''}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${e.details}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
  <h2 style="margin:0 0 12px">New enquiry from supersoftware.agency</h2>
  <table style="font-size:14px;border-collapse:collapse">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#64748b">${k}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`
      )
      .join('')}
  </table>
  <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(e.details)}</p>
</div>`,
  });
}

/** Strip anything that could close the tag and run a script. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}