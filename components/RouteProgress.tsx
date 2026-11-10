"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A thin terracotta line across the top of the screen on every route
 * change: the brand's path motif, reduced to the size a working product
 * can afford. It never covers the page or delays it.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const prev = useRef(pathname);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    setRun((n) => n + 1);
  }, [pathname]);

  if (run === 0) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]">
      <div key={run} className="h-full origin-left animate-route-bar bg-terracotta" />
    </div>
  );
}
