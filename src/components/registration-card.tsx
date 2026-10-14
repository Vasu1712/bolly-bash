"use client";

import { Ban, CircleCheck, CircleX, Clapperboard, LoaderCircle, Lock, Sparkles, Ticket, WifiOff, Zap } from "lucide-react";
import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { characterKey, findClaim, indexClaims, POPULAR_CHARACTERS, type CharacterPreset } from "@/lib/characters";
import { cn } from "@/lib/cn";
import { claimCharacter } from "@/lib/pass-store";
import { FIELD_LIMITS, type Pass, type PassDraft } from "@/lib/passes";
import { Card, CardHeader } from "./ui";

type Field = keyof PassDraft;
type FieldErrors = Partial<Record<Field, string>>;

const FEATURED_IDEAS = 10;

const REQUIRED_MESSAGES: Record<Field, string> = {
  guestName: "Add your name so the host can find you on the guest list.",
  character: "Which Bollywood character are you dressing up as?",
  movie: "Add the movie your character is from.",
};

export function RegistrationCard({
  passes,
  draft,
  onDraftChange,
  onClaimed,
  autoFocus,
}: {
  passes: readonly Pass[];
  draft: PassDraft;
  onDraftChange: (draft: PassDraft) => void;
  onClaimed: (pass: Pass) => void;
  autoFocus: boolean;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  // Counts rejected submits; it also re-keys the alert so the shake replays.
  const [rejections, setRejections] = useState(0);
  const [showAllIdeas, setShowAllIdeas] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const guestNameRef = useRef<HTMLInputElement>(null);
  const characterRef = useRef<HTMLInputElement>(null);
  const movieRef = useRef<HTMLInputElement>(null);

  const claims = useMemo(() => indexClaims(passes), [passes]);
  const character = draft.character.trim();
  const claim = findClaim(claims, character);
  const status = !character ? "idle" : claim ? "taken" : "available";
  const selectedKey = characterKey(character);
  const ideas = showAllIdeas ? POPULAR_CHARACTERS : POPULAR_CHARACTERS.slice(0, FEATURED_IDEAS);

  function update(field: Field, value: string) {
    onDraftChange({ ...draft, [field]: value });
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === "character" && !findClaim(claims, value)) setRejections(0);
  }

  function pickIdea(preset: CharacterPreset) {
    onDraftChange({ ...draft, character: preset.name, movie: preset.movie });
    setErrors((current) => ({ ...current, character: undefined, movie: undefined }));
    setRejections(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const values: PassDraft = {
      guestName: draft.guestName.trim(),
      character: draft.character.trim(),
      movie: draft.movie.trim(),
    };

    const missing = (Object.keys(values) as Field[]).filter((field) => !values[field]);
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map((field) => [field, REQUIRED_MESSAGES[field]])));
      ({ guestName: guestNameRef, character: characterRef, movie: movieRef })[missing[0]].current?.focus();
      return;
    }

    if (!characterKey(values.character)) {
      setErrors({ character: "Use letters or numbers in the character name." });
      characterRef.current?.focus();
      return;
    }

    // The shared database enforces the one-character rule, even against a
    // guest on another device claiming it at the same moment.
    setSubmitting(true);
    setConnectionError(false);
    const result = await claimCharacter(values);
    setSubmitting(false);

    if (result.ok) {
      setErrors({});
      setRejections(0);
      onClaimed(result.pass);
    } else if (result.reason === "taken") {
      setRejections((count) => count + 1);
      characterRef.current?.focus();
    } else if (result.reason === "invalid") {
      setErrors({ character: "Check your details and try again." });
    } else {
      setConnectionError(true);
    }
  }

  return (
    <Card>
      <CardHeader
        icon={Clapperboard}
        title="Lock your character & entry pass"
        description="Claim your iconic Bollywood persona below to generate your official VIP party pass."
      />

      <div className="mt-6 flex gap-3 rounded-2xl border border-peacock-400/20 bg-peacock-400/[0.06] p-4 text-sm leading-relaxed text-peacock-200/90">
        <Zap aria-hidden="true" className="mt-0.5 size-4 shrink-0 fill-gold-300/30 text-gold-300" />
        <p>
          <strong className="font-semibold text-gold-200">Exclusive one-character rule:</strong> No two guests can
          claim the same Bollywood character. Once locked, that character is off the market!
        </p>
      </div>

      {connectionError && (
        <div
          role="alert"
          className="mt-5 flex gap-3 rounded-2xl border border-rose-400/45 bg-rose-500/10 p-4 text-sm leading-relaxed text-rose-100/90"
        >
          <WifiOff aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-rose-300" />
          <p>
            <strong className="text-white">We couldn’t reach the guest list.</strong> Check your connection and tap
            the button again. Your character isn’t locked yet.
          </p>
        </div>
      )}

      {rejections > 0 && claim && (
        <div
          key={rejections}
          role="alert"
          className="animate-shake mt-5 rounded-2xl border border-rose-400/45 bg-linear-to-br from-rose-500/15 to-rose-900/25 p-4 shadow-[0_0_40px_-12px_rgb(251_113_133/0.6)]"
        >
          <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-gold-200">
            <Ban aria-hidden="true" className="size-4 text-rose-300" />
            Action cut! Character already taken
          </p>
          <p className="mt-2 text-sm leading-relaxed text-rose-100/90">
            Sorry <strong className="text-white">{draft.guestName.trim()}</strong>!{" "}
            <strong className="text-white">“{claim.character}”</strong> from <em>{claim.movie}</em> has already been
            claimed by <strong className="text-white">{claim.guestName}</strong> (ticket{" "}
            <span className="font-mono text-xs">{claim.ticketId}</span>). To keep every guest one-of-a-kind, please
            pick a different character.
          </p>
        </div>
      )}

      <form noValidate autoComplete="off" onSubmit={handleSubmit} className="mt-6 space-y-5">
        <FormField id="guest-name" label="Your full name" hint="Guest list name" hintClassName="text-violet-300" error={errors.guestName}>
          <input
            ref={guestNameRef}
            id="guest-name"
            value={draft.guestName}
            onChange={(event) => update("guestName", event.target.value)}
            placeholder="e.g. Rohan Verma"
            maxLength={FIELD_LIMITS.guestName}
            autoFocus={autoFocus}
            aria-invalid={errors.guestName ? true : undefined}
            aria-describedby={errors.guestName ? "guest-name-error" : undefined}
            className={inputClass(errors.guestName ? "error" : undefined)}
          />
        </FormField>

        <FormField
          id="character-name"
          label="Bollywood character name"
          hint={
            <>
            </>
          }
          hintClassName="text-peacock-300"
          error={errors.character}
          after={
            <>
              <div id="character-status" aria-live="polite">
                {status === "taken" && claim && (
                  <p
                    key={claim.ticketId}
                    className="animate-shake mt-2.5 flex gap-2.5 rounded-xl bg-rose-500/10 px-3.5 py-3 text-[13px] leading-relaxed text-rose-100 ring-1 ring-inset ring-rose-400/35"
                  >
                    <CircleX aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-rose-300" />
                    <span>
                      <strong className="font-semibold text-white">“{claim.character}” is already taken!</strong>{" "}
                      Claimed by {claim.guestName} ({claim.movie}, ticket{" "}
                      <span className="font-mono text-xs">{claim.ticketId}</span>). Please choose another character so
                      no two guests match.
                    </span>
                  </p>
                )}
                {status === "available" && (
                  <p className="animate-fade-up mt-2.5 flex gap-2.5 rounded-xl bg-emerald-400/10 px-3.5 py-3 text-[13px] leading-relaxed text-emerald-100 ring-1 ring-inset ring-emerald-400/30">
                    <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>
                      <strong className="font-semibold text-white">“{character}” is available!</strong> Lock it in now
                      for full main character energy.
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-lilac-400">
                  <Sparkles aria-hidden="true" className="size-3.5 text-gold-300" />
                  Popular filmy ideas · tap to auto-fill
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {ideas.map((preset) => {
                    const takenBy = findClaim(claims, preset.name);
                    const selected = !takenBy && selectedKey !== "" && selectedKey === characterKey(preset.name);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        aria-disabled={takenBy ? true : undefined}
                        title={takenBy ? `Already claimed by ${takenBy.guestName}` : `${preset.name} · ${preset.movie}`}
                        onClick={() => {
                          if (!takenBy) pickIdea(preset);
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition duration-200",
                          takenBy
                            ? "cursor-not-allowed bg-rose-500/[0.07] text-rose-300/70 line-through decoration-rose-300/40 ring-1 ring-inset ring-rose-400/20"
                            : selected
                              ? "bg-gold-300 text-ink-950 shadow-[0_6px_20px_-6px_rgb(255_213_119/0.8)]"
                              : "bg-white/[0.04] text-gold-100 ring-1 ring-inset ring-gold-300/25 hover:-translate-y-0.5 hover:bg-gold-300/10 hover:ring-gold-300/50",
                        )}
                      >
                        {takenBy && <Lock aria-hidden="true" className="size-3" />}
                        {preset.name}
                        {takenBy && <span className="sr-only"> (taken by {takenBy.guestName})</span>}
                      </button>
                    );
                  })}
                  {!showAllIdeas && (
                    <button
                      type="button"
                      onClick={() => setShowAllIdeas(true)}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold text-lilac-300 transition hover:text-white"
                    >
                      +{POPULAR_CHARACTERS.length - FEATURED_IDEAS} more
                    </button>
                  )}
                </div>
              </div>
            </>
          }
        >
          <input
            ref={characterRef}
            id="character-name"
            value={draft.character}
            onChange={(event) => update("character", event.target.value)}
            placeholder="e.g. Poo, Geet, Kabir Rajdheer Singh, Chulbul Pandey…"
            maxLength={FIELD_LIMITS.character}
            spellCheck={false}
            aria-invalid={errors.character || status === "taken" ? true : undefined}
            aria-describedby={cn(errors.character && "character-name-error", "character-status")}
            className={inputClass(
              errors.character || status === "taken" ? "error" : status === "available" ? "success" : undefined,
            )}
          />
        </FormField>

        <FormField id="movie-name" label="Bollywood movie name" hint="Film title" hintClassName="text-gold-300" error={errors.movie}>
          <input
            ref={movieRef}
            id="movie-name"
            value={draft.movie}
            onChange={(event) => update("movie", event.target.value)}
            placeholder="e.g. Kabhi Khushi Kabhie Gham"
            maxLength={FIELD_LIMITS.movie}
            aria-invalid={errors.movie ? true : undefined}
            aria-describedby={errors.movie ? "movie-name-error" : undefined}
            className={inputClass(errors.movie ? "error" : undefined)}
          />
        </FormField>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-rani-500 px-4 text-[15px] font-semibold text-white shadow-[0_14px_40px_-12px_rgb(255_45_149/0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-rani-400 hover:shadow-[0_20px_50px_-12px_rgb(255_45_149/0.9)] active:translate-y-0 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-80"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]"
          />
          {submitting ? (
            <LoaderCircle aria-hidden="true" className="size-5 shrink-0 animate-spin" />
          ) : (
            <Ticket aria-hidden="true" className="size-5 shrink-0" />
          )}
          {submitting ? "Locking your character…" : "Lock character & generate pass"}
        </button>
      </form>
    </Card>
  );
}

function FormField({
  id,
  label,
  hint,
  hintClassName,
  error,
  after,
  children,
}: {
  id: string;
  label: string;
  hint: ReactNode;
  hintClassName: string;
  error?: string;
  /** Rendered below the input and its error, e.g. live status and suggestions. */
  after?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-lilac-100">
          {label} <span aria-hidden="true" className="text-rani-400">*</span>
        </label>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em]",
            hintClassName,
          )}
        >
          {hint}
        </span>
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[13px] text-rose-300">
          {error}
        </p>
      )}
      {after}
    </div>
  );
}

function inputClass(state?: "error" | "success") {
  return cn(
    "h-12 w-full rounded-2xl border bg-ink-950/55 px-4 text-base text-white outline-none transition duration-200 placeholder:text-lilac-400/80 focus:ring-4",
    state === "error"
      ? "border-rose-400/60 bg-rose-950/20 focus:border-rose-400/80 focus:ring-rose-400/15"
      : state === "success"
        ? "border-emerald-400/50 focus:border-emerald-400/70 focus:ring-emerald-400/10"
        : "border-white/10 hover:border-white/20 focus:border-gold-300/60 focus:ring-gold-300/10",
  );
}
