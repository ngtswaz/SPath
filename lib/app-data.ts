// Mock/prototype data for the product app screens (/app/*).
//
// The personality model here follows the real decision in
// 2026-11-02_Product_Quiz-Nine-Subgroup-Switch-Plan_v01 (see project docs:
// sidepath-personality-system.md) — 9 subgroups in 3 families, scored 0-100,
// NOT the single-select 8-persona picker from the earlier design canvas,
// which predates that decision.
//
// No backend exists yet (confirmed in the architecture doc — every build
// step is "Not started"), so this file stands in for what would eventually
// be Supabase tables (travel_facets, user_facet_scores, places,
// place_facet_scores, trips, itinerary_days/slots). Scores are kept in
// localStorage client-side for this prototype.

import type { PhotoKey } from "@/lib/photos";

export type FacetFamily = "Cultural" | "Adventure" | "Restorative";

export interface Facet {
  key: string;
  label: string;
  family: FacetFamily;
  /** One representative quiz statement, drawn from the quiz plan doc. */
  statement: string;
}

export const FACETS: Facet[] = [
  { key: "heritage", label: "Heritage Seeker", family: "Cultural", statement: "When I visit an old place, I want to know the story behind it, not just see it." },
  { key: "local", label: "Local Immersion Seeker", family: "Cultural", statement: "I would rather eat where locals eat, even if I can't read the menu." },
  { key: "creative", label: "Creative Explorer", family: "Cultural", statement: "I'd happily spend an afternoon in a workshop learning a local craft." },
  { key: "thrill", label: "Thrill Seeker", family: "Adventure", statement: "A trip feels incomplete without at least one thing that gets my heart racing." },
  { key: "spontaneous", label: "Spontaneous Discoverer", family: "Adventure", statement: "Some of my best travel moments came from changing plans on the spot." },
  { key: "nature", label: "Nature Adventurer", family: "Adventure", statement: "Being out in wild landscapes is one of the main reasons I travel." },
  { key: "wellness", label: "Wellness Seeker", family: "Restorative", statement: "I choose trips partly so I come home feeling healthier." },
  { key: "slow", label: "Slow Traveler", family: "Restorative", statement: "I would rather see two places properly than five places quickly." },
  { key: "reflective", label: "Reflective Traveler", family: "Restorative", statement: "I look for quiet moments on a trip to think and reset." },
];

export const FAMILY_COLOR: Record<FacetFamily, string> = {
  Cultural: "#7A2E33", // burgundy
  Adventure: "#2E6E5B", // trail
  Restorative: "#8A7350", // sand
};

export type FacetScores = Record<string, number>; // facet key -> 0-100

export function scoreFromAnswers(answers: Record<string, number>): FacetScores {
  // Each answer is 1-5 ("not me" to "very me"); scale to 0-100.
  const scores: FacetScores = {};
  for (const f of FACETS) {
    const a = answers[f.key] ?? 3;
    scores[f.key] = Math.round(((a - 1) / 4) * 100);
  }
  return scores;
}

/** Label rule from the quiz plan: top family + top subgroup, blended if the
 * top two are close and in different families. Display only — matching
 * elsewhere always uses the full 9 scores, never the label. */
export function labelFromScores(scores: FacetScores): string {
  const ranked = [...FACETS].sort((a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0));
  const top = ranked[0];
  const second = ranked[1];
  const topScore = scores[top.key] ?? 0;
  const secondScore = second ? scores[second.key] ?? 0 : 0;

  if (second && topScore - secondScore <= 10 && second.family !== top.family) {
    return `${top.family} and ${second.family}`;
  }
  return `${top.family} Explorer, especially ${top.label}`;
}


