/**
 * The one shape every part of the system agrees on.
 *
 * Written out here rather than spread across the API, the store and the UI,
 * because a field that means two different things in two files is a bug waiting
 * for the day somebody adds a second caller.
 *
 * This file lives in the shared package because three applications read it —
 * the public website, the admin panel and the employee workspace — and a type
 * that exists in two of them will drift.
 */

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'proposal',
  'negotiating',
  'advance',
  'won',
  'delivered',
  'lost',
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/**
 * The default, and what every new lead starts on.
 *
 * Named `new` rather than something longer because it is the zero value that
 * ends up on every row, and it has to keep working against six hundred stored
 * leads that already say it. The *label* says "Not contacted" — that is the
 * thing the person reading the list needs to know, and the key never has to
 * change to say it.
 */
export const DEFAULT_STATUS: LeadStatus = 'new';

export const URGENCIES = ['asap', 'this-month', 'next-month', 'planning'] as const;
export type Urgency = (typeof URGENCIES)[number];

/* --------------------------- employee roles --------------------------- */

export const ROLES = [
  { value: 'hunter', label: 'Hunter', description: 'Leads generation & follow-up' },
  { value: 'client', label: 'Client', description: 'Customer / business account' },
  { value: 'sales', label: 'Sales', description: 'Deal closure & quoting' },
] as const;

export type BuiltInRoleName = (typeof ROLES)[number]['value'];

/**
 * A role name.
 *
 * The three that ship with the system are known exactly, so the editor offers
 * them first. But roles can also be added from the admin panel, so the type
 * stays open — the `string & {}` keeps the editor's suggestions while letting
 * a custom role through.
 */
export type RoleName = BuiltInRoleName | (string & {});

/** Just the built-in values, for validation against a list of strings. */
export const ROLE_VALUES: readonly RoleName[] = ROLES.map((r) => r.value);

/**
 * What a role is called.
 *
 * The three built-ins are known here. Anything else is a role somebody added
 * in the admin panel, and the id it was given is the best we can do without
 * asking the database — which is why the role store has its own lookup for
 * the screens that care.
 */
export function roleLabel(name: RoleName): string {
  const r = ROLES.find((x) => x.value === name);
  return r ? r.label : name;
}

/** What the person in that role is expected to do. */
export function roleDesc(name: RoleName): string {
  const r = ROLES.find((x) => x.value === name);
  return r ? r.description : '';
}

/**
 * How likely this business is to buy, judged on its type.
 *
 * A is a business where a website is revenue — it sells, holds stock, or moves
 * property. B is a real business that survives without one. C is refused before
 * it is ever stored, because a plumber fixing one phone a day is not going to
 * buy a website and calling them burns the number.
 */
export const TIERS = ['A', 'B'] as const;
export type Tier = (typeof TIERS)[number];

export interface Outreach {
  format: 'plain' | 'whatsapp' | 'email';
  text: string;
  generatedAt: string;
  sentBy?: string;
  sentAt?: string;
}

export interface Lead {
  id: string;

  // ── who they are ──
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  city?: string;
  countryName?: string;

  // ── what they want ──
  service: string;
  details?: string;
  /** `none` is the sales angle: nobody can find them. */
  websiteStatus?: 'none' | 'facebook-only' | 'unknown';
  /** Where this lead came from, shown on the card. */
  source?: string;

  // ── where it is ──
  status: LeadStatus;
  urgency: Urgency;
  lookingSince?: string;
  neededBy?: string;
  budget?: string;
  notes?: string;

  // ── money ──
  /** The whole deal, in rupees. Only for leads that have actually quoted. */
  dealValue?: number;
  /** Percentage, not a currency figure — nobody types a commission by hand. */
  commissionRate?: number;
  commissionAmount?: number;

  // ── how the bot found it ──
  tier?: Tier;
  whatsapp?: string;
  /** The search that surfaced it. */
  query?: string;
  /** Ready-made wa.me link, when the source supplied one. */
  english?: boolean;

  /**
   * The employee this lead belongs to.
   *
   * The eight-digit employee id. The employee workspace shows only the leads
   * carrying its own id, so a hunter sees their own book of work and nobody
   * else's.
   */
  assignedTo?: string;

  outreach?: Outreach | null;

  createdAt: string;
  updatedAt: string;
}

/* --------------------------------- employees -------------------------------- */

export const MARRIAGE_STATUSES = ['married', 'unmarried', 'widowed', 'divorced'] as const;
export type MarriageStatus = (typeof MARRIAGE_STATUSES)[number];

