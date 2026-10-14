import { Backdrop } from "@/components/backdrop";
import { Hero } from "@/components/hero";
import { MusicPlayer } from "@/components/music-player";
import { PassApp } from "@/components/pass-app";

export default function Home() {
  return (
    <>
      <Backdrop />
      <MusicPlayer />
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <Hero />
        <PassApp />
      </main>
    </>
  );
}
