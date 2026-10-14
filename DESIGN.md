---
name: Bollywood Night
description: A glamorous, playful night-sky party page where gold foil, rani pink and peacock teal glow against deep plum.
colors:
  ink-950: "#07030f"
  ink-900: "#0d0719"
  ink-800: "#150b27"
  ink-700: "#1f1137"
  ink-600: "#2b1849"
  lilac-50: "#fbf7ff"
  lilac-100: "#f2eaff"
  lilac-300: "#c9b3f1"
  lilac-400: "#a690d1"
  lilac-500: "#7f6ba8"
  rani-300: "#ff8fca"
  rani-400: "#ff5cae"
  rani-500: "#ff2d95"
  rani-600: "#e1137a"
  violet-600: "#7c3aed"
  gold-200: "#ffe7a8"
  gold-300: "#ffd577"
  gold-400: "#ffc24a"
  gold-500: "#f2a524"
  peacock-300: "#6ff7e3"
  peacock-400: "#2ee9d0"
  success-emerald: "oklch(84.5% 0.143 165)"
  danger-rose: "oklch(81% 0.117 11.6)"
typography:
  display:
    fontFamily: "Rozha One, Georgia, serif"
    fontSize: "clamp(3.6rem, 15vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  script:
    fontFamily: "Yellowtail, cursive"
    fontSize: "clamp(3rem, 12vw, 6.75rem)"
    fontWeight: 400
    lineHeight: 1
  headline:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  ticket-id:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 700
    letterSpacing: "0.05em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "28px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "28px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.rani-500}"
    textColor: "#ffffff"
    typography: "{typography.headline}"
    rounded: "{rounded.md}"
    height: "56px"
  button-gold:
    backgroundColor: "{colors.gold-300}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.md}"
    height: "48px"
  input:
    backgroundColor: "{colors.ink-950}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 16px"
  search-input:
    backgroundColor: "{colors.ink-950}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    height: "44px"
  chip-idea:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.gold-200}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip-idea-selected:
    backgroundColor: "{colors.gold-300}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.pill}"
  tab-active:
    backgroundColor: "{colors.rani-500}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "44px"
  glass-card:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.lilac-50}"
    rounded: "{rounded.lg}"
    padding: "28px"
---

# Design System: Bollywood Night

## Overview

**Creative North Star: "The Midnight Premiere"**

A film premiere after dark: the stage is a deep plum night sky, dotted with sparkles, with a disco ball catching the light in each top corner. The event name is struck in gold foil like a title card, the word "Night" glows as a neon sign, and the guest's pass is the golden ticket that closes the story. The page should feel as though the party has already started.

The mood is glamorous, playful and celebratory. It is generous rather than precise: large rounded controls, flat saturated color, soft glows, and sparkle. Everything on screen is in service of one feeling, which is being invited to be the main character. The one confirmed visual rejection is the generic SaaS or corporate-event look: no flat white form page, no plain ticketing-platform chrome.

**Key Characteristics:**
- Dark plum night sky lit by colored light, never a flat black or white field.
- Gold foil display lettering with a script neon accent; sans-serif everywhere else.
- Glass cards, flat rani-pink buttons, and pill-shaped chips and tabs.
- Depth from glow and blur; one hard drop shadow, reserved for the ticket.
- The ticket is the loudest object on the page by design.

## Colors

A night-sky plum base with three jewel accents: rani pink for action, gold for celebration and value, peacock teal for live status and "good to go".

