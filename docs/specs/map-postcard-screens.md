# Spec: Map + Postcard screens (Onboarding, Explore, Trip, Profile)

Status: ready for Code
Source design: Claude Design canvas, 4 artboards at 390×844 (iPhone-class viewport)
Design artifact: https://claude.ai/artifact/HWKMWVTUogqBsVVg3miTme
Depends on: sidepath-brand tokens (colors, type), existing app shell/router

This spec hands off the four screens from the map + postcard concept so Code can build
them as real app screens. It describes structure, states and interactions, not final
pixel values — treat the design artifact as the visual reference and this doc as the
behavior/data contract.

## Shared tokens (already in sidepath-brand, repeat here for convenience)

```
--bone: #FAF8F4      --cream: #F7F2EA      --sandstone: #E0C9A6
--terracotta: #C0532E --terracotta-dark: #9E411F   (use -dark for any text/button on bone — plain terracotta fails WCAG 4.5:1 for normal text)
--ink (brown): #26201B  --burgundy: #7A2E33  --amber: #E8A23D  --green (trail): #2E6E5B
--night: #15110E
Fonts: Fraunces (serif, headlines + italic for warmth), Inter (sans, body/UI), Space Mono (data: prices, dates, codes, distances)
```

Accessibility baseline for all four screens:
- Every tappable control has a real (not just visual) 44×44px hit target, even when the
  visible glyph is smaller — see the map pin pattern below.
- `aria-label` on icon-only buttons (back, save, nav tabs when unlabeled by visible text).
- Focus states are visible (`:focus-visible` outline in terracotta-dark), not just hover.
- Color is never the only signal for selected/active state — pair it with a shape change
  (checkmark, border style, bold weight).

## Shared component: Bottom nav

Appears on Explore, Trip (implicitly, via back button to Explore) and Profile.

