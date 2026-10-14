"use server";

import { characterKey } from "@/lib/characters";
import { FIELD_LIMITS, type ClaimOutcome, type PassDraft } from "@/lib/passes";
import { insertPass } from "@/lib/passes-db";

/** Trims, collapses whitespace and drops control characters. */
function tidy(value: unknown, limit: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);
}

/**
 * Claims a character for a guest. Server Functions are reachable by direct
 * POST, so every field is re-validated here rather than trusted from the form.
 */
export async function claimPass(input: PassDraft): Promise<ClaimOutcome> {
  const draft: PassDraft = {
    guestName: tidy(input?.guestName, FIELD_LIMITS.guestName),
    character: tidy(input?.character, FIELD_LIMITS.character),
    movie: tidy(input?.movie, FIELD_LIMITS.movie),
  };
  if (!draft.guestName || !draft.character || !draft.movie || !characterKey(draft.character)) {
    return { ok: false, reason: "invalid" };
  }

  try {
    return await insertPass(draft);
  } catch (error) {
    console.error("claimPass failed", error);
    return { ok: false, reason: "error" };
  }
}
