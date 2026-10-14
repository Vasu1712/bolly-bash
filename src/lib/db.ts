import "server-only";
import { createClient, type Client } from "@libsql/client";

// character_key is the normalised character name (aliases folded together) and
// is UNIQUE, so the database itself refuses a second claim even when two guests
// submit at the same instant.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS passes (
    ticket_id     TEXT PRIMARY KEY,
    guest_name    TEXT NOT NULL,
    character     TEXT NOT NULL,
    character_key TEXT NOT NULL UNIQUE,
    movie         TEXT NOT NULL,
    claimed_at    TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS passes_claimed_at ON passes (claimed_at DESC)`,
];

let ready: Promise<Client> | undefined;

function connect() {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  if (process.env.NODE_ENV === "production") {
    throw new Error("TURSO_DATABASE_URL is not set. Add it (and TURSO_AUTH_TOKEN) to the environment.");
  }
  // Local development without a Turso database: a plain SQLite file.
  return createClient({ url: "file:local.db" });
}

/** The shared database client, with the schema created on first use. */
export function getDb() {
  ready ??= (async () => {
    const client = connect();
    await client.batch(SCHEMA, "write");
    return client;
  })().catch((error) => {
    ready = undefined; // let the next request retry
    throw error;
  });
  return ready;
}
