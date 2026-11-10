import type { IconName } from "@/components/ui/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

/** The five places a phone's tab bar can hold. */
export const TAB_ITEMS: NavItem[] = [
  { href: "/app/explore", label: "Explore", icon: "explore" },
  { href: "/app/trips", label: "Trips", icon: "trips" },
  { href: "/app/plan", label: "Plan", icon: "plan" },
  { href: "/app/community", label: "Community", icon: "community" },
  { href: "/app/profile", label: "Profile", icon: "profile" },
];

/** Everything, grouped, for the desktop sidebar (and the Profile menu on phones). */
export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Travel",
    items: [
      { href: "/app/explore", label: "Explore", icon: "explore" },
      { href: "/app/plan", label: "Plan a trip", icon: "plan" },
      { href: "/app/trips", label: "Trips", icon: "trips" },
      { href: "/app/saved", label: "Saved", icon: "saved" },
    ],
  },
  {
    title: "Together",
    items: [
      { href: "/app/community", label: "Community", icon: "community" },
      { href: "/app/groups", label: "Group trips", icon: "groups" },
    ],
  },
  {
    title: "Your kit",
    items: [
      { href: "/app/wallet", label: "Cards and points", icon: "wallet" },
      { href: "/app/passports", label: "Passports", icon: "passport" },
      { href: "/app/visa", label: "Visa check", icon: "visa" },
      { href: "/app/esim", label: "eSIM", icon: "esim" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/app/profile", label: "Profile", icon: "profile" },
      { href: "/app/plans", label: "Plans", icon: "plans" },
      { href: "/app/settings", label: "Settings", icon: "settings" },
    ],
  },
];

export const isActive = (pathname: string | null, href: string) =>
  pathname === href || !!pathname?.startsWith(href + "/");
