/**
 * Where leads are kept.
 *
 * Two backends, one interface. MongoDB when `MONGODB_URI` answers, a JSON file
 * otherwise. The file backend is what makes the panel usable on a laptop with no
 * database at all, and what makes the deployed version *readable* before one has
 * been set up — but never writable, because a serverless disk is read-only and a
 * save that reports success and then vanishes is the worst possible outcome.
 *
 * Reads never distinguish the two. A missing database produces exactly the same
 * list as an empty one, which is what makes the panel look right on a first
 * deploy with nothing configured.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Lead, LeadStatus, Tier, Urgency } from './types';
import { dataDir, dataFile } from './paths';
import seedLeads from './seed/leads.json';

const DATA_DIR = dataDir();
const LEADS_FILE = dataFile('leads.json');
const COLLECTION = 'leads';
/** Where the "the shipped leads are already in" marker is kept. */
const META_COLLECTION = 'system_meta';
const SEED_MARKER = 'leads-seeded';

export type Backend = 'mongodb' | 'file';

/* ------------------------------- database ------------------------------- */

let clientPromise: Promise<{ db: import('mongodb').Db } | null> | null = null;

/** Cached per process, so ten requests in a second do not open ten sockets. */
async function connect(): Promise<import('mongodb').Db | null> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return null;

  if (!clientPromise) {
    clientPromise = (async () => {
      try {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
        await client.connect();
        const db = client.db();
        // The index and the shipped leads are put in place before the first
        // read, so a brand new cluster is never seen empty.
        await prepare(db);
        return { db };
      } catch {
        // Any failure at all means the file backend, and the caller finds out
        // through `backend()` rather than through an exception.
        return null;
      }
    })();
  }

  const result = await clientPromise;
  return result?.db ?? null;
}

/** Which backend a request is actually using. Shown in the UI. */
export async function backend(): Promise<Backend> {
  return (await connect()) ? 'mongodb' : 'file';
}

/**
 * Get the database ready, once per process.
 *
 * Two things, and only the first time a process touches the database:
 *
 * An index on the lead id, so the same lead can never be in there twice; and
 * the shipped leads, if the collection is empty. A brand new cluster is
 * otherwise an empty panel, and an empty panel reads as a broken website
 * rather than as a database that has not been filled yet — so the first
 * request fills it.
 *
 * Filling happens **once**, not once per process. A marker in the database
 * says it has been done, and that matters in two ways: two serverless
 * instances starting at the same moment do not both fill it, and an admin
 * who deliberately empties the list does not find it full again the next
 * time a cold function starts.
 */
let prepared: Promise<void> | null = null;

function prepare(db: import('mongodb').Db): Promise<void> {
  if (!prepared) {
    prepared = (async () => {
      const collection = db.collection(COLLECTION);

      // Sparse, because a row without an id is allowed to exist and two of
      // those would otherwise be a duplicate and break the whole collection.
      await collection
        .createIndex({ id: 1 }, { unique: true, sparse: true })
        .catch(() => undefined);

      const meta = db.collection<{
        _id: string;
        at: string;
        done?: boolean;
        count?: number;
      }>(META_COLLECTION);
      const marker = await meta.findOne({ _id: SEED_MARKER }).catch(() => null);

      if (marker) {
        // Another run claimed the filling. If it never finished, finish it —
        // but only if the collection really is empty, because an admin who
        // emptied the list on purpose must not have it back.
        if (marker.done === true) return;
        if ((await collection.countDocuments({})) > 0) return;
      } else {
        // Claiming it. The insert fails if another instance got here first,
        // and that instance is the one doing the work.
        try {
          await meta.insertOne({
            _id: SEED_MARKER,
            at: new Date().toISOString(),
            done: false,
          });
        } catch {
          return;
        }
      }

      const rows = seedDocuments();
      if (rows.length === 0) return;

      // Unordered, so one bad row does not stop the rest from going in. The
      // index above means a lead that is already there is skipped rather
      // than copied, so running this twice is harmless.
      await collection.insertMany(rows as never[], { ordered: false }).catch(() => undefined);

      await meta
        .updateOne({ _id: SEED_MARKER }, { $set: { done: true, count: rows.length } })
        .catch(() => undefined);
    })().catch(() => undefined);
  }
  return prepared;
}

/* --------------------------------- seed --------------------------------- */

export interface SeedLead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  service?: string;
  details?: string;
  city?: string;
  countryCode?: string;
  countryName?: string;
  source?: string;
  whatsapp?: string;
  tier?: Tier;
  createdAt?: string;
}

