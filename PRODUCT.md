# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Invited guests of a one-night costume party, opening a shared link on their phones (typically from a group chat). Their job: pick a Bollywood character nobody else has claimed, enter their name and the film, and get a personal entry pass they can download or screenshot.

## Product Purpose

A registration page and entry pass for "Bollywood Night", presented by Vaswani Social, on Friday 16th October from 8 PM. Guests dress as a Bollywood character; the page makes sure no two guests pick the same one and hands each guest a VIP pass with a ticket ID. Success is every guest holding a unique character and a pass before the night.

## Positioning

The one-character rule is the mechanism: each Bollywood character can be claimed by exactly one guest, enforced live while typing (including aliases such as "Poo" and "Pooja"), so every guest is one-of-a-kind.

## Operating Context

Guests arrive via a link shared informally, usually on a phone, and complete the form once. The event is a single dated party (Friday, 16th October, 8 PM onwards) with drinks, food, games, pictures and music. There is no host view and no lookup: a guest who loses their pass cannot retrieve it from the page.

## Capabilities and Constraints

- Claim a character with guest name, character name and movie; live availability check; quick-pick suggestions of popular characters that show as taken once claimed.
- Alias-aware uniqueness: normalised comparison plus a known-alias map for the preset characters.
- Generated VIP pass with ticket ID (format VS-16OCT-XX0000), downloadable as a PNG.
- The 'Find my ticket pass' lookup tab was deliberately removed by the owner; the page is a single registration-then-pass flow.
- The public 'Taken characters' roster, CSV export and demo reset were deliberately removed by the owner; guests learn a character is taken from the live check, the struck-through chips and the rejection alert.
- Passes live in a shared Turso (libSQL) database, so the one-character rule holds across every guest's device. The `passes` table has a UNIQUE `character_key` (the normalised character, aliases folded), so the database rejects a second claim even when two guests submit at the same instant. The client refreshes the list every 8 seconds and on tab focus; the server decides every claim. Config: `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`; in development without them it uses a local `local.db` file.
- Event details (name, date, time, perks) are fixed copy in `src/lib/event.ts`.
- Next.js 16 App Router, TypeScript, Tailwind v4, lucide-react icons.

## Brand Commitments

Presenter name "Vaswani Social"; event name "Bollywood Night"; tagline "Bring the drama & filmy vibes!"; slogans "Dress like your favorite Bollywood character!" and "Main character energy only!". The party-poster feel of the original HTML page is the incumbent identity.

## Evidence on Hand

The original single-file page `bollywood_night_party_pass.html` is the source of truth for features and copy. No real guest data, testimonials, photos or logos exist; do not fabricate any.

## Product Principles

- The uniqueness rule is the product; every surface should make it obvious and feel fair.
- Phone first: a guest should finish claiming a character in under a minute with one thumb.
- The pass is the payoff: it should be good enough to screenshot and share.
- Copy stays warm and filmy, but errors and states must be clear.
- Never imply guarantees the product cannot keep (real ticketing, identity checks; guests are not authenticated).

## Accessibility & Inclusion

No product-specific standard was established. Baseline: usable on small phones, keyboard operable, readable contrast on the dark theme, respects reduced-motion.
