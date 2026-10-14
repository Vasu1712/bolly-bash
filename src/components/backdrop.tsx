import { Camera, Clapperboard, Glasses, Popcorn, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

const SPARKLES = [
  { top: "7%", left: "12%", size: 20, color: "#ffd577", delay: "0s" },
  { top: "15%", left: "27%", size: 12, color: "#ffffff", delay: "1.2s" },
  { top: "5%", left: "42%", size: 14, color: "#ffd577", delay: "2.1s" },
  { top: "12%", left: "62%", size: 16, color: "#ff8fca", delay: "0.6s" },
  { top: "6%", left: "79%", size: 22, color: "#ffd577", delay: "1.8s" },
  { top: "21%", left: "90%", size: 12, color: "#6ff7e3", delay: "2.6s" },
  { top: "37%", left: "5%", size: 16, color: "#ffd577", delay: "3.1s" },
  { top: "45%", left: "94%", size: 14, color: "#ffffff", delay: "0.9s" },
  { top: "63%", left: "3%", size: 12, color: "#ff8fca", delay: "1.5s" },
  { top: "72%", left: "96%", size: 18, color: "#ffd577", delay: "2.4s" },
  { top: "87%", left: "7%", size: 18, color: "#ff5cae", delay: "0.3s" },
  { top: "90%", left: "91%", size: 16, color: "#ffd577", delay: "1.1s" },
];

const PROPS: { Icon: LucideIcon; position: string; color: string; tilt: string; delay: string }[] = [
  { Icon: Clapperboard, position: "left-[4%] top-[20%]", color: "text-violet-400", tilt: "-14deg", delay: "0s" },
  { Icon: Glasses, position: "left-[3.5%] top-[52%]", color: "text-rani-400", tilt: "12deg", delay: "1.6s" },
  { Icon: Camera, position: "right-[4%] top-[32%]", color: "text-peacock-400", tilt: "-10deg", delay: "0.8s" },
  { Icon: Popcorn, position: "right-[4.5%] top-[68%]", color: "text-gold-300", tilt: "10deg", delay: "2.3s" },
];

/** Sparkles, disco balls and floating filmy props on a flat night sky. Purely decorative. */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="stage pointer-events-none fixed inset-0 overflow-hidden">
      {SPARKLES.map((sparkle, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className="animate-twinkle absolute"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            color: sparkle.color,
            animationDelay: sparkle.delay,
            filter: `drop-shadow(0 0 6px ${sparkle.color})`,
          }}
        >
          <path fill="currentColor" d="M12 0C13 7 17 11 24 12 17 13 13 17 12 24 11 17 7 13 0 12 7 11 11 7 12 0Z" />
        </svg>
      ))}

      <div className="disco-ball -left-10 -top-10 [--size:6.5rem] sm:-left-12 sm:-top-12 sm:[--size:8.5rem]" />
      <div className="disco-ball -right-10 -top-10 [--size:6.5rem] [animation-delay:-2.5s] sm:-right-12 sm:-top-12 sm:[--size:8.5rem]" />

      {PROPS.map(({ Icon, position, color, tilt, delay }) => (
        <Icon
          key={position}
          strokeWidth={1.25}
          className={`animate-float absolute hidden size-14 opacity-45 xl:block ${position} ${color}`}
          style={{ "--tilt": tilt, animationDelay: delay, filter: "drop-shadow(0 0 10px currentColor)" } as CSSProperties}
        />
      ))}

      <div className="grain absolute inset-0" />
    </div>
  );
}
