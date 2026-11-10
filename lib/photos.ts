// Destination and editorial photography. All of it is free stock from
// Unsplash, loaded from their image servers, until Sidepath has its own.
// Each entry keeps the photographer and source page so credit can be shown
// (see /credits) and any photo can be swapped by editing one line here.

export interface PhotoInfo {
  /** The part after "photo-" in the Unsplash image URL. */
  id: string;
  alt: string;
  by: string;
  page: string;
  /** Two colours shown behind the photo while it loads, or if it can't. */
  tone: [string, string];
}

export const PHOTOS = {
  hero: {
    id: "1770838917379-32208420ea9a",
    alt: "A person walking a winding path up a grassy hill",
    by: "llxvisuals",
    page: "https://unsplash.com/photos/a-person-walks-a-winding-path-up-a-grassy-hill-7QSnX_F3ziY",
    tone: ["#4F5B3E", "#B9A77C"],
  },
  lisbon: {
    id: "1753372900032-8454fba4ae9f",
    alt: "A yellow tram on a steep street in Lisbon",
    by: "Jacek Urbanski",
    page: "https://unsplash.com/photos/a-yellow-tram-rides-down-a-street-in-lisbon-0sODcpe2RPo",
    tone: ["#8A7350", "#E0C9A6"],
  },
  tbilisi: {
    id: "1565008576549-57569a49371d",
    alt: "Tbilisi under an orange evening sky",
    by: "Neil Sengupta",
    page: "https://unsplash.com/photos/city-with-high-rise-buildings-under-orange-skies-emWzYc5XC_A",
    tone: ["#3B2A21", "#B9A77C"],
  },
  oaxaca: {
    id: "1686448921254-b326a7914d2f",
    alt: "A street strung with coloured flags in Jalatlaco, Oaxaca",
    by: "Anastasiia Malai",
    page: "https://unsplash.com/photos/a-street-lined-with-colorful-flags-and-buildings-8JNAY3kbfpI",
    tone: ["#2E6E5B", "#E0C9A6"],
  },
  lisbonRooftops: {
    id: "1682616789020-d01641d162da",
    alt: "Red rooftops in Lisbon with the water behind them",
    by: "Martti Salmi",
    page: "https://unsplash.com/photos/a-group-of-buildings-with-red-roofs-and-a-body-of-water-in-the-background-BxIeXOt0chg",
    tone: ["#7A6A58", "#E0C9A6"],
  },
  jeronimos: {
    id: "1747786892177-e0a4c99cdfae",
    alt: "The cloister of the Jerónimos Monastery in Belém",
    by: "Alex",
    page: "https://unsplash.com/photos/the-jeronimos-monasterys-elaborate-cloister-in-lisbon-oycLMWmEj-A",
    tone: ["#B9A77C", "#F7F2EA"],
  },
  pena: {
    id: "1562195168-c82fea0f0953",
    alt: "The red and yellow Pena Palace in Sintra",
    by: "Julia Solonina",
    page: "https://unsplash.com/photos/yellow-and-red-concrete-building-under-clear-blue-sky-ci19YINguoc",
    tone: ["#7A2E33", "#E0C9A6"],
  },
  trainWindow: {
    id: "1761165307483-8f293ad3f1e9",
    alt: "A traveller looking out of a train window",
    by: "Sir. Simo",
    page: "https://unsplash.com/photos/man-sitting-by-train-window-looking-out-Tp1H7cLW0zM",
    tone: ["#26201B", "#7A6A58"],
  },
  group: {
    id: "1702892427791-9e9c2171dfcf",
    alt: "A group of people with backpacks walking down a road",
    by: "Valentin Lacoste",
    page: "https://unsplash.com/photos/a-group-of-people-with-backpacks-walking-down-a-road-aG_mUQANvV8",
    tone: ["#2E6E5B", "#B9A77C"],
  },
  platform: {
    id: "1752352324676-2355e54927eb",
    alt: "An empty railway platform",
    by: "realfish",
    page: "https://unsplash.com/photos/empty-railway-platform-in-a-city-OqI1U5y5SII",
    tone: ["#3B2A21", "#B9A77C"],
  },
} satisfies Record<string, PhotoInfo>;

export type PhotoKey = keyof typeof PHOTOS;

export function photoUrl(key: PhotoKey, width = 1200): string {
  return `https://images.unsplash.com/photo-${PHOTOS[key].id}?auto=format&fit=crop&w=${width}&q=70`;
}
