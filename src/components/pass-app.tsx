"use client";

import { useState } from "react";
import { useHydrated, usePasses } from "@/lib/pass-store";
import { EMPTY_DRAFT, type Pass, type PassDraft } from "@/lib/passes";
import { LookupCard } from "./lookup-card";
import { ModeTabs, PANEL_ID, type Tab } from "./mode-tabs";
import { RegistrationCard } from "./registration-card";
import { Toast, useToast } from "./toast";
import { VipPass } from "./vip-pass";

/** Registration, pass display and lookup. */
export function PassApp() {
  const passes = usePasses();
  const ready = useHydrated();
  const { toast, notify } = useToast();

  const [tab, setTab] = useState<Tab>("register");
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  // Kept here so a half-filled form survives switching tabs.
  const [draft, setDraft] = useState<PassDraft>(EMPTY_DRAFT);
  const [lookupQuery, setLookupQuery] = useState("");
  const [focusForm, setFocusForm] = useState(false);

  // Derived from the live list, so a pass removed in another tab closes here too.
  const openPass = openTicketId ? passes.find((pass) => pass.ticketId === openTicketId) : undefined;

  function switchTab(next: Tab) {
    setTab(next);
    setOpenTicketId(null);
    setFocusForm(false);
  }

  function handleClaimed(pass: Pass) {
    setDraft(EMPTY_DRAFT);
    setOpenTicketId(pass.ticketId);
    notify(`${pass.character} is locked in. Your pass is ready!`);
  }

  function registerAnother() {
    setDraft(EMPTY_DRAFT);
    setTab("register");
    setOpenTicketId(null);
    setFocusForm(true);
  }

  return (
    <section aria-label="Party passes" className="mt-12 sm:mt-16">
      <ModeTabs active={tab} count={ready ? passes.length : null} onChange={switchTab} />

      <div className="mx-auto mt-8 max-w-2xl">
        <div role="tabpanel" id={PANEL_ID} aria-labelledby={`tab-${tab}`} className="min-w-0">
          {openPass ? (
            <VipPass
              key={openPass.ticketId}
              pass={openPass}
              onRegisterAnother={registerAnother}
              onBack={tab === "lookup" ? () => setOpenTicketId(null) : undefined}
              notify={notify}
            />
          ) : tab === "register" ? (
            <RegistrationCard
              passes={passes}
              draft={draft}
              onDraftChange={setDraft}
              onClaimed={handleClaimed}
              autoFocus={focusForm}
            />
          ) : (
            <LookupCard
              passes={passes}
              ready={ready}
              query={lookupQuery}
              onQueryChange={setLookupQuery}
              onView={setOpenTicketId}
            />
          )}
        </div>
      </div>

      <Toast toast={toast} />
    </section>
  );
}
