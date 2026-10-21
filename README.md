# Super Software — Public Website

The public site. This is what somebody finds on Google, and the only thing they
should ever be able to see.

**Live at: `supersoftware.agency`**

---

## What is in here

| Page | What it is |
|---|---|
| `/` | Home |
| `/services` | Everything you can hire us to build |
| `/about` | Who we are |
| `/case-studies` | Work we can show |
| `/contact` | Contact form |
| `/about` → *Request a Service* | The detailed brief form |
| `/[city]-software-development-agency` | 30 city pages for local search |

## What is **not** in here

This folder is the public site and nothing else. There is no admin panel, no
leads list, no message generator, no AI area and no team system in `apps/web`.
Not hidden behind a password — absent. They live in `apps/admin` and
`apps/ewp`, in the same repository but in their own folders, and they deploy
to their own addresses.

That is the point of the split. A public site gets crawled, scraped and probed
by everything on the internet; a panel holding every lead you have found should
not be reachable from the same codebase, or in the same way.

---

## How an enquiry reaches you

The contact form writes one document straight into the `leads` collection in
MongoDB, and sends you an email. The admin panel reads that same collection, so
a website enquiry arrives in the leads dashboard with nothing in between.

Saving and emailing are independent, and that is deliberate:

- The save is attempted first. A visitor who loses the notification must not
  lose the enquiry — that is how a real enquiry disappears without anybody
  noticing.
- A mail server having a bad day is never reported to the visitor as a failure
  to submit.
- The visitor is told the same thing whether or not it stored, because "we
  could not save that" only tells them to try again, which produces a duplicate
  when it actually worked.

The response does say `saved: true` or `false`, so you can see the difference in
the logs rather than guessing.

---

## Languages

The site is in English. The admin panel and the messages you send from it work
in English, Roman Urdu and Urdu.

---

## Getting started

```bash
npm install
# .env already exists with every variable, filled in and explained.
npm run dev
npm run check             # lint + types + build
```

[`ENV-GUIDE.md`](ENV-GUIDE.md) explains every line — what it does, where the
value came from, what breaks without it. It states no values, so it is safe to
read out loud.

This site needs five variables and no more:

```
MONGODB_URI    where enquiries are written
SMTP_USER      the mailbox that signs notification mail
SMTP_PASS      its password
LEADS_INBOX    where enquiries are delivered
NEXT_PUBLIC_SITE_URL   the address this host serves
```

## Deploying

Push to `main`; Vercel's GitHub integration rebuilds. To force it, use
**Deployments → ⋯ → Redeploy** — editing an environment variable does not
restart a running deployment.

`MONGODB_URI` **must be the same value as in the admin panel**, or a website
enquiry goes into a database the panel is not looking at and you will find out
about it from the customer.

---

## SEO

- 30 city pages, all in `sitemap.xml`, generated from `src/data/cities.ts`
- LocalBusiness and FAQ schema on every city page
- Every page has a title under ~60 characters and a description under ~160
- `robots.txt` allows everything, because everything here is meant to be found
- The Karachi page is weighted above the rest in the sitemap — the primary
  keyword is "software development agency Karachi" and a diluted equal-weight
  list would bury the page that matters most

## Before it goes live

1. **Five testimonials** are on the site. Confirm they are real — a fabricated
   review is a legal problem in Pakistan, and Google's own guidelines require
   review markup to match reviews that are actually visible.
2. **The phone number** is `+92 300 0000000`, a placeholder.
3. **The WhatsApp number** in the footer is a placeholder too.
4. There are **no real customer logos** and no real reviews yet. Both matter more
   to conversion than anything else on the page.