import { MongoClient, type Db } from 'mongodb';

/**
 * MongoDB connection handling.
 *
 * The client is cached on globalThis so Next.js hot reloads and serverless
 * invocations reuse one connection pool instead of opening a new one per
 * request (Atlas enforces a connection-per-IP limit).
 */

const uri = process.env.MONGODB_URI;

declare global {
   
  var __ssMongoClient: MongoClient | undefined;
   
  var __ssMongoPromise: Promise<MongoClient> | undefined;
}

/**
 * Set once Mongo has proven unreachable, so the rest of the process stops
 * trying it.
 *
 * This is not just an optimisation. The stores read with this shape:
 *
 *   if (isMongoConfigured()) {
 *     try { rows = await db… } catch { markUnavailable() }
 *   } else {
 *     rows = await readFile()      // ← this is the fallback
 *   }
 *
 * The `else` is only reached when Mongo is *not configured*, never when it is
 * configured but broken. So a database outage meant writes went to the JSON
 * files while reads still came back empty — the payout ledger, for one, always
 * showed zero money sent no matter what had actually been paid out. Flipping
 * `isMongoConfigured()` to false is what makes that fallback reachable, and it
 * fixes every read at once rather than one at a time.
 *
 * Restarting the server retries Mongo from scratch.
 */
let unavailable = false;
let warnedUnavailable = false;

export function markMongoUnavailable(err: unknown): void {
  unavailable = true;
  if (!warnedUnavailable) {
    warnedUnavailable = true;
    console.warn(
      '[db] MongoDB is unreachable — leads, workers, payouts and bot history are being kept in .data/ files for now.'
    );
    console.warn(
      '[db] Reason:',
      err instanceof Error ? err.message : err,
      '\n[db] Fix MONGODB_URI and restart to go back to the database.'
    );
  }
}

export function isMongoConfigured(): boolean {
  return Boolean(uri) && !unavailable;
}

async function connect(): Promise<MongoClient> {
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (unavailable) throw new Error('MongoDB was marked unreachable earlier in this process.');

  if (globalThis.__ssMongoClient) return globalThis.__ssMongoClient;

  if (!globalThis.__ssMongoPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 8000,
      retryWrites: true,
    });
    globalThis.__ssMongoPromise = client.connect().then((c) => {
      globalThis.__ssMongoClient = c;
      return c;
    });
  }

  return globalThis.__ssMongoPromise;
}

export async function getDb(): Promise<Db> {
  const client = await connect();
  return client.db();
}