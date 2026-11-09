export const SITE_NAME = "sidepath";
export const SITE_TAGLINE = "Why not?";
export const SITE_DESCRIPTION =
  "Travel isn't a luxury. It's yours. Sidepath untangles planning, budgets, visas and points, and backs it with people who have actually been there.";
export const SITE_URL = "https://sidepath.travel";

export type SpokeKey = "mission" | "features" | "planner" | "join";

export interface Spoke {
  key: SpokeKey;
  href: string;
  label: string;
  short: string;
  /** Where this label sits around the globe, in degrees (0 = top, clockwise). */
  angle: number;
}

export const SPOKES: Spoke[] = [
  { key: "mission", href: "/mission", label: "Mission", short: "Why we exist", angle: 310 },
  { key: "features", href: "/features", label: "Features", short: "What's in the toolkit", angle: 40 },
  { key: "planner", href: "/planner", label: "Planner", short: "Try it on a real trip", angle: 140 },
  { key: "join", href: "/join", label: "Join", short: "Get early access", angle: 220 },
];

export const FEATURES: { title: string; body: string; stat?: string }[] = [
  {
    title: "Real prices, even the ugly ones",
    body: "Most \"top 10\" lists are just whoever paid. We show what a trip actually costs, flights in, no asterisks.",
    stat: "No ads, ever",
  },
  {
    title: "People who've actually been there",
    body: "Every route comes with notes from a traveller who flew it, not an algorithm that scraped it.",
  },
  {
    title: "Visas, untied",
    body: "Your passport, their rules, laid out before you book, not after you land.",
  },
  {
    title: "Points that actually work",
    body: "We show you what your miles are worth here, today, for this route, not a brochure estimate.",
  },
  {
    title: "A planner that teaches, not talks down",
    body: "Ask it anything about a route and get the reasoning, not just the answer.",
  },
  {
    title: "Built for the first big trip",
    body: "Everyone's first trip feels impossible right up until it isn't. We're built for that moment.",
  },
  {
    title: "Proof over promises",
    body: "The Legacy Flight Foundation funds a first international flight for someone who's never held a passport. That's the standard we hold ourselves to.",
  },
];

export const MISSION_STATS: { value: number; suffix: string; label: string }[] = [
  { value: 0, suffix: "", label: "Ads, sponsored posts or affiliate links" },
  { value: 8, suffix: "", label: "Traveller types the product is built around" },
  { value: 1, suffix: "st", label: "Flight funded for every milestone the community hits" },
];
