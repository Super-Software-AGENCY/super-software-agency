import nodemailer from 'nodemailer';

// Hostinger SMTP. Fixed for this domain, so only the mailbox and its
// password need configuring — see .env.
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Nodemailer waits 10 minutes by default, which would leave a visitor staring
  // at a spinner. Every form saves to the database before emailing, so bailing
  // out quickly costs only the notification.
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 10000,
});

/**
 * Where mail is sent *from*, and where it is sent *to*.
 *
 * These were the same address, set to whichever mailbox the SMTP login uses.
 * That is only correct when the login mailbox happens to be the agency's public
 * address, and it was not: the login is a Hostinger mailbox on a different
 * domain, so every enquiry from the contact form was delivered to that mailbox
 * while the site told visitors to write to hello@supersoftware.agency. Two
 * different addresses, and nobody was told.
 *
 * They are now separate settings. `SMTP_USER` is only ever the credential and
 * the envelope sender. Where enquiries land is `LEADS_INBOX`, defaulting to the
 * address the rest of the site already publishes.
 *
 * The from-address is deliberately not faked to look like the domain. Most
 * hosts reject SPF for a sender that has no DNS record authorising it, and a
 * silent rejection means no email at all — which is worse than the envelope
 * showing the real mailbox.
 */
const FROM_EMAIL = process.env.SMTP_USER || 'hello@supersoftware.agency';
const TO_EMAIL = process.env.LEADS_INBOX || 'hello@supersoftware.agency';

/** True when mail can actually be sent, as opposed to merely being configured. */
export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** Where enquiries are delivered. Shown in the admin so it is never a surprise. */
export function inboxAddress(): string {
  return TO_EMAIL;
}

/**
 * Escape untrusted values before interpolating them into the HTML email body.
 * Without this, a submitter could inject arbitrary HTML/script into the
 * notification email that lands in the agency inbox.
 */
function escapeHtml(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape a value used inside an href="mailto:..." attribute. */
function escapeAttr(value: unknown): string {
  return escapeHtml(value).replace(/mailto:|javascript:/gi, '');
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); padding: 30px; border-radius: 16px 16px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Super Software</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">New Contact Form Submission</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; padding: 30px;">
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Email:</td>
              <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${escapeAttr(email)}" style="color: #0ea5e9; text-decoration: none;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Subject:</td>
              <td style="padding: 8px 0; color: #1e293b;">${escapeHtml(subject)}</td>
            </tr>
          </table>
        </div>
        <div>
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Message</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">Reply directly to this email to respond to ${name}</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
        <p>Sent from Super Software website contact form</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Super Software Website" <${FROM_EMAIL}>`,
    to: TO_EMAIL,
    replyTo: email,
    subject: `[Super Software] ${subject} - ${name}`,
    html,
  });
}

export async function sendCustomServiceEmail(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
  integrations?: string;
  additionalNotes?: string;
}) {
  const { name, email, company, phone, projectType, budget, timeline, description, features, integrations, additionalNotes } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); padding: 30px; border-radius: 16px 16px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Super Software</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">New Custom Service Request</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; padding: 30px;">
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Client Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 140px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Email:</td>
              <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${escapeAttr(email)}" style="color: #0ea5e9; text-decoration: none;">${escapeHtml(email)}</a></td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Company:</td>
              <td style="padding: 8px 0; color: #1e293b;">${escapeHtml(company)}</td>
            </tr>` : ''}
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Phone:</td>
              <td style="padding: 8px 0; color: #1e293b;"><a href="tel:${escapeAttr(phone)}" style="color: #0ea5e9; text-decoration: none;">${escapeHtml(phone)}</a></td>
            </tr>` : ''}
          </table>
        </div>
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Project Requirements</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 140px;">Project Type:</td>
              <td style="padding: 8px 0; color: #1e293b;">${escapeHtml(projectType)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Budget Range:</td>
              <td style="padding: 8px 0; color: #1e293b;">${escapeHtml(budget)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Timeline:</td>
              <td style="padding: 8px 0; color: #1e293b;">${escapeHtml(timeline)}</td>
            </tr>
          </table>
        </div>
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Project Description</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${escapeHtml(description)}</div>
        </div>
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Required Features</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${features.map(f => `<span style="background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">${escapeHtml(f)}</span>`).join('')}
          </div>
        </div>
        ${integrations ? `
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Integrations Needed</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${escapeHtml(integrations)}</div>
        </div>` : ''}
        ${additionalNotes ? `
        <div>
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Additional Notes</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${escapeHtml(additionalNotes)}</div>
        </div>` : ''}
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">Reply directly to this email to respond to ${name}</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
        <p>Sent from Super Software custom service request form</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Super Software Website" <${FROM_EMAIL}>`,
    to: TO_EMAIL,
    replyTo: email,
    subject: `[Super Software] Custom Service Request - ${projectType} - ${name}`,
    html,
  });
}

export async function sendAutoReply(to: string, name: string, type: 'contact' | 'custom-service') {
  const isCustomService = type === 'custom-service';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Super Software</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">We received your ${isCustomService ? 'custom service request' : 'message'}!</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; padding: 30px;">
        <p style="font-size: 16px; color: #1e293b;">Hi ${escapeHtml(name)},</p>
        <p style="color: #475569;">Thank you for reaching out to Super Software! We've received your ${isCustomService ? 'custom service request' : 'message'} and our team will review it shortly.</p>
        
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px; color: #0369a1; font-size: 14px; font-weight: 600;">What happens next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #0369a1;">
            <li style="margin-bottom: 8px;">Our team will review your ${isCustomService ? 'requirements' : 'inquiry'} within 24 hours</li>
            <li style="margin-bottom: 8px;">We'll send you a personalized response with next steps</li>
            <li>If needed, we'll schedule a free discovery call to discuss your project in detail</li>
          </ul>
        </div>
        
        <p style="color: #475569;">In the meantime, feel free to explore our <a href="https://supersoftware.agency/services" style="color: #0ea5e9;">services</a> or check out our <a href="https://supersoftware.agency/about" style="color: #0ea5e9;">case studies</a>.</p>
        
        <p style="color: #475569;">Best regards,<br><strong>The Super Software Team</strong></p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
        <p>Super Software • Building the Future of Software</p>
        <p><a href="https://supersoftware.agency" style="color: #94a3b8;">supersoftware.agency</a> • <a href="mailto:hello@supersoftware.agency" style="color: #94a3b8;">hello@supersoftware.agency</a></p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Super Software" <${FROM_EMAIL}>`,
    to,
    subject: `Thanks for contacting Super Software! ${isCustomService ? '🚀' : '✨'}`,
    html,
  });
}