- 4 tabs: Explore, Trips, Saved, Profile. Fixed height 66px, `border-top: 1px solid sandstone`.
- Icon (20×20, stroke 1.8) + 10.5px semibold label, stacked, centered per tab.
- Active tab: icon + label in `terracotta` (#C0532E — fine here, it's not body text).
  Inactive: `ink` at 72% opacity.
- Active tab is derived from the current route, not local-only state — if the user is on
  `/explore`, Explore is active; no separate "selected tab" state to manage once this is
  wired to the real router.

**Acceptance**
- [ ] Nav renders identically (height, icons, spacing) on all 3 screens that show it
- [ ] Active tab always matches the current route
- [ ] Each tab is a real link/route change, not a client-only state toggle (the canvas
      prototype used local state for the demo only — do not carry that into the app)
- [ ] All 4 tabs meet 44px touch target even though the visible icon+label block is shorter

---

## Screen 1: Onboarding — persona picker

Route suggestion: `/onboarding` (or wherever first-run currently lives), step 1 of 3 in
the existing onboarding flow (steps 2–3 are out of scope here — this spec only covers the
persona-picker step shown in the design).

### Structure
- Progress bar: 3 segments, 22×4px pill each, 6px gap. Segment 1 filled terracotta,
  segments 2–3 sandstone (this screen is step 1; later steps fill progressively).
- Eyebrow: "Step 1 of 3" in Space Mono, 11px, uppercase, 72% opacity.
- Headline (Fraunces, 25px, weight 600): "Which traveller are you, *today*?" — the word
  "today" is italic + terracotta. Keep the word "today" italicized; it's doing brand work
  (personas aren't fixed identities, see sidepath-brand "no gatekeeping").
- Subhead: "Pick the stamp that fits. Your passport fills up over time, not all at once."
- 2-column grid of 8 persona "stamp" cards (see data below), scrollable if it overflows
  viewport height.
- Fixed CTA at bottom: "Stamp my passport" — full-width pill button, `terracotta-dark`
  background, advances to onboarding step 2.

### Persona data (8 options, single-select, one pre-selected by default)

| id | label | icon | notes |
|---|---|---|---|
| explorer | The Explorer | compass | **default selected** |
| local | The Local | house | |
| culture-seeker | The Culture Seeker | temple/pillars | |
| social-traveller | The Social Traveller | two people | |
| digital-nomad | The Digital Nomad | laptop | |
| slow-traveller | The Slow Traveller | clock | |
| comfort-seeker | The Comfort Seeker | bed | |
| eco-traveller | The Eco Traveller | leaf/footprint | |

Icons are simple 24×24 line SVGs (stroke 1.6, `ink` color) — see the design artifact for
exact paths; redraw in whatever icon system Code already uses rather than copy-pasting
raw SVG, as long as the visual weight matches (thin line icons, not filled).

### Interaction: the "stamp" selection pattern

This is the one piece of real interaction logic on this screen, and it's worth building
as a reusable pattern since personas may be re-editable from Profile later:

- Each option is a native radio input (`name="persona"`) visually hidden, paired with a
  `<label>` styled as a dashed-border card.
- Unselected: `2px dashed sandstone` border, `cream` background.
- Selected: border becomes **solid** `terracotta` (not just a color swap — the dash→solid
  change is the "stamped" visual metaphor) and a small circular postmark badge
  (checkmark icon, terracotta circle, 28px, slightly rotated -10deg) appears in the
  top-right corner of the card, scaling in from 0.6→1.
- Only one persona selected at a time (radio group semantics — don't reimplement as
  checkboxes or button toggles; screen readers should announce this as a radio group).
- Selection persists to the user's profile on CTA tap (not on selection — selecting is
  free to change until they confirm).

**Acceptance**
- [ ] Radio group is keyboard-navigable (arrow keys move selection, matching native radio behavior)
- [ ] Selected state shows both the solid-border change AND the postmark badge (not color alone — contrast/colorblind requirement)
- [ ] Default selection (Explorer) is pre-checked on first load
- [ ] CTA always enabled (a persona is always selected by default, so there's no empty state to handle)
- [ ] CTA writes the selected persona to the user's profile/preferences before navigating
- [ ] Progress bar step 1 is filled; this is visual only on this screen (no logic needed beyond static state)

---

## Screen 2: Explore — map home

Route: `/explore` (likely the existing map/home route — replace its current content).

### Structure, top to bottom
1. Header: date (Space Mono, small, uppercase, 72% opacity) + headline "Where to,
   *[FirstName]*?" (Fraunces 28px, name italic + terracotta) + search bar (pill, cream
   background, sandstone border, search icon + placeholder "A city, a vibe, a 'why not'").
2. Map panel: fills remaining vertical space, rounded corners (20px), cream background,
   sandstone border.
3. Postcard bottom sheet: fixed-height panel anchored to the bottom of the map area,
   horizontally-scrolling row of postcard cards, "See all" link to Trips.
4. Bottom nav (shared component above), Explore tab active.

### Map panel

This is a **static illustrative route map in the design**, not a real map SDK. For the
real build:
- If the app already has a map provider (Mapbox/Google Maps/etc.), render it with the
  brand's muted contour-line aesthetic as a custom style layer if that's feasible;
  otherwise keep this screen's map as the stylized SVG/illustration layer the design
  shows, with real pins layered on top via lat/lng → screen-space projection.
- Either way, preserve: a dashed terracotta "trail" path connecting the 2–3 destinations
  currently in view, and faint sandstone contour lines in the background for texture.
- A compass rose badge, top-left of the map, decorative only (no interaction).

### Map pins

- Visual: 22px circle, bone fill, 2.5px terracotta border, with a 6px solid terracotta
  dot centered inside.
- **Hit target is 44×44px even though the visual dot is 22px** — wrap the visual pin in a
  larger invisible tap area, centered on the same point. This is a repeat of the general
  accessibility baseline above, called out again because it's easy to miss on a map where
  pins are visually small and close together.
- Label: a small dark pill (ink background, bone text, Space Mono 10px) floats just above
  each pin showing the destination name, always visible (not a hover-only tooltip — this
  is a touch-first app).
- Tap target: `aria-label="View {destination}"`, opens that destination's trip/detail
  view (Trip screen, pre-filtered to that place, or a destination preview — whichever the
  existing app's pin-tap pattern already does; this spec doesn't introduce a new
  destination-detail flow, just the pin itself).

### Postcard bottom sheet

- Horizontally scrollable row of postcard cards, each ~148px wide.
- Each card: photo/gradient header (72–98px tall), a small circular "go" badge
  (dashed border, arrow icon, slightly rotated) overlapping the top-right corner like a
  postage stamp, then destination name (Fraunces italic) + price/duration
  (Space Mono, e.g. "$640 · 5 days").
- Each card alternates a slight rotation (±1–2deg) so the row reads as scattered
  postcards, not a rigid grid — keep this randomness subtle (max ±2deg) and consistent
  per-card (not re-randomized on every render).
- Tapping a card opens that trip's itinerary (Trip screen).
- "See all" link opens the full Trips list.
- Card source data: user's saved/suggested trips, same data model as the Trips tab.

**Acceptance**
- [ ] Search bar is a real input wired to search/filter (even if the first version just
      filters the pin set client-side — don't ship it purely decorative)
- [ ] Map pins meet the 44px hit-target rule independent of visual pin size
- [ ] Destination labels are always visible, not hover/tap-to-reveal
- [ ] Postcard row scrolls horizontally with touch/trackpad, no layout break if there are
      1 card or 10
- [ ] Card rotation is subtle and doesn't rotate on scroll/re-render (no jitter)
- [ ] Tapping a postcard and tapping a map pin both route correctly
- [ ] Bottom nav shows Explore as active

---

## Screen 3: Trip — itinerary as postcard trail

Route: `/trip/[id]` (or existing trip-detail route).

### Structure
1. Header: back button (44px circle, cream/sandstone, arrow-left icon,
   `aria-label="Back to Explore"`) + save button (same style, heart icon,
   `aria-label="Save trip"`) on the same row.
2. Trip title (Fraunces 27px, e.g. "Lisbon") + meta line (Space Mono, "5 days · Nov 14 to
   19 · $640 all in").
3. Scrollable day-by-day itinerary, styled as a vertical trail:
   - Left rail: a day badge (42px circle, dashed terracotta border, "D1"/"D2"/etc. in
     Space Mono bold, `terracotta-dark` text — not plain terracotta, for contrast) with a
     dashed vertical connector line down to the next day's badge.
   - Right: a card per day — photo/gradient header, day title in Fraunces italic (e.g.
     "Alfama wanders"), then a list of stops, each stop a pin-icon + stop name + time
     (Space Mono, right-aligned).
4. If the trip has more days than fit comfortably, a trailing line ("+ N more days on the
   trail") rather than rendering all days unconditionally — see open question below.

### Data model (per day)
```
{
  dayNumber: number,
  title: string,            // e.g. "Alfama wanders" — short, evocative, not generic ("Day 2")
  coverGradient | coverImage: string,
  stops: [
    { name: string, time: string }   // time as display string, e.g. "9:00"
  ]
}
```

**Acceptance**
- [ ] Back button returns to Explore (or wherever the user entered from — don't hardcode
      if the app already has a navigation-history pattern)
- [ ] Save button toggles a real saved/unsaved state tied to the user's account, not just
      local UI state
- [ ] Day badges use `terracotta-dark` for the day-number text (contrast requirement —
      plain terracotta fails on the cream card background)
- [ ] Connector line only renders between days, not after the last day
- [ ] Each stop shows name + time; stops list scrolls with the page (no nested scroll
      areas inside each day card)
- [ ] Long trips (test with 7+ days) either paginate, virtualize, or show the "+N more
      days" collapse — don't ship an itinerary screen that silently renders 20 full-height
      day cards on first paint

**Open question for Code**: the design shows a "+ N more days on the trail" summary line
after day 3, implying collapsed/lazy-loaded days for longer trips. Decide the actual
pattern (load-more button, infinite scroll, or a day-picker strip at the top) based on
what the itinerary data source can support — this spec doesn't mandate the mechanism,
just that a 10+ day trip shouldn't dump everything into the DOM at once.

---

## Screen 4: Profile — passport

Route: `/profile` (existing profile route).

### Structure
1. Header block, full-bleed `night` (#15110E) background, bone text:
   - Avatar circle (58px, terracotta fill, initial letter in Fraunces)
   - Name (Fraunces 20px) + persona + join date (Space Mono, "Independent Explorer ·
     since 2026" — pull persona label from onboarding selection, join year from account
     creation date)
   - Edit button (44px circle, translucent bone, pencil icon, `aria-label="Edit profile"`)
2. "Passport stamps" section: count line ("N places, 0 regrets" — keep "0 regrets" as
   flavor copy, don't make it a real data field) + a wrapped row of stamp circles, one
   per visited country.
   - Each stamp: 58px dashed-border circle, slight rotation (alternating ±2–7deg per
     stamp, same subtlety rule as the postcards), 3-letter country code (Space Mono bold)
     in a color drawn from the brand accent set (terracotta/green/burgundy/amber),
     cycling or assigned per-country — not meaningful by color, purely decorative variety.
   - A trailing empty "+" stamp slot (dashed sandstone, faint plus icon) as an affordance
     for "stamps still to come" — always shown after the real stamps, not a button (it's
     not tappable in the design; treat as decorative unless product wants it to deep-link
     into Explore).
3. "Your trips" section: list of trip rows (upcoming + completed), each a horizontal
   card — small gradient/photo thumbnail (52px), trip name (Fraunces italic) + status
   line (Space Mono: "Upcoming · Nov 14" or "Completed · Apr 2026"), chevron for upcoming
   trips (links to Trip screen), no chevron on completed trips in the design (read-only
   once done — confirm with product whether completed trips should still be tappable to
   view a past itinerary; if yes, add the chevron and link, this spec doesn't block it).
4. Bottom nav (shared component), Profile tab active.

**Acceptance**
- [ ] Avatar initial derives from the real user name, not hardcoded
- [ ] Persona label matches whatever was selected in Onboarding (or re-selected later)
- [ ] Stamp count matches the real count of distinct visited countries
- [ ] Stamp rotation/color variety doesn't need to be pixel-identical to the design, just
      visually varied (avoid a grid of uniform circles)
- [ ] Trip rows route correctly (upcoming → Trip screen at minimum)
- [ ] Bottom nav shows Profile as active

---

## Cross-screen notes for Code

- None of the four screens in the design canvas wire up real data — they're static
  mockups with one placeholder destination/trip repeated. Treat every number, name and
  date in this spec's tables as **illustrative**, not literal copy to ship.
- No screen in this spec introduces new backend/data requirements beyond what a
  typical trip-planning app already needs (user profile + persona, trips with days and
  stops, saved/visited countries). If any of that doesn't exist yet in the data layer,
  flag it back rather than inventing a schema here.
- Keep brand voice rules in mind for any copy Code ends up writing beyond what's quoted
  here (no em dashes, minimal hyphens, "Why not?" family of lines) — see sidepath-brand.
