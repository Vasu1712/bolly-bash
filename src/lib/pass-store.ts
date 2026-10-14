import { useSyncExternalStore } from "react";
import { findClaim, indexClaims } from "./characters";
import { EVENT } from "./event";
import { createTicketId, type Pass, type PassDraft } from "./passes";

const STORAGE_KEY = EVENT.storageKey;
const NO_PASSES: readonly Pass[] = [];

let cachedRaw: string | null = null;
let cachedPasses: readonly Pass[] = NO_PASSES;
// Set when localStorage refuses writes (blocked or full); passes then live in memory.
let memoryOnly = false;
const listeners = new Set<() => void>();

function toPass(value: unknown): Pass | null {
  if (!value || typeof value !== "object") return null;
  const { ticketId, guestName, character, movie, claimedAt } = value as Record<string, unknown>;
  if (
    typeof ticketId !== "string" ||
    typeof guestName !== "string" ||
    typeof character !== "string" ||
    typeof movie !== "string"
  ) {
    return null;
  }
  return { ticketId, guestName, character, movie, claimedAt: typeof claimedAt === "string" ? claimedAt : "" };
}

function parse(raw: string | null): readonly Pass[] {
  if (!raw) return NO_PASSES;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return NO_PASSES;
    return data.map(toPass).filter((pass): pass is Pass => pass !== null);
  } catch {
    return NO_PASSES;
  }
}

/** Re-reads storage; returns true when another tab changed it since the last read. */
function syncFromStorage() {
  if (memoryOnly) return false;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked: behave like an empty list.
  }
  if (raw === cachedRaw) return false;
  cachedRaw = raw;
  cachedPasses = parse(raw);
  return true;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  syncFromStorage();
  return cachedPasses;
}

function getServerSnapshot() {
  return NO_PASSES;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Fires when another tab writes, so every open tab's roster stays live.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: readonly Pass[]) {
  const raw = next.length ? JSON.stringify(next) : null;
  try {
    if (raw) window.localStorage.setItem(STORAGE_KEY, raw);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    memoryOnly = true;
  }
  cachedRaw = raw;
  cachedPasses = next;
  emit();
}

/** Every registered pass, newest first. Empty during prerender and hydration. */
export function usePasses() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/** False during prerender and hydration, true once the browser has taken over. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export type ClaimResult = { ok: true; pass: Pass } | { ok: false; existing: Pass };

/** Enforces the one-character rule against the freshest saved list, then saves the pass. */
export function claimCharacter(draft: PassDraft): ClaimResult {
  if (syncFromStorage()) emit();
  const passes = cachedPasses;

  const existing = findClaim(indexClaims(passes), draft.character);
  if (existing) return { ok: false, existing };

  const pass: Pass = {
    ticketId: createTicketId(draft.character, new Set(passes.map((p) => p.ticketId))),
    guestName: draft.guestName,
    character: draft.character,
    movie: draft.movie,
    claimedAt: new Date().toISOString(),
  };
  commit([pass, ...passes]);
  return { ok: true, pass };
}
