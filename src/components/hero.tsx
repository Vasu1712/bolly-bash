import {
  CalendarDays,
  Camera,
  Clock,
  Gamepad2,
  Martini,
  Music2,
  Sparkles,
  Star,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { EVENT, type Perk } from "@/lib/event";

const PERK_ICONS: Record<Perk, LucideIcon> = {
  Drinks: Martini,
  Food: UtensilsCrossed,
  Games: Gamepad2,
  Pictures: Camera,
  Music: Music2,
};

/** The party poster. */
export function Hero() {
  return (
    <header className="pt-14 text-center sm:pt-20">
      <p className="animate-fade-up flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold-200 sm:text-xs sm:tracking-[0.4em]">
        <span aria-hidden="true" className="h-px w-8 bg-linear-to-r from-transparent to-gold-300/80 sm:w-16" />
        <span>
          {EVENT.presenter} <span className="text-lilac-400">presents</span>
        </span>
        <span aria-hidden="true" className="h-px w-8 bg-linear-to-l from-transparent to-gold-300/80 sm:w-16" />
      </p>

      <h1 className="animate-fade-up mt-5 flex flex-col items-center leading-none [animation-delay:80ms]">
        <span className="text-foil glow-gold font-display text-[clamp(3.6rem,15vw,8.5rem)] tracking-[-0.01em]">
          Bollywood
        </span>
        <span className="text-neon animate-flicker -mt-[0.32em] ml-[34%] -rotate-[8deg] font-script text-[clamp(3rem,12vw,6.75rem)]">
          Night
        </span>
      </h1>

      <div className="animate-fade-up [animation-delay:160ms]">
        <p className="mx-auto mt-7 max-w-xl text-balance text-lg font-medium text-lilac-100 sm:text-xl">
          {EVENT.dressCode}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-rani-500 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_30px_-6px_rgb(255_45_149/0.7)]">
          <Star aria-hidden="true" className="size-3 fill-current" />
          {EVENT.energy}
          <Star aria-hidden="true" className="size-3 fill-current" />
        </p>
      </div>

      <div className="animate-fade-up mt-9 flex justify-center [animation-delay:240ms]">
        <p className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-peacock-400/30 bg-ink-900/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_40px_-10px_rgb(46_233_208/0.45)] backdrop-blur sm:px-6 sm:text-base">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4 text-peacock-300" />
            <span>
              {EVENT.weekday}, {EVENT.day}
              <sup className="text-[0.62em]">{EVENT.daySuffix}</sup> {EVENT.month}
            </span>
          </span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="inline-flex items-center gap-2">
            <Clock aria-hidden="true" className="size-4 text-peacock-300" />
            {EVENT.time}
          </span>
        </p>
      </div>

      <ul className="animate-fade-up mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2 [animation-delay:300ms]">
        {EVENT.perks.map((perk) => {
          const Icon = PERK_ICONS[perk];
          return (
            <li
              key={perk}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-1.5 text-sm font-medium text-lilac-100 ring-1 ring-white/10"
            >
              <Icon aria-hidden="true" className="size-4 text-rani-300" />
              {perk}
            </li>
          );
        })}
      </ul>

      <p className="animate-fade-up mt-7 inline-flex items-center gap-3 font-script text-[1.75rem] text-gold-300 [animation-delay:360ms] sm:text-4xl">
        <Sparkles aria-hidden="true" className="size-5" />
        {EVENT.tagline}
        <Sparkles aria-hidden="true" className="size-5" />
      </p>
    </header>
  );
}
