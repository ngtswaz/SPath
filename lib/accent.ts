// The accent colours being compared as replacements for the old orange.
// Values live in app/globals.css; this is only the list and its storage key.
export const ACCENT_KEY = "sidepath_accent";

export const ACCENTS = [
  { id: "green", name: "Trail green", swatch: "#24584A" },
  { id: "blue", name: "Harbour blue", swatch: "#23527A" },
  { id: "burgundy", name: "Burgundy", swatch: "#7A2E33" },
  { id: "ink", name: "Ink black", swatch: "#26201B" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

/**
 * Runs before first paint (inlined in <head>) so a stored or linked choice
 * never flashes the default first. `?accent=blue` on any URL sets it, which
 * makes a candidate shareable as a plain link.
 */
export const ACCENT_BOOT = `(function(){try{var k="${ACCENT_KEY}",ok=${JSON.stringify(ACCENTS.map((a) => a.id))},q=new URLSearchParams(location.search).get("accent"),a=ok.indexOf(q)>-1?q:localStorage.getItem(k);if(ok.indexOf(q)>-1)localStorage.setItem(k,q);if(a&&ok.indexOf(a)>-1)document.documentElement.setAttribute("data-accent",a)}catch(e){}})()`;
