# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Invited guests of a one-night costume party, opening a shared link on their phones (typically from a group chat). Their job: pick a Bollywood character nobody else has claimed, enter their name and the film, and get a personal entry pass they can download or screenshot. A host is a secondary user who checks who has claimed what through the lookup tab.

## Product Purpose

A registration page and entry pass for "Bollywood Night", presented by Vaswani Social, on Friday 16th October from 8 PM. Guests dress as a Bollywood character; the page makes sure no two guests pick the same one and hands each guest a VIP pass with a ticket ID. Success is every guest holding a unique character and a pass before the night.

## Positioning

The one-character rule is the mechanism: each Bollywood character can be claimed by exactly one guest, enforced live while typing (including aliases such as "Poo" and "Pooja"), so every guest is one-of-a-kind.

## Operating Context

Guests arrive via a link shared informally, usually on a phone, and complete the form once. The event is a single dated party (Friday, 16th October, 8 PM onwards) with drinks, food, games, pictures and music. There is no host view; the host reads the guest list from the lookup tab.

## Capabilities and Constraints

- Claim a character with guest name, character name and movie; live availability check; quick-pick suggestions of popular characters that show as taken once claimed.
- Alias-aware uniqueness: normalised comparison plus a known-alias map for the preset characters.
- Generated VIP pass with ticket ID (format VS-16OCT-XX0000), downloadable as a PNG.
- Lookup of an existing pass by ticket ID, guest name or character.
- The public 'Taken characters' roster, CSV export and demo reset were deliberately removed by the owner; guests learn a character is taken from the live check, the struck-through chips and the rejection alert.
- Data currently lives in each browser's localStorage (key `vaswani_bollywood_night_passes_v1`) and syncs across tabs on one device only. This is a demo: there is no shared backend, so the one-character rule does not hold across different guests' devices. A shared backend is undecided and out of scope for now.
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
- Never imply guarantees the demo cannot keep (shared roster, real ticketing).

## Accessibility & Inclusion

No product-specific standard was established. Baseline: usable on small phones, keyboard operable, readable contrast on the dark theme, respects reduced-motion.