export interface Destination {
  id: string;
  name: string;
  country: string;
  /** ISO 3166 alpha-2, used by the visa check. */
  countryCode: string;
  price: number;
  days: number;
  photo: PhotoKey;
  /** One line in the Sidepath voice, shown on cards. */
  blurb: string;
  facetScores: FacetScores;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    countryCode: "PT",
    price: 640,
    days: 5,
    photo: "lisbon",
    blurb: "Hills, tiles and a river that slows everything down.",
    facetScores: { heritage: 85, local: 70, creative: 60, thrill: 20, spontaneous: 55, nature: 30, wellness: 35, slow: 60, reflective: 55 },
  },
  {
    id: "tbilisi",
    name: "Tbilisi",
    country: "Georgia",
    countryCode: "GE",
    price: 410,
    days: 7,
    photo: "tbilisi",
    blurb: "Old balconies, long dinners and the Caucasus within reach.",
    facetScores: { heritage: 75, local: 85, creative: 45, thrill: 40, spontaneous: 65, nature: 55, wellness: 30, slow: 50, reflective: 40 },
  },
  {
    id: "oaxaca",
    name: "Oaxaca",
    country: "Mexico",
    countryCode: "MX",
    price: 520,
    days: 6,
    photo: "oaxaca",
    blurb: "Markets, mezcal and streets that look hand painted.",
    facetScores: { heritage: 70, local: 90, creative: 75, thrill: 30, spontaneous: 70, nature: 40, wellness: 35, slow: 45, reflective: 35 },
  },
];

/**
 * How closely a place fits a traveller: 100 minus the average gap between
 * their nine scores and the place's nine scores. Returns null when the
 * traveller has not taken the quiz, so the UI can say so instead of
 * showing a made-up number.
 */
export function matchPercent(user: FacetScores | null, place: FacetScores): number | null {
  if (!user) return null;
  const gaps = FACETS.map((f) => Math.abs((user[f.key] ?? 50) - (place[f.key] ?? 50)));
  return Math.round(100 - gaps.reduce((a, b) => a + b, 0) / gaps.length);
}

// Demo-only mapping from destination to the one seeded trip we have. A
// destination without an entry links to its own id, which the trip page
// answers with an honest "no itinerary here yet".
export const TRIP_FOR: Record<string, string> = { lisbon: "lisbon-nov" };

export function tripHref(destinationId: string): string {
  return `/app/trip/${TRIP_FOR[destinationId] ?? destinationId}`;
}

/** "Lisbon, Portugal" (as community posts store it) back to its destination. */
export function destinationByPlace(place: string): Destination | undefined {
  const city = place.split(",")[0].trim().toLowerCase();
  return DESTINATIONS.find((d) => d.name.toLowerCase() === city);
}

export interface SlotOption {
  name: string;
  /** A plain fact that helps choose between options. No prices: partners aren't connected. */
  note?: string;
}

/** Shown as an opt-in tab on a slot. Never applied automatically. */
export interface PerkOffer {
  id: string;
  title: string;
  body: string;
}

export interface ItinerarySlot {
  id: string;
  time: string;
  /** First option is the planner's pick; the rest are alternatives for the same slot. */
  options: SlotOption[];
  perk?: PerkOffer;
}

export interface ItineraryDay {
  day: number;
  title: string;
  photo: PhotoKey;
  slots: ItinerarySlot[];
}

export interface Trip {
  id: string;
  destinationId: string;
  dateRange: string;
  budget: number;
  days: ItineraryDay[];
}

export const TRIPS: Trip[] = [
  {
    id: "lisbon-nov",
    destinationId: "lisbon",
    dateRange: "Nov 14 to 19",
    budget: 640,
    days: [
      {
        day: 1,
        title: "Alfama wanders",
        photo: "lisbonRooftops",
        slots: [
          {
            id: "d1-view",
            time: "9:00",
            options: [
              { name: "Miradouro das Portas do Sol", note: "The classic view over Alfama's rooftops." },
              { name: "Miradouro de Santa Luzia", note: "Next door, with tiled walls and a pergola." },
              { name: "Miradouro da Senhora do Monte", note: "Higher up and further out, with the widest view." },
            ],
          },
          {
            id: "d1-nata",
            time: "11:30",
            options: [
              { name: "Pastéis de nata at Manteigaria", note: "Baked in front of you all day." },
              { name: "Pastéis de Belém", note: "The original bakery, across town in Belém." },
              { name: "Confeitaria Nacional", note: "One of the city's oldest pastry shops, downtown." },
            ],
          },
        ],
      },
      {
        day: 2,
        title: "Belém, slow",
        photo: "jeronimos",
        slots: [
          {
            id: "d2-monastery",
            time: "10:00",
            options: [
              { name: "Jerónimos Monastery", note: "The cloister is the part people remember." },
              { name: "Torre de Belém", note: "The riverside tower, a short walk away." },
              { name: "MAAT", note: "Art, architecture and technology museum on the water." },
            ],
            perk: {
              id: "perk-entry",
              title: "Points could cover this entry",
              body: "If your balance stretches to it, paying for this ticket with points leaves more of the cash budget for food.",
            },
          },
          {
            id: "d2-river",
            time: "16:00",
            options: [
              { name: "River walk, Ponte 25 de Abril view", note: "Flat, easy, best late in the day." },
              { name: "Padrão dos Descobrimentos", note: "The monument on the waterfront, with a viewing deck." },
              { name: "LX Factory", note: "Shops, food and bookshops in an old factory under the bridge." },
            ],
          },
        ],
      },
      {
        day: 3,
        title: "Sintra, day trip",
        photo: "pena",
        slots: [
          {
            id: "d3-palace",
            time: "8:15",
            options: [
              { name: "Pena Palace, train from Rossio", note: "The red and yellow palace on the hilltop." },
              { name: "Quinta da Regaleira", note: "Gardens, tunnels and the spiral well." },
              { name: "Castelo dos Mouros", note: "Ruined castle walls with a long view to the coast." },
            ],
            perk: {
              id: "perk-fx",
              title: "Pay in euros on a no foreign fee card",
              body: "Tickets here are charged in euros. A card with no foreign transaction fee skips the conversion charge most banks add.",
            },
          },
        ],
      },
    ],
  },
];

