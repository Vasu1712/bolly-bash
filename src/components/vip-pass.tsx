"use client";

import { ArrowLeft, BadgeCheck, CalendarDays, Clock, Download, LoaderCircle, Martini, Star, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EVENT, EVENT_DATE } from "@/lib/event";
import { renderPassImage } from "@/lib/pass-image";
import { downloadBlob, type Pass } from "@/lib/passes";
import { Barcode } from "./barcode";
import type { Notify } from "./toast";

export function VipPass({
  pass,
  onRegisterAnother,
  onBack,
  notify,
}: {
  pass: Pass;
  onRegisterAnother: () => void;
  /** Shown when the pass was opened from search results. */
  onBack?: () => void;
  notify: Notify;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  // Bring the freshly revealed pass into view, e.g. after submitting on a phone.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const { top } = node.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight * 0.5) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }, []);

  async function handleDownload() {
    setSaving(true);
    try {
      const image = await renderPassImage(pass);
      downloadBlob(image, `${pass.ticketId}_Bollywood_Night_Pass.png`);
      notify("Pass downloaded. See you on the dance floor!");
    } catch {
      notify("Couldn't create the pass image. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={containerRef} className="scroll-mt-6">
      <div className="ticket-shadow animate-pop-in">
        <article aria-label={`Party pass for ${pass.guestName}`}>
          <div className="ticket-top relative overflow-hidden rounded-t-[28px] border border-b-0 border-gold-300/45">
            <div className="flex items-center justify-between gap-3 border-b border-gold-300/40 bg-rani-500 px-5 py-3 sm:px-6">
              <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-[11px] sm:tracking-[0.22em]">
                <span className="hidden sm:inline">{EVENT.presenter} · </span>Official entry pass
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold-300 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-ink-950 sm:text-[10px]">
                <Star aria-hidden="true" className="size-3 fill-current" />
                Main character VIP
              </span>
            </div>

            <div className="px-5 pb-7 pt-7 sm:px-7">
              <div className="text-center">
                <p className="text-foil font-display text-[2.6rem] leading-none sm:text-[3.25rem]">{EVENT.name}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-peacock-300 sm:text-[11px]">
                  {EVENT.dressCode.replace(/!$/, "")}
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl border border-gold-300/20 bg-ink-950/45 p-4 sm:p-5">
                <div className="col-span-2 border-b border-dashed border-white/[0.12] pb-4">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-lilac-300">Guest name</dt>
                  <dd className="mt-1 break-words text-xl font-bold text-white sm:text-2xl">{pass.guestName}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-lilac-300">Locked character</dt>
                  <dd className="mt-1 break-words text-lg font-bold leading-snug text-peacock-300 [text-shadow:0_0_18px_rgb(46_233_208/0.4)] sm:text-xl">
                    {pass.character}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-lilac-300">From movie</dt>
                  <dd className="mt-1 break-words text-base font-bold leading-snug text-gold-300 sm:text-lg">{pass.movie}</dd>
                </div>
              </dl>

              <ul className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-rani-400/25 bg-rani-500/10 px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white sm:text-[11px]">
                <li className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-3.5 text-rani-300" />
                  {EVENT_DATE}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden="true" className="size-3.5 text-rani-300" />
                  {EVENT.time}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Martini aria-hidden="true" className="size-3.5 text-rani-300" />
                  {EVENT.perks.filter((perk) => perk !== "Pictures").join(" · ")}
                </li>
              </ul>
            </div>

            <span
              aria-hidden="true"
              className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 bg-linear-to-r from-transparent via-white/[0.14] to-transparent"
            />
          </div>

          <div className="ticket-bottom relative flex flex-wrap items-center justify-between gap-x-4 gap-y-5 rounded-b-[28px] border border-t-0 border-gold-300/45 px-5 pb-6 pt-6 sm:px-7">
            <span aria-hidden="true" className="absolute inset-x-6 top-0 border-t-2 border-dashed border-gold-300/45" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">Official ticket ID</p>
              <p className="mt-1.5 inline-block rounded-lg border border-peacock-400/40 bg-white/5 px-3 py-1.5 font-mono text-lg font-bold tracking-wider text-white sm:text-xl">
                {pass.ticketId}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <BadgeCheck aria-hidden="true" className="size-4" />
                Character exclusively reserved for you
              </p>
            </div>
            <div className="rounded-xl bg-white/[0.06] p-2.5 ring-1 ring-inset ring-white/10">
              <Barcode value={pass.ticketId} className="h-12 w-36 text-gold-300 sm:w-40" />
            </div>
          </div>
        </article>
      </div>

      <div className="animate-fade-up mt-6 grid gap-3 [animation-delay:250ms] sm:grid-cols-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={saving}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-gold-300 to-gold-500 px-4 text-sm font-bold text-ink-950 shadow-[0_10px_30px_-10px_rgb(255_194_74/0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgb(255_194_74/0.85)] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-80"
        >
          {saving ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Download aria-hidden="true" className="size-4" />
          )}
          {saving ? "Preparing image…" : "Download pass (PNG)"}
        </button>
        <button
          type="button"
          onClick={onRegisterAnother}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/[0.06] px-4 text-sm font-semibold text-white ring-1 ring-inset ring-peacock-400/40 transition hover:bg-peacock-400/10 hover:ring-peacock-400/70"
        >
          <UserPlus aria-hidden="true" className="size-4" />
          Register another guest
        </button>
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto mt-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-lilac-300 transition hover:text-white"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to search results
        </button>
      )}
    </div>
  );
}
