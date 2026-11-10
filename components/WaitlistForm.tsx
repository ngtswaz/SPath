"use client";

import { FormEvent, useState } from "react";
import confetti from "canvas-confetti";
import Button from "./Button";

type Status = "idle" | "loading" | "done" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something didn't work. Try again.");
        return;
      }

      setStatus("done");
      setMessage("You're on the list. We'll be in touch.");

      if (typeof window !== "undefined") {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (!reduceMotion) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#C0532E", "#E8A23D", "#2E6E5B", "#E0C9A6"],
          });
        }
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-xl border border-trail/40 bg-trail/10 px-5 py-4 font-medium text-trail">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@wherever-you-are.com"
        className="field flex-1"
      />
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Get early access"}
      </Button>
      {status === "error" && (
        <p role="alert" className="text-sm text-burgundy sm:basis-full">
          {message}
        </p>
      )}
    </form>
  );
}