export interface CommunityPost {
  id: string;
  authorName: string;
  authorInitial: string;
  authorLabel: string;
  destination: string;
  caption: string;
  price: number;
  days: number;
  likes: number;
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "p1",
    authorName: "Renata",
    authorInitial: "R",
    authorLabel: "Cultural Explorer, especially Local Immersion",
    destination: "Lisbon, Portugal",
    caption: "Found a 90-year-old noodle-and-bifana spot two streets off the tourist strip. No English menu, best meal of the trip.",
    price: 640,
    days: 5,
    likes: 38,
  },
  {
    id: "p2",
    authorName: "Trian",
    authorInitial: "T",
    authorLabel: "Adventure and Restorative",
    destination: "Tbilisi, Georgia",
    caption: "Two-hour hike to a mountain hut that also happened to serve the best khinkali I've had. Worth every step.",
    price: 410,
    days: 7,
    likes: 24,
  },
  {
    id: "p3",
    authorName: "Natalia",
    authorInitial: "N",
    authorLabel: "Restorative, Wellness-led",
    destination: "Oaxaca, Mexico",
    caption: "A tea house with a garden view where nobody rushed us out after two hours. Exactly what I needed mid-trip.",
    price: 520,
    days: 6,
    likes: 51,
  },
];

/** The three chat rooms at launch: one per family, not one per subgroup,
 * so rooms stay busy enough to be worth opening (see the product spec). */
export const FAMILY_ROOMS: { slug: string; family: FacetFamily; blurb: string }[] = [
  { slug: "cultural", family: "Cultural", blurb: "History, food where locals eat, and things made by hand." },
  { slug: "adventure", family: "Adventure", blurb: "Heart rate up, plans loose, and time outdoors." },
  { slug: "restorative", family: "Restorative", blurb: "Fewer places, slower days, and coming home rested." },
];

export interface PassportStamp {
  code: string;
  name: string;
}

export const PROFILE_STAMPS: PassportStamp[] = [
  { code: "FJ", name: "Fiji" },
  { code: "NZ", name: "New Zealand" },
  { code: "IN", name: "India" },
  { code: "HR", name: "Croatia" },
  { code: "CN", name: "China" },
];

/** Plans as currently priced. What each one includes is still being set,
 * so the UI shows prices and says so rather than inventing feature lists. */
export const PLANS: { id: string; name: string; price: string; cadence: string; line: string }[] = [
  { id: "base", name: "Base", price: "$0", cadence: "free", line: "Where everyone starts." },
  { id: "plus", name: "Plus", price: "$6.99", cadence: "per month", line: "More room to plan." },
  { id: "pro", name: "Pro", price: "$19.99", cadence: "per month", line: "For people who travel often." },
];

export const VISA_CONCIERGE = { name: "Visa Concierge", price: "$150 to $500+", cadence: "per application" };

// ISO 3166-1 alpha-2 codes. Names come from the browser (Intl.DisplayNames),
// so there is no country-name table to maintain or get wrong here.
export const COUNTRY_CODES =
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW".split(
    " "
  );

export function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