### Primary
- **Rani Pink** (#ff2d95): the action color. Primary submit button gradient start, active tab, the "Main character energy" ribbon, and the pink spotlight. Lighter steps (#ff8fca, #ff5cae) tint icons and secondary glows; #e1137a is the deep end.
- **Royal Violet** (#7c3aed): a minor tint, used only for the clapperboard prop and one avatar tone.

### Secondary
- **Gold Foil** (#ffd577, with #ffe7a8 highlight and #f2a524 shadow): celebration and value. Display lettering, the VIP badge, selected chips, the download button, ticket borders, and focus rings.

### Tertiary
- **Peacock Teal** (#2ee9d0, with #6ff7e3 for text): liveness and approval. The "live uniqueness check" cue, claimed character names, the active-tab count badge, and the teal spotlight.

### Neutral
- **Night Stage** (#07030f to #2b1849): the ink scale. #07030f is the page and input background; #0d0719 and #150b27 are card and chip surfaces; #1f1137 and #2b1849 appear mainly in gradients.
- **Lilac Text** (#fbf7ff, #f2eaff, #c9b3f1, #a690d1, #7f6ba8): primary through placeholder text, stepping down in emphasis. #c9b3f1 is the standard secondary copy; #7f6ba8 is placeholders only.
- **Status:** success uses emerald (oklch(84.5% 0.143 165)) and error uses rose (oklch(81% 0.117 11.6)), both as tinted backgrounds with text of the same hue. Status colors are never used decoratively.

### Named Rules
**The Foil Rule.** Gold foil gradient text is reserved for the event title and the ticket's title and "VIP" mark. If everything is gold, nothing is.

**The One Neon Rule.** Only one word on the page, "Night", carries the multi-layer neon glow. Every other glow is a soft colored shadow.

**The Meaning Rule.** Pink acts, gold celebrates, teal confirms, rose rejects. A color never changes its job between screens.

## Typography

**Display Font:** Rozha One (with Georgia, serif)
**Body Font:** DM Sans (with ui-sans-serif, system-ui)
**Script Font:** Yellowtail (with cursive)
**Mono Font:** JetBrains Mono (ticket IDs and codes)

**Character:** A high-contrast Devanagari-friendly display serif gives the poster its film-title drama; a script adds a hand-painted neon-sign flourish; DM Sans keeps every form, list, and label friendly and legible on a phone.

### Hierarchy
- **Display** (Rozha One 400, clamp(3.6rem, 15vw, 8.5rem), line-height 1): the event name in gold foil. The ticket's version is clamp-limited to about 2.6 to 3.25rem.
- **Script** (Yellowtail 400, clamp(3rem, 12vw, 6.75rem)): the word "Night" in neon, rotated -8 degrees and tucked under the display word. Also the tagline at 1.75 to 2.25rem in gold.
- **Headline** (DM Sans 600, 1.125 to 1.25rem, tight tracking): card titles.
- **Body** (DM Sans 400, 0.875rem, line-height 1.625): descriptions and helper copy. Inputs are 16px on mobile to prevent iOS zoom.
- **Label** (DM Sans 700, 0.625 to 0.75rem, tracking 0.14em to 0.4em, uppercase): section hints, ticket field names, the "Vaswani Social presents" eyebrow.
- **Ticket ID** (JetBrains Mono 700, 1.25rem, tracking 0.05em): ticket IDs and codes only.

### Named Rules
**The Two Display Voices Rule.** Serif display and script each appear once in the hero and once on the ticket. Everything functional is DM Sans.

## Layout

A single centered column of up to 72rem (max-w-6xl) with 16px side gutters on phones and 24px from the small breakpoint up. The hero is a centered poster stack; below it a pill tab bar (max 36rem) sits above a single centered panel (max-w-2xl, 42rem) holding the form, the pass, or the lookup results. On phones tab labels shorten ("Get your pass", "Find my pass").

Cards use 20px padding on phones and 28px from the small breakpoint. Vertical rhythm is generous: form fields are 20px apart, the hero sections 20px to 36px apart. The page is phone first: every control is at least 44px tall, and the primary action is 56px.

A fixed flat night-sky backdrop sits behind everything: sparkle stars, disco balls, and (above 1280px only) floating film props. It never intercepts pointer events.

## Elevation & Depth

Depth comes from light, not shadow. Cards are frosted glass (blur 20px, saturate 150%) over a lit backdrop, with a 1px inner top highlight and a gold hairline across the top edge. The only heavy drop shadow in the system belongs to the ticket.

### Shadow Vocabulary
- **Card shadow** (`0 40px 80px -32px rgb(0 0 0 / 0.85)` plus `inset 0 1px 0 rgb(255 255 255 / 0.07)`): glass cards sit on the stage.
- **Action glow** (`0 14px 40px -12px rgb(255 45 149 / 0.75)`): the primary button's pink glow, intensifying on hover.
- **Gold glow** (`0 10px 30px -10px rgb(255 194 74 / 0.7)`): the download button.
- **Ticket lift** (`drop-shadow(0 28px 36px rgb(0 0 0 / 0.55))` plus `drop-shadow(0 0 22px rgb(255 194 74 / 0.16))`): the pass only.
- **Focus** (4px ring at 10% of the field's color): inputs glow in their own state color.

### Named Rules
**The Light-Not-Shadow Rule.** Elevation is a colored glow or blur. Hard drop shadows are only for the ticket, so it reads as the one physical object in a world of light.

## Shapes

Soft, generous, and rounded, with one deliberate exception. Cards are 28px, inputs and primary buttons 16px, search fields 12px, and every chip, tab, badge, and count is a full pill. The ticket keeps 28px outer corners and is cut with two semicircular notches (15px radius) where the stub tears off, joined by a dashed gold line.

Borders are hairlines (1px at 8% to 10% white) except on the ticket, which has a 1px gold border at 45% opacity, and on state-tinted inputs and alerts.

## Components

### Buttons
- **Shape:** 16px radius, 56px tall for the primary submit and 48px for secondary actions.
- **Primary:** flat rani pink with white text and a pink glow. On hover it lifts 2px, lightens to rani-400, the glow deepens, and a diagonal sheen sweeps across.
- **Gold:** gold-300 to gold-500 gradient with dark ink text for the download action. Same lift on hover.
- **Secondary:** translucent white fill with a 1px teal ring that strengthens on hover.
- **Disabled/Busy:** the label changes ("Preparing image...") and a spinner replaces the icon; it does not dim to unreadable.

### Chips
- **Idea chip:** a pill with translucent white fill, gold-100 text and a gold ring at 25%. Hover lifts 1px and brightens the ring.
- **Selected:** solid gold-300 with ink text and a gold glow.
- **Taken:** rose-tinted, struck through, with a lock icon and `aria-disabled`; it cannot be selected.

### Cards / Containers
- **Corner style:** 28px.
- **Background:** flat plum at 74% opacity with backdrop blur.
- **Border:** 1px white at 8%, with a gold hairline across the top edge.
- **Internal padding:** 20px on phones, 28px above the small breakpoint.

### Inputs / Fields
- **Style:** 48px tall, 16px radius, near-black fill at 55% with a 1px white 10% border; placeholders in muted lilac.
- **Focus:** the border becomes gold at 60% with a 4px soft gold ring.
- **Success / Error:** the border and ring take emerald or rose; an error also tints the fill. Live status appears below the field as a tinted message with an icon, and a taken character shakes once.
- **Labels:** semibold 13px above the field with a pink asterisk, and a small uppercase hint on the right that sets the field's accent color.

### Navigation
A pill tab bar on a dark translucent track with a hairline ring. The active tab is flat rani pink with a pink glow; inactive tabs are lilac text with a faint hover fill. The second tab carries a live count badge. Arrow keys move between tabs.

### The VIP Pass (signature component)
A two-part ticket: a flat plum body with a flat rani-pink header band carrying the presenter and a gold "Main character VIP" badge, over a darker stub with the ticket ID in mono, a deterministic gold barcode derived from the ID, and a green "Character exclusively reserved" confirmation. It enters with a pop-in and a single sheen sweep. The same design is redrawn on canvas at 2x for the downloadable PNG, using the same fonts.

### Lists
Lookup rows are rounded 16px tiles with a monogram avatar in one of four tinted gradients, a teal character name, a gold movie line, and a muted lilac meta line.

## Do's and Don'ts

### Do:
- **Do** keep the page phone first: controls at least 44px tall, 16px input text, one column, thumb-reachable primary action.
- **Do** reserve gold foil for the event title and the ticket, and give "Night" the only neon glow.
- **Do** let color carry meaning: pink acts, gold celebrates, teal confirms, rose rejects.
- **Do** make the ticket the loudest object on the page, with the only hard drop shadow.
- **Do** build depth from colored light and blur, and keep cards glass over the lit backdrop.
- **Do** keep copy warm and filmy, but state errors plainly with who claimed the character and what to do next.
- **Do** respect reduced motion: every animation collapses to an instant state.

### Don't:
- **Don't** add pink or purple gradients; color fills are flat, and gold foil lettering is the only gradient text.
- **Don't** drift toward a generic SaaS or corporate-event look: no flat white surfaces, plain form chrome, or default ticketing-platform styling.
- **Don't** stack decorative effects on functional content; sparkles, props, and spotlights stay behind the cards and never intercept pointer events.
- **Don't** use gold text, neon glow, or the display serif for ordinary UI copy.
- **Don't** claim anything the demo cannot keep, such as a shared live roster across devices or real ticketing.
- **Don't** use hard drop shadows on cards, buttons, or chips.
- **Don't** change a status color's meaning; rose is never decorative and emerald is never an accent.