/**
 * The leads the site ships with.
 *
 * They live inside the package rather than in a loose file on the disk,
 * because a deployed function carries its code and nothing else: the file on
 * a laptop is not on the disk of the server. A panel that shows no leads
 * until somebody remembers to run a script reads as broken, not as empty.
 */
const SEED: SeedLead[] = Array.isArray(seedLeads) ? (seedLeads as SeedLead[]) : [];

/**
 * The leads committed to the repository.
 *
 * Already in memory — the file is part of the code — so this is a copy of the
 * list, not a read.
 */
async function readSeed(): Promise<SeedLead[]> {
  return SEED;
}

/**
 * A seed lead in the shape the database stores.
 *
 * The tier goes in under `botTier` — the name the database filter looks at —
 * and not under `tier`, which is the name the rest of the code calls it. A
 * row written under the wrong name is a row the "Best first" filter cannot
 * find, which is how a database ends up with 672 leads and no way to sort
 * them.
 *
 * The dates are the seed's own, not "now". Stamping every row with the
 * current time gave 672 identical timestamps, and "newest first" then had no
 * defined order.
 */
export function seedDocuments(): Record<string, unknown>[] {
  const now = new Date().toISOString();

  return SEED.map((s) => ({
    id: s.id,
    name: s.name,
    phone: s.phone,
    email: s.email,
    company: s.company ?? s.name,
    city: s.city,
    details: s.details ?? '',
    service: s.service,
    status: 'new',
    urgency: 'planning',
    source: s.source,
    whatsapp: s.whatsapp,
    botTier: s.tier,
    botCity: s.city,
    botCountry: s.countryCode,
    botCountryName: s.countryName,
    botWebsiteStatus: 'none',
    botProvider: 'openstreetmap',
    channel: 'hunter',
    createdAt: s.createdAt ?? now,
    updatedAt: s.createdAt ?? now,
  }));
}

/** Every lead the site ships with. */
export async function seedCount(): Promise<number> {
  return (await readSeed()).length;
}

/**
 * Whether anything can be written at all.
 *
 * Probed once. On Vercel the filesystem is read-only and every write throws
 * EROFS, so checking before trying is what lets the panel say so plainly
 * instead of appearing to save changes and losing them.
 */
let writable: boolean | null = null;

export async function canWrite(): Promise<boolean> {
  if (writable !== null) return writable;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const probe = path.join(DATA_DIR, '.probe');
    await fs.writeFile(probe, 'ok');
    await fs.unlink(probe);
    writable = true;
  } catch {
    writable = false;
  }
  return writable;
}

/* ------------------------------ conversion ------------------------------ */

const DEFAULTS = {
  status: 'new' as LeadStatus,
  urgency: 'planning' as Urgency,
  service: 'Small business website',
  source: 'openstreetmap',
  websiteStatus: 'none' as const,
};

/**
 * Fill in everything a stored row is missing, so the UI never sees a hole.
 *
 * The lead is rebuilt field by field rather than spread out of the stored row.
 * That is deliberate: the database carries a few fields that belong to the
 * database — Mongo's own `_id`, and the `bot…` names the old hunter used — and
 * a spread would hand them to the screen as if they were part of the lead.
 * The file backend has none of them, so the two backends would give the same
 * page two different shapes.
 */
function normalise(raw: Record<string, unknown>): Lead {
  const now = new Date().toISOString();

  const text = (value: unknown): string | undefined =>
    typeof value === 'string' ? value : undefined;

  const number = (value: unknown): number | undefined =>
    typeof value === 'number' && Number.isFinite(value) ? value : undefined;

  return {
    id: String(raw.id ?? ''),

    // ── who they are ──
    name: String(raw.name ?? 'Unnamed'),
    phone: text(raw.phone),
    email: text(raw.email),
    company: text(raw.company),
    city: text(raw.city),
    countryName: text(raw.countryName),

    // ── what they want ──
    service: text(raw.service) ?? DEFAULTS.service,
    details: text(raw.details) ?? '',
    websiteStatus: (raw.websiteStatus as Lead['websiteStatus']) ?? DEFAULTS.websiteStatus,
    source: text(raw.source) ?? DEFAULTS.source,

    // ── where it is ──
    status: (raw.status as LeadStatus) ?? DEFAULTS.status,
    urgency: (raw.urgency as Urgency) ?? DEFAULTS.urgency,
    lookingSince: text(raw.lookingSince),
    neededBy: text(raw.neededBy),
    budget: text(raw.budget),
    notes: text(raw.notes),

    // ── money ──
    dealValue: number(raw.dealValue),
    commissionRate: number(raw.commissionRate),
    commissionAmount: number(raw.commissionAmount),

    // ── where it came from ──
    // The tier is stored under `botTier` — that is the name the old hunter
    // wrote and the name the database filter still uses — but a lead added
    // by hand is stored under `tier`. Both are read, so a hand-added lead
    // keeps the tier it was given instead of quietly losing it.
    tier: (raw.botTier ?? raw.tier) as Tier | undefined,
    whatsapp: text(raw.whatsapp),
    query: text(raw.query),
    english: typeof raw.english === 'boolean' ? raw.english : undefined,

    // ── whose it is ──
    assignedTo: text(raw.assignedTo),
    outreach: (raw.outreach as Lead['outreach']) ?? null,

    createdAt: text(raw.createdAt) ?? now,
    updatedAt: text(raw.updatedAt) ?? now,
  };
}

