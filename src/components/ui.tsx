import { Search, type LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"section"> & { as?: "section" | "aside" };

export function Card({ as: Tag = "section", className, ...props }: CardProps) {
  return <Tag className={cn("glass-card p-5 sm:p-7", className)} {...props} />;
}

const HEADER_TONES = {
  rani: "bg-rani-500/15 text-rani-300 ring-rani-400/25",
  gold: "bg-gold-400/10 text-gold-300 ring-gold-300/25",
  peacock: "bg-peacock-400/10 text-peacock-300 ring-peacock-400/25",
};

export function CardHeader({
  icon: Icon,
  title,
  description,
  aside,
  tone = "rani",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  aside?: ReactNode;
  tone?: keyof typeof HEADER_TONES;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl ring-1 ring-inset", HEADER_TONES[tone])}>
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <h2 className="text-balance text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h2>
          {aside}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-lilac-300">{description}</p>
      </div>
    </div>
  );
}

export function SearchField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-lilac-400" />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full rounded-xl border border-white/10 bg-ink-950/50 pl-11 pr-4 text-base text-white sm:text-sm outline-none transition placeholder:text-lilac-400/80 hover:border-white/20 focus:border-peacock-400/60 focus:ring-4 focus:ring-peacock-400/10"
      />
    </div>
  );
}

export function EmptyState({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/[0.12] px-6 py-10 text-center text-sm leading-relaxed text-lilac-300">
      {Icon && <Icon aria-hidden="true" className="size-6 text-gold-300/80" />}
      <div>{children}</div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2">
      {[0, 1, 2].map((row) => (
        <div key={row} className="h-[4.25rem] animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}

const AVATAR_TONES = [
  "bg-rani-500/20 text-rani-200",
  "bg-gold-400/15 text-gold-200",
  "bg-peacock-400/15 text-peacock-200",
  "bg-violet-500/25 text-lilac-100",
];

/** Monogram tile for a character, e.g. "Geet Dhillon" -> "GD". */
export function CharacterAvatar({ name }: { name: string }) {
  const words = name.replace(/\(.*?\)/g, " ").trim().split(/\s+/).filter(Boolean);
  const letters =
    words.length > 1 ? words.slice(0, 2).map((word) => Array.from(word)[0]) : Array.from(words[0] ?? "?").slice(0, 2);
  let hash = 0;
  for (const char of name) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl pt-1 font-display text-lg ring-1 ring-inset ring-white/10",
        AVATAR_TONES[hash % AVATAR_TONES.length],
      )}
    >
      {letters.join("").toUpperCase()}
    </span>
  );
}
