import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"section">;

export function Card({ className, ...props }: CardProps) {
  return <section className={cn("glass-card p-5 sm:p-7", className)} {...props} />;
}

export function CardHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rani-500/15 text-rani-300 ring-1 ring-inset ring-rani-400/25">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-balance text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-lilac-300">{description}</p>
      </div>
    </div>
  );
}
