// Single source of truth for the party details shown in the hero, on the
// ticket, in the downloadable PNG and in the CSV export.
export const EVENT = {
  presenter: "Vaswani Social",
  name: "Bollywood Night",
  dressCode: "Dress like your favorite Bollywood character!",
  energy: "Main character energy only!",
  tagline: "Bring the drama & filmy vibes!",
  weekday: "Friday",
  day: "16",
  daySuffix: "th",
  month: "October",
  time: "8 PM onwards",
  perks: ["Drinks", "Food", "Games", "Pictures", "Music"],
  ticketPrefix: "VS-16OCT",
} as const;

export type Perk = (typeof EVENT.perks)[number];

export const EVENT_DATE = `${EVENT.weekday}, ${EVENT.day}${EVENT.daySuffix} ${EVENT.month}`;