export const EMPLOYEE_STATUSES = ['active', 'disabled'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export interface Employee {
  id: string; // 8-digit numeric string, unique
  name: string;
  fatherName?: string;
  firstName?: string;
  role: RoleName; // assigned role
  status: EmployeeStatus; // enabled / disabled toggle
  cnicFront?: string; // Cloudinary URL
  cnicBack?: string; // Cloudinary URL
  marriage?: MarriageStatus;
  age?: number;
  /** How the employee reaches the office. */
  phone?: string;
  email?: string;
  /** Where the employee lives, shown on their own profile. */
  city?: string;
  /** A short note the admin wrote about this person. */
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormValues {
  name: string;
  fatherName?: string;
  firstName?: string;
  role: RoleName;
  status: EmployeeStatus;
  cnicFront?: string;
  cnicBack?: string;
  marriage?: MarriageStatus;
  age?: number;
  phone?: string;
  email?: string;
  city?: string;
  notes?: string;
}

/* ---------------------------- registration links ---------------------------- */

/**
 * A one-time-or-reusable invitation for the employee workspace.
 *
 * The admin makes a link, sends it to the person joining, and the person opens
 * it to fill in their own details. A link can be switched off without
 * deleting it, which matters when somebody misplaces a link that was emailed
 * to the wrong address.
 */
export interface RegistrationLink {
  token: string;
  /** What this link is for, so the admin can tell them apart. */
  label: string;
  /** The role the person will get if they use this link. */
  role: RoleName;
  status: 'active' | 'disabled';
  /** When the link stops working. Empty means it does not expire. */
  expiresAt?: string;
  /** How many times it may be used. */
  maxUses: number;
  /** How many times it has been used. */
  uses: number;
  /** The employee ids created with it. */
  usedBy: string[];
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------ vocabulary ------------------------------ */

/**
 * What each status means, in a word rather than a colour.
 *
 * The order is the pipeline, and it runs from "nobody has spoken to them" to
 * "the money is in and the work is done", with the two steps that keep getting
 * skipped written down explicitly:
 *
 *   negotiating — they are interested and the price is the argument. Without
 *                 this they sit at "Quoted" for a week and you cannot tell a
 *                 deal that died from one nobody followed up.
 *   advance     — part payment received. This is the step that decides whether
 *                 the rest of the money ever arrives, and it is the one that
 *                 used to live only in someone's head.
 */
export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'Not contacted',
  contacted: 'Contacted',
  proposal: 'Quoted',
  negotiating: 'Negotiating',
  advance: 'Advance paid',
  won: 'Paid in full',
  delivered: 'Delivered',
  lost: 'Lost',
};

/**
 * One line on what to actually do from each status.
 *
 * Shown under the status control, because a list of eight words tells you where
 * a lead is and not what to do about it — and the whole point of moving a lead
 * is doing the next thing.
 */
export const STATUS_NEXT: Record<LeadStatus, string> = {
  new: 'Nobody has spoken to them yet. Make the first call, or send the first message.',
  contacted: 'They have heard from you. Follow up if nothing has come back in two days.',
  proposal: 'You have sent a price. Find out if they have read it and what they thought.',
  negotiating: 'The price is the sticking point. Agree a scope you can both live with.',
  advance: 'Part payment is in. Book the rest of the money against the delivery date.',
  won: 'Paid in full. Build it, and say when it will be live.',
  delivered: 'Done and handed over. Nothing is owed.',
  lost: 'Not going ahead. Keep the reason in the notes — it is the next pitch.',
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  asap: 'ASAP',
  'this-month': 'This month',
  'next-month': 'Next month',
  planning: 'Planning',
};

/** Ordered so the dashboard can render them as a filter row. */
export const STATUS_FILTERS: LeadStatus[] = [...LEAD_STATUSES];
export const URGENCY_FILTERS: Urgency[] = [...URGENCIES];

/**
 * True when a lead has been worked on.
 *
 * Anything past "new" is somebody's actual work — a call they made, a quote
 * they sent. Cleaning scripts must never touch these, whatever the name looks
 * like.
 */
export function isWorked(lead: Pick<Lead, 'status'>): boolean {
  return lead.status !== DEFAULT_STATUS;
}

/**
 * How far along the money is.
 *
 * Derived from the status rather than stored, because it is the same fact said
 * twice. Two numbers that disagree is a bug nobody notices until somebody is
 * owed money and the panel says the deal was never won.
 */
export const PAID_STATUSES: readonly LeadStatus[] = ['advance', 'won', 'delivered'];

/** What has actually been received on this deal. */
export function paidFor(lead: Pick<Lead, 'status' | 'dealValue' | 'commissionRate'>): {
  received: number;
  outstanding: number;
  commission: number;
  rate: number;
} {
  const value = lead.dealValue ?? 0;
  const rate = lead.commissionRate ?? 0;

  // An advance is by definition half. Three quarters and half are both
  // conventions and both wrong often enough to matter, so it is a constant in
  // one place rather than a number typed into each lead.
  const fraction =
    lead.status === 'advance' ? 0.5 : PAID_STATUSES.includes(lead.status) ? 1 : 0;

  const received = Math.round(value * fraction);
  return {
    received,
    outstanding: value - received,
    commission: commissionFor(value, rate),
    rate,
  };
}

/* -------------------------------- money -------------------------------- */

/**
 * Commission on a deal.
 *
 * The rate is a percentage and the result is rounded to the rupee, because a
 * commission of 847.5 shows up on a payout screen as a rounding question and
 * nobody is owed half a rupee.
 */
export function commissionFor(
  dealValue: number | undefined,
  rate: number | undefined
): number {
  if (!dealValue || !rate) return 0;
  return Math.round((dealValue * rate) / 100);
}

/**
 * How a deal value should be written.
 *
 * Pakistani rupees are written "PKR 1,250,000" rather than "Rs. 1,250,000" —
 * the code before the amount, the way an international quote reads, which is
 * what this goes on. It is a function rather than a template string at each
 * call site because there are four screens that would otherwise each spell it
 * differently.
 */
export function money(amount: number | undefined): string {
  return `PKR ${(amount ?? 0).toLocaleString('en-GB')}`;
}
