// Mock/prototype data for the product app screens (/app/*).
//
// The personality model here follows the real decision in
// 2026-11-02_Product_Quiz-Nine-Subgroup-Switch-Plan_v01 (see project docs:
// sidepath-personality-system.md) — 9 subgroups in 3 families, scored 0-100,
// NOT the single-select 8-persona picker from the earlier map+postcard
// design canvas, which predates that decision.
//
// No backend exists yet (confirmed in the architecture doc — every build
// step is "Not started"), so this file stands in for what would eventually
// be Supabase tables (travel_facets, user_facet_scores, places,
// place_facet_scores, trips, itinerary_days/slots). Scores are kept in
// localStorage client-side for this prototype.

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
  Cultural: "#9E411F", // terracotta-dark
  Adventure: "#2E6E5B", // trail
  Restorative: "#7A2E33", // burgundy
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

/** Which postcard illustration a place gets until real photography exists. */
export type SceneKind = "harbour" | "mountains" | "desert";

/** The stamp colour that goes with each kind of place. */
export const SCENE_TONE: Record<SceneKind, string> = {
  harbour: "#C0532E", // terracotta
  mountains: "#2E6E5B", // trail
  desert: "#7A2E33", // burgundy
};

export interface Destination {
  id: string;
  name: string;
  country: string;
  price: number;
  days: number;
  gradient: [string, string];
  scene: SceneKind;
  /** Printed on the postcard, trail-marker style. */
  coords: string;
  /** Position as a fraction of the map panel, 0-1 each axis. */
  pos: { x: number; y: number };
  facetScores: FacetScores;
}

const g = (a: string, b: string): [string, string] => [a, b];

export const DESTINATIONS: Destination[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    price: 640,
    days: 5,
    gradient: g("#C0532E", "#E8A23D"),
    scene: "harbour",
    coords: "38.72 N, 9.14 W",
    pos: { x: 0.14, y: 0.78 },
    facetScores: { heritage: 85, local: 70, creative: 60, thrill: 20, spontaneous: 55, nature: 30, wellness: 35, slow: 60, reflective: 55 },
  },
  {
    id: "tbilisi",
    name: "Tbilisi",
    country: "Georgia",
    price: 410,
    days: 7,
    gradient: g("#2E6E5B", "#7A2E33"),
    scene: "mountains",
    coords: "41.72 N, 44.83 E",
    pos: { x: 0.34, y: 0.32 },
    facetScores: { heritage: 75, local: 85, creative: 45, thrill: 40, spontaneous: 65, nature: 55, wellness: 30, slow: 50, reflective: 40 },
  },
  {
    id: "oaxaca",
    name: "Oaxaca",
    country: "Mexico",
    price: 520,
    days: 6,
    gradient: g("#E8A23D", "#C0532E"),
    scene: "desert",
    coords: "17.07 N, 96.72 W",
    pos: { x: 0.74, y: 0.1 },
    facetScores: { heritage: 70, local: 90, creative: 75, thrill: 30, spontaneous: 70, nature: 40, wellness: 35, slow: 45, reflective: 35 },
  },
];

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

/** "Nov 14 to 19" becomes "14 Nov" for the postmark. */
export function postmarkDate(dateRange: string): string {
  const m = dateRange.match(/^([A-Za-z]+)\s+(\d+)/);
  return m ? `${m[2]} ${m[1]}` : dateRange;
}

export interface ItineraryStop {
  name: string;
  time: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  gradient: [string, string];
  stops: ItineraryStop[];
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
        gradient: g("#C0532E", "#E8A23D"),
        stops: [
          { name: "Miradouro das Portas do Sol", time: "9:00" },
          { name: "Pastéis de nata at Manteigaria", time: "11:30" },
        ],
      },
      {
        day: 2,
        title: "Belém, slow",
        gradient: g("#2E6E5B", "#7A2E33"),
        stops: [
          { name: "Jerónimos Monastery", time: "10:00" },
          { name: "River walk, Ponte 25 de Abril view", time: "16:00" },
        ],
      },
      {
        day: 3,
        title: "Sintra, day trip",
        gradient: g("#E8A23D", "#C0532E"),
        stops: [{ name: "Pena Palace, train from Rossio", time: "8:15" }],
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
  gradient: [string, string];
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
    gradient: g("#C0532E", "#E8A23D"),
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
    gradient: g("#2E6E5B", "#7A2E33"),
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
    gradient: g("#E8A23D", "#C0532E"),
    price: 520,
    days: 6,
    likes: 51,
  },
];

export interface PassportStamp {
  code: string;
  /** Spoken name, since the three-letter code alone means little read aloud. */
  name: string;
  color: string;
}

export const PROFILE_STAMPS: PassportStamp[] = [
  { code: "FJI", name: "Fiji", color: "#9E411F" },
  { code: "NZL", name: "New Zealand", color: "#2E6E5B" },
  { code: "IND", name: "India", color: "#7A2E33" },
  { code: "HRV", name: "Croatia", color: "#26201B" },
  { code: "CHN", name: "China", color: "#9E411F" },
];
