import { EVENT } from "./event";

export type Pass = {
  ticketId: string;
  guestName: string;
  character: string;
  movie: string;
  /** ISO timestamp. Passes saved by the original HTML page hold a display time instead. */
  claimedAt: string;
};

export type PassDraft = Pick<Pass, "guestName" | "character" | "movie">;

export const EMPTY_DRAFT: PassDraft = { guestName: "", character: "", movie: "" };

export const FIELD_LIMITS: Record<keyof PassDraft, number> = {
  guestName: 60,
  character: 60,
  movie: 80,
};

export function createTicketId(character: string, takenIds: ReadonlySet<string>) {
  const initials = (character.replace(/[^a-zA-Z]/g, "").slice(0, 2) || "BN").toUpperCase();
  for (let attempt = 0; ; attempt++) {
    // Four digits like the original; widen if a guest list ever gets crowded.
    const digits = attempt < 25 ? 4 : 6;
    const number = 10 ** (digits - 1) + Math.floor(Math.random() * 9 * 10 ** (digits - 1));
    const id = `${EVENT.ticketPrefix}-${initials}${number}`;
    if (!takenIds.has(id)) return id;
  }
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
