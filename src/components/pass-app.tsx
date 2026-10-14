"use client";

import { useState } from "react";
import { usePassStore } from "@/lib/pass-store";
import { EMPTY_DRAFT, type Pass, type PassDraft } from "@/lib/passes";
import { RegistrationCard } from "./registration-card";
import { Toast, useToast } from "./toast";
import { VipPass } from "./vip-pass";

/** Registration, then the guest's pass. */
export function PassApp() {
  const { passes } = usePassStore();
  const { toast, notify } = useToast();

  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  // Kept here so a half-filled form survives while the pass is open.
  const [draft, setDraft] = useState<PassDraft>(EMPTY_DRAFT);
  const [focusForm, setFocusForm] = useState(false);

  const openPass = openTicketId ? passes.find((pass) => pass.ticketId === openTicketId) : undefined;

  function handleClaimed(pass: Pass) {
    setDraft(EMPTY_DRAFT);
    setOpenTicketId(pass.ticketId);
    notify(`${pass.character} is locked in. Your pass is ready!`);
  }

  function registerAnother() {
    setDraft(EMPTY_DRAFT);
    setOpenTicketId(null);
    setFocusForm(true);
  }

  return (
    <section aria-label="Party pass" className="mx-auto mt-12 max-w-2xl sm:mt-16">
      {openPass ? (
        <VipPass key={openPass.ticketId} pass={openPass} onRegisterAnother={registerAnother} notify={notify} />
      ) : (
        <RegistrationCard
          passes={passes}
          draft={draft}
          onDraftChange={setDraft}
          onClaimed={handleClaimed}
          autoFocus={focusForm}
        />
      )}

      <Toast toast={toast} />
    </section>
  );
}
