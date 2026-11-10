"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";

/**
 * The one call to action the whole site now has: go into the app.
 * Routes to the quiz for a first-time visitor, straight to Explore for
 * someone who's already taken it (read from the same localStorage key
 * the onboarding flow writes to).
 */
export function useStartExploring() {
  const router = useRouter();
  return function go() {
    let hasProfile = false;
    try {
      hasProfile = !!localStorage.getItem("sidepath_label");
    } catch {
      hasProfile = false;
    }
    router.push(hasProfile ? "/app/explore" : "/app/onboarding");
  };
}

export default function StartButton({
  variant = "primary",
  className = "",
  children = "Start exploring",
}: {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children?: ReactNode;
}) {
  const go = useStartExploring();

  return (
    <Button type="button" variant={variant} className={className} onClick={go}>
      {children}
    </Button>
  );
}
