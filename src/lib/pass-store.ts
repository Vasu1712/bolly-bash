import { useSyncExternalStore } from "react";
import { claimPass } from "@/app/actions";
import type { ClaimOutcome, Pass, PassDraft } from "./passes";

// The shared guest list lives in the database. This store keeps a client copy
// fresh (poll, tab focus, reconnect) so the live checks and chips reflect
// claims made on other devices. The server has the final say on every claim.

type PassState = {
  passes: readonly Pass[];
  /** The list has loaded at least once. */
  ready: boolean;
  /** The last refresh failed; the list may be stale. */
  failed: boolean;
};

const POLL_MS = 8000;
const NO_PASSES: readonly Pass[] = [];
const SERVER_STATE: PassState = { passes: NO_PASSES, ready: false, failed: false };

let state = SERVER_STATE;
// Bumped by every local change so a slower, older refresh cannot overwrite it.
let epoch = 0;
const listeners = new Set<() => void>();

function setState(next: PassState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function isPass(value: unknown): value is Pass {
  const pass = value as Record<string, unknown> | null;
  return (
    !!pass &&
    typeof pass.ticketId === "string" &&
    typeof pass.guestName === "string" &&
    typeof pass.character === "string" &&
    typeof pass.movie === "string" &&
    typeof pass.claimedAt === "string"
  );
}

function samePasses(a: readonly Pass[], b: readonly Pass[]) {
  return a.length === b.length && a.every((pass, i) => pass.ticketId === b[i].ticketId);
}

async function refresh() {
  const started = epoch;
  try {
    const response = await fetch("/api/passes", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    if (started !== epoch) return;
    const passes = data.filter(isPass);
    if (state.ready && !state.failed && samePasses(passes, state.passes)) return;
    setState({ passes: samePasses(passes, state.passes) ? state.passes : passes, ready: true, failed: false });
  } catch {
    if (!state.failed) setState({ ...state, failed: true });
  }
}

let stopSync: (() => void) | undefined;

function startSync() {
  void refresh();
  const poll = window.setInterval(() => {
    if (document.visibilityState === "visible") void refresh();
  }, POLL_MS);
  const wake = () => {
    if (document.visibilityState === "visible") void refresh();
  };
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("focus", wake);
  window.addEventListener("online", wake);
  stopSync = () => {
    window.clearInterval(poll);
    document.removeEventListener("visibilitychange", wake);
    window.removeEventListener("focus", wake);
    window.removeEventListener("online", wake);
  };
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (listeners.size === 1) startSync();
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      stopSync?.();
      stopSync = undefined;
    }
  };
}

/** The shared guest list. Empty and not ready during prerender and hydration. */
export function usePassStore() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
}

/** Adds passes we just learned about without waiting for the next refresh. */
function remember(...incoming: Pass[]) {
  epoch++;
  const known = new Set(incoming.map((pass) => pass.ticketId));
  setState({
    passes: [...incoming, ...state.passes.filter((pass) => !known.has(pass.ticketId))],
    ready: true,
    failed: false,
  });
}

/** Asks the server to lock the character. Only one guest can ever win a given one. */
export async function claimCharacter(draft: PassDraft): Promise<ClaimOutcome> {
  try {
    const outcome = await claimPass(draft);
    if (outcome.ok) remember(outcome.pass);
    else if (outcome.reason === "taken") remember(outcome.existing);
    return outcome;
  } catch {
    return { ok: false, reason: "error" };
  }
}
