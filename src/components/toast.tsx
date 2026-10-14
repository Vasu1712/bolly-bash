"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ToastTone = "success" | "error";
export type Notify = (message: string, tone?: ToastTone) => void;

type ToastMessage = { id: number; message: string; tone: ToastTone };

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const lastId = useRef(0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = useCallback<Notify>((message, tone = "success") => {
    lastId.current += 1;
    setToast({ id: lastId.current, message, tone });
  }, []);

  return { toast, notify };
}

export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          className="animate-toast flex max-w-md items-center gap-2.5 rounded-full border border-white/10 bg-ink-800/90 py-2.5 pl-3.5 pr-5 text-sm font-medium text-white shadow-[0_20px_50px_-12px_rgb(0_0_0/0.85)] backdrop-blur-xl"
        >
          {toast.tone === "error" ? (
            <CircleX aria-hidden="true" className="size-[18px] shrink-0 text-rose-300" />
          ) : (
            <CircleCheck aria-hidden="true" className="size-[18px] shrink-0 text-emerald-300" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
