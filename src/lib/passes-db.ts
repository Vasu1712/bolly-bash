import "server-only";
import type { Row } from "@libsql/client";
import { characterKey } from "./characters";
import { getDb } from "./db";
import { createTicketId, type ClaimOutcome, type Pass, type PassDraft } from "./passes";

const COLUMNS = "ticket_id, guest_name, character, movie, claimed_at";
const MAX_TICKET_ATTEMPTS = 8;

function toPass(row: Row): Pass {
  return {
    ticketId: String(row.ticket_id),
    guestName: String(row.guest_name),
    character: String(row.character),
    movie: String(row.movie),
    claimedAt: String(row.claimed_at),
  };
}

/** Every pass, newest first. */
export async function listPasses(): Promise<Pass[]> {
  const db = await getDb();
  const result = await db.execute(`SELECT ${COLUMNS} FROM passes ORDER BY claimed_at DESC, ticket_id LIMIT 2000`);
  return result.rows.map(toPass);
}

async function findByKey(key: string) {
  const db = await getDb();
  const result = await db.execute({ sql: `SELECT ${COLUMNS} FROM passes WHERE character_key = ?`, args: [key] });
  return result.rows[0] ? toPass(result.rows[0]) : undefined;
}

function isConstraintError(error: unknown) {
  const { code, message } = (error ?? {}) as { code?: unknown; message?: unknown };
  return /constraint/i.test(`${String(code)} ${String(message)}`);
}

/**
 * Saves a pass unless the character is already taken. The UNIQUE constraint on
 * character_key makes this atomic: of two simultaneous claims, one wins and the
 * other is told who got there first.
 */
export async function insertPass(draft: PassDraft): Promise<ClaimOutcome> {
  const key = characterKey(draft.character);
  if (!key) return { ok: false, reason: "invalid" };

  const db = await getDb();
  for (let attempt = 0; attempt < MAX_TICKET_ATTEMPTS; attempt++) {
    const pass: Pass = {
      ticketId: createTicketId(draft.character, attempt < 3 ? 4 : 6),
      guestName: draft.guestName,
      character: draft.character,
      movie: draft.movie,
      claimedAt: new Date().toISOString(),
    };
    try {
      await db.execute({
        sql: `INSERT INTO passes (ticket_id, guest_name, character, character_key, movie, claimed_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [pass.ticketId, pass.guestName, pass.character, key, pass.movie, pass.claimedAt],
      });
      return { ok: true, pass };
    } catch (error) {
      if (!isConstraintError(error)) throw error;
      // Either someone holds this character, or the ticket ID collided.
      const existing = await findByKey(key);
      if (existing) return { ok: false, reason: "taken", existing };
    }
  }
  throw new Error("Could not allocate a unique ticket ID");
}
