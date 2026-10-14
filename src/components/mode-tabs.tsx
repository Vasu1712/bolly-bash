"use client";

import { Search, Ticket } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export type Tab = "register" | "lookup";

const TABS = [
  { id: "register", icon: Ticket, label: "Claim character & get pass", short: "Get your pass" },
  { id: "lookup", icon: Search, label: "Find my ticket pass", short: "Find my pass" },
] as const;

export const PANEL_ID = "pass-panel";

export function ModeTabs({
  active,
  count,
  onChange,
}: {
  active: Tab;
  /** Registered pass count, or null until the saved list has loaded. */
  count: number | null;
  onChange: (tab: Tab) => void;
}) {
  const buttons = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: Tab = active === "register" ? "lookup" : "register";
    onChange(next);
    buttons.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Party pass"
      onKeyDown={handleKeyDown}
      className="mx-auto grid w-full max-w-xl grid-cols-2 gap-1 rounded-full bg-ink-900/75 p-1.5 ring-1 ring-white/10 backdrop-blur"
    >
      {TABS.map(({ id, icon: Icon, label, short }) => {
        const selected = active === id;
        return (
          <button
            key={id}
            ref={(node) => {
              buttons.current[id] = node;
            }}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={selected}
            aria-controls={PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            className={cn(
              "flex h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition duration-300",
              selected
                ? "bg-rani-500 text-white shadow-[0_8px_24px_-8px_rgb(255_45_149/0.85)]"
                : "text-lilac-300 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{short}</span>
          </button>
        );
      })}
    </div>
  );
}
