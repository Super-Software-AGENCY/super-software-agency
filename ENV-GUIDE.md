# Environment variables — public website

The `.env` file holds one line per setting and is git-ignored (see `.gitignore`).
This file explains each value. The public site needs fewer values than the admin
panel: email delivery, the database, and the public URL.

## Email (Hostinger)

- `SMTP_USER` — mailbox that sends and receives enquiries.
- `SMTP_PASS` — app password for that mailbox.
- `SMTP_HOST`, `SMTP_PORT` — smtp.hostinger.com / 465.
- `LEADS_INBOX` — where enquiries are delivered (usually the same address).

## Database

- `MONGODB_URI` — MongoDB Atlas connection string. When it is missing or
  unreachable, the site falls back to a local JSON file (read-only on Vercel).

## Addresses

- `NEXT_PUBLIC_SITE_URL` — https://supersoftware.agency (used for sitemap/canonicals).
- `NEXT_PUBLIC_GA_ID` — optional GA4 measurement ID.
