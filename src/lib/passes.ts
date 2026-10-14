import { EVENT } from "./event";

export type Pass = {
  ticketId: string;
  guestName: string;
  character: string;
  movie: string;
  /** ISO timestamp. */
  claimedAt: string;
};

export type PassDraft = Pick<Pass, "guestName" | "character" | "movie">;

export const EMPTY_DRAFT: PassDraft = { guestName: "", character: "", movie: "" };

export const FIELD_LIMITS: Record<keyof PassDraft, number> = {
  guestName: 60,
  character: 60,
  movie: 80,
};

export type ClaimOutcome =
  | { ok: true; pass: Pass }
  | { ok: false; reason: "taken"; existing: Pass }
  | { ok: false; reason: "invalid" | "error" };

export function createTicketId(character: string, digits = 4) {
  const initials = (character.replace(/[^a-zA-Z]/g, "").slice(0, 2) || "BN").toUpperCase();
  const number = 10 ** (digits - 1) + Math.floor(Math.random() * 9 * 10 ** (digits - 1));
  return `${EVENT.ticketPrefix}-${initials}${number}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Revoking straight away can cancel the download in Safari.
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
