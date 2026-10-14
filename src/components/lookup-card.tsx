"use client";

import { SearchX, TicketCheck, Ticket } from "lucide-react";
import type { Pass } from "@/lib/passes";
import { Card, CardHeader, CharacterAvatar, EmptyState, ListSkeleton, SearchField } from "./ui";

export function LookupCard({
  passes,
  ready,
  query,
  onQueryChange,
  onView,
}: {
  passes: readonly Pass[];
  ready: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onView: (ticketId: string) => void;
}) {
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? passes.filter((pass) =>
        [pass.ticketId, pass.guestName, pass.character].some((field) => field.toLowerCase().includes(needle)),
      )
    : passes;

  return (
    <Card>
      <CardHeader
        icon={TicketCheck}
        tone="peacock"
        title="Look up your party pass"
        description="Already registered? Enter your ticket ID, guest name or character name to pull up your pass."
      />

      <div className="mt-6">
        <SearchField
          label="Search passes"
          value={query}
          onChange={onQueryChange}
          placeholder="Ticket ID (VS-16OCT-…), your name or character"
        />
      </div>

      <div className="mt-4">
        {!ready ? (
          <ListSkeleton />
        ) : matches.length ? (
          <ul className="scrollbar-thin max-h-[30rem] space-y-2 overflow-y-auto pr-1">
            {matches.map((pass) => (
              <li
                key={pass.ticketId}
                className="flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 transition hover:border-peacock-400/30 hover:bg-white/[0.045]"
              >
                <CharacterAvatar name={pass.character} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {pass.guestName} <span className="font-normal text-lilac-400">as</span>{" "}
                    <span className="text-peacock-200">{pass.character}</span>
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-lilac-400">
                    <span className="text-gold-200/90">{pass.movie}</span> ·{" "}
                    <span className="font-mono text-xs">{pass.ticketId}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onView(pass.ticketId)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-300/10 px-3.5 py-2 text-xs font-semibold text-gold-200 ring-1 ring-inset ring-gold-300/30 transition hover:bg-gold-300/20 hover:ring-gold-300/60"
                >
                  <Ticket aria-hidden="true" className="size-3.5" />
                  View pass
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={SearchX}>
            {passes.length
              ? "No passes found matching your search."
              : "No passes yet. Claim a character to create the very first one!"}
          </EmptyState>
        )}
      </div>
    </Card>
  );
}
