"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

// Remembered between navigations (module scope survives them on the
// client) so each screen knows whether it was reached by going deeper,
// coming back, or switching tabs.
let lastDepth: number | null = null;

const depthOf = (path: string) => path.split("/").filter(Boolean).length;

/**
 * Screens move the way they do in a phone app: going into something slides
 * it in from the right, coming back slides from the left, and switching
 * tabs is a quick rise. A template (unlike a layout) remounts on each
 * navigation, which is what replays the motion.
 *
 * The very first screen of a visit doesn't animate, so the server-rendered
 * page is visible immediately instead of waiting on JavaScript to fade in.
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const depth = depthOf(usePathname() ?? "");
  const [from] = useState(() => {
    if (lastDepth === null) return null;
    if (depth > lastDepth) return { opacity: 0, x: 44, y: 0 };
    if (depth < lastDepth) return { opacity: 0, x: -44, y: 0 };
    return { opacity: 0, x: 0, y: 10 };
  });

  useEffect(() => {
    lastDepth = depth;
  }, [depth]);

  return (
    <motion.div
      initial={reduce || !from ? false : from}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