function seedToLead(s: SeedLead): Lead {
  return normalise({
    id: s.id,
    name: s.name,
    phone: s.phone,
    email: s.email,
    company: s.company ?? s.name,
    service: s.service,
    details: s.details,
    city: s.city,
    countryCode: s.countryCode,
    countryName: s.countryName,
    source: s.source,
    whatsapp: s.whatsapp,
    botTier: s.tier,
    createdAt: s.createdAt,
  });
}

/* --------------------------------- reads -------------------------------- */

async function readFile(): Promise<Lead[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(LEADS_FILE, 'utf8'));
    if (Array.isArray(parsed)) return parsed.map((r) => normalise(r));
  } catch {
    // Fall through to the seed.
  }
  return (await readSeed()).map(seedToLead);
}

export interface Query {
  search?: string;
  status?: LeadStatus[];
  urgency?: Urgency[];
  tier?: Tier[];
  /** Only the leads belonging to this employee id. */
  assignedTo?: string;
  /** Only the leads with nobody assigned. */
  unassigned?: boolean;
  page?: number;
  limit?: number;
}

export interface Page {
  leads: Lead[];
  total: number;
  page: number;
  pages: number;
}

function matches(lead: Lead, q: Query): boolean {
  if (q.status?.length && !q.status.includes(lead.status)) return false;
  if (q.urgency?.length && !q.urgency.includes(lead.urgency)) return false;
  if (q.tier?.length && !q.tier.includes(lead.tier ?? 'B')) return false;

  // Assigned to one person, or to nobody.
  if (q.assignedTo && lead.assignedTo !== q.assignedTo) return false;
  if (q.unassigned && lead.assignedTo) return false;

  if (q.search) {
    const needle = q.search.toLowerCase();
    const haystack = [
      lead.name,
      lead.company,
      lead.phone,
      lead.email,
      lead.city,
      lead.service,
      lead.details,
      lead.notes,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export async function query(q: Query = {}): Promise<Page> {
  const limit = Math.min(200, Math.max(1, q.limit ?? 25));
  const page = Math.max(1, q.page ?? 1);

  const db = await connect();
  let leads: Lead[];

  if (db) {
    try {
      const filter: Record<string, unknown> = {};
      if (q.status?.length) filter.status = { $in: q.status };
      if (q.urgency?.length) filter.urgency = { $in: q.urgency };
      if (q.tier?.length) filter.botTier = { $in: q.tier };
      if (q.assignedTo) filter.assignedTo = q.assignedTo;
      if (q.unassigned) filter.assignedTo = { $in: ['', null] };
      if (q.search) {
        // Case-insensitive contains, across the fields a person would search
        // by. A regex here is safe because the input is a string from a query
        // parameter and is escaped — an unescaped one would be an injection.
        const safe = q.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(safe, 'i');
        filter.$or = ['name', 'company', 'phone', 'email', 'city', 'service', 'details', 'notes']
          .map((f) => ({ [f]: rx }));
      }

      const collection = db.collection(COLLECTION);
      const total = await collection.countDocuments(filter);
      const docs = await collection
        .find(filter)
        // Newest first, with the id breaking any tie so the order is stable.
        // Without the tiebreak two leads created in the same millisecond swap
        // places between requests and paging repeats rows.
        .sort({ createdAt: -1, id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      leads = docs.map((d) => normalise(d as Record<string, unknown>));
      const pages = Math.max(1, Math.ceil(total / limit));
      return { leads, total, page: Math.min(page, pages), pages };
    } catch {
      // A query that fails must not empty the screen. Fall back to the file
      // copy, which at worst is stale.
      leads = await readFile();
    }
  } else {
    leads = await readFile();
  }

  const rows = leads.filter((l) => matches(l, q));
  // Same tiebreak as the database path, so paging behaves identically on both.
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));

  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);

  return {
    leads: rows.slice((safePage - 1) * limit, safePage * limit),
    total,
    page: safePage,
    pages,
  };
}

export async function getOne(id: string): Promise<Lead | null> {
  const db = await connect();
  if (db) {
    try {
      const doc = await db.collection(COLLECTION).findOne({ id });
      if (doc) return normalise(doc as Record<string, unknown>);
    } catch {
      /* fall through */
    }
  }
  const all = await readFile();
  const found = all.find((l) => l.id === id);
  return found ?? null;
}

export async function count(): Promise<number> {
  const db = await connect();
  if (db) {
    try {
      return await db.collection(COLLECTION).countDocuments({});
    } catch {
      /* fall through */
    }
  }
  return (await readFile()).length;
}

/* -------------------------------- writes -------------------------------- */

/**
 * True when the last write reached somewhere real.
 *
 * Read immediately after a write so the API can say "saved" or "not saved"
 * honestly. A panel that reports success for a change that went nowhere is worse
 * than one that refuses.
 */
let lastWriteStored = true;

export function didWriteStore(): boolean {
  return lastWriteStored;
}

async function writeFile(leads: Lead[]): Promise<void> {
  if (!(await canWrite())) throw new Error('read-only');
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Written to a temporary file and renamed, so a crash halfway through cannot
  // leave a half-written list where the real one was.
  const tmp = `${LEADS_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(leads, null, 2), 'utf8');
  await fs.rename(tmp, LEADS_FILE);
}

export async function insert(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
  const now = new Date().toISOString();
  const record: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  // The tier goes in under both names. `botTier` is what the database filter
  // looks at, and `tier` is what the rest of the code calls it. Writing one
  // without the other is how a lead added by hand ends up with no tier at
  // all the moment it is read back.
  const stored = { ...record } as Lead & { botTier?: Tier };
  if (stored.tier) stored.botTier = stored.tier;

  lastWriteStored = false;

  const db = await connect();
  if (db) {
    try {
      await db.collection(COLLECTION).insertOne(stored as never);
      lastWriteStored = true;
      return record;
    } catch {
      /* fall through to the file */
    }
  }

  const all = await readFile();
  all.push(stored as Lead);
  await writeFile(all);
  lastWriteStored = true;
  return record;
}

export async function update(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  lastWriteStored = false;
  const changes = { ...patch, updatedAt: new Date().toISOString() };

  const db = await connect();
  if (db) {
    try {
      const res = await db
        .collection(COLLECTION)
        .findOneAndUpdate({ id }, { $set: changes }, { returnDocument: 'after' });
      if (res) {
        lastWriteStored = true;
        return normalise(res as Record<string, unknown>);
      }
      return null;
    } catch {
      /* fall through */
    }
  }

  const all = await readFile();
  const index = all.findIndex((l) => l.id === id);
  if (index === -1) return null;

  all[index] = { ...all[index], ...changes };
  try {
    await writeFile(all);
    lastWriteStored = true;
  } catch {
    // The merge is returned anyway. The caller has already done the real work
    // and needs the result; whether it stuck is reported separately.
    lastWriteStored = false;
  }
  return all[index];
}

export async function remove(id: string): Promise<boolean> {
  lastWriteStored = false;

  const db = await connect();
  if (db) {
    try {
      const res = await db.collection(COLLECTION).deleteOne({ id });
      lastWriteStored = true;
      return res.deletedCount > 0;
    } catch {
      /* fall through */
    }
  }

  const all = await readFile();
  const next = all.filter((l) => l.id !== id);
  if (next.length === all.length) return false;

  await writeFile(next);
  lastWriteStored = true;
  return true;
}

export async function removeAll(): Promise<number> {
  lastWriteStored = false;

  const db = await connect();
  if (db) {
    try {
      const res = await db.collection(COLLECTION).deleteMany({});
      lastWriteStored = true;
      return res.deletedCount;
    } catch {
      /* fall through */
    }
  }

  const all = await readFile();
  await writeFile([]);
  lastWriteStored = true;
  return all.length;
}

export async function updateMany(
  ids: string[],
  patch: Partial<Pick<Lead, 'status' | 'notes'>>
): Promise<number> {
  lastWriteStored = false;

  const db = await connect();
  if (db) {
    try {
      const res = await db
        .collection(COLLECTION)
        .updateMany({ id: { $in: ids } }, { $set: patch });
      lastWriteStored = true;
      return res.modifiedCount;
    } catch {
      /* fall through */
    }
  }

  const all = await readFile();
  let changed = 0;
  for (const lead of all) {
    if (!ids.includes(lead.id)) continue;
    all[all.indexOf(lead)] = { ...lead, ...patch, updatedAt: new Date().toISOString() };
    changed += 1;
  }
  await writeFile(all);
  lastWriteStored = true;
  return changed;
}

export function uuid(): string {
  return crypto.randomUUID();
}