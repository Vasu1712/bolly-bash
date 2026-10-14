"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const AUTOPLAY_DELAY_MS = 1000;
// Any of these can count as the user gesture that browsers require for sound.
const ACTIVATION_EVENTS = ["pointerdown", "pointerup", "touchend", "keydown"] as const;

/**
 * Plays the party song one second after load. Browsers usually block sound
 * that starts without a gesture, so if that first attempt is refused it starts
 * on the visitor's first click, tap or key press instead. A button stays in the
 * corner so the music can always be paused.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  // Once someone pauses on purpose, nothing restarts it behind their back.
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.8;

    let finished = false;

    function detach() {
      ACTIVATION_EVENTS.forEach((type) => window.removeEventListener(type, onActivate, true));
    }

    async function start() {
      if (finished || pausedByUser.current || !audio) return;
      try {
        await audio.play();
        finished = true;
        window.clearTimeout(timer);
        detach();
      } catch {
        // Blocked until the visitor interacts; the listeners below try again.
      }
    }

    function onActivate(event: Event) {
      // The music button handles its own click.
      if (event.target instanceof Element && event.target.closest("[data-music-toggle]")) return;
      void start();
    }

    const timer = window.setTimeout(start, AUTOPLAY_DELAY_MS);
    ACTIVATION_EVENTS.forEach((type) => window.addEventListener(type, onActivate, true));

    return () => {
      finished = true;
      window.clearTimeout(timer);
      detach();
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      pausedByUser.current = false;
      try {
        await audio.play();
      } catch {
        // The file could not be played; leave the button in its paused state.
      }
    } else {
      pausedByUser.current = true;
      audio.pause();
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/song.mp3"
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        data-music-toggle
        onClick={toggle}
        aria-label="Music"
        aria-pressed={playing}
        title={playing ? "Mute the music" : "Play the music"}
        className={cn(
          "fixed right-3 top-3 z-40 grid size-11 place-items-center rounded-full bg-ink-800/85 ring-1 ring-inset ring-white/10 backdrop-blur-md transition duration-200 hover:bg-ink-700 sm:right-5 sm:top-5",
          playing ? "text-gold-300" : "text-lilac-300 hover:text-white",
        )}
      >
        {playing ? (
          <Volume2 aria-hidden="true" className="size-5" />
        ) : (
          <VolumeX aria-hidden="true" className="size-5" />
        )}
      </button>
    </>
  );
}
