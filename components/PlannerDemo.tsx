"use client";

import { FormEvent, useRef, useState } from "react";
import Button from "./Button";

export default function PlannerDemo() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setOutput("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch {
      setOutput(
        "The planner is taking a breather. Try again in a moment. This is a demo build, not the live planner."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-sandstone bg-cream p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="planner-prompt" className="sr-only">
          Describe the trip you want planned
        </label>
        <input
          id="planner-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Five days, somewhere warm, under $700"
          className="min-h-[44px] flex-1 rounded-full border border-ink/20 bg-bone px-5 py-3 text-sm text-ink outline-none focus-visible:border-terracotta-dark"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Planning…" : "Sketch it out"}
        </Button>
      </form>

      <div
        aria-live="polite"
        className="mt-6 min-h-[8rem] whitespace-pre-wrap font-mono text-sm leading-relaxed text-ink/85"
      >
        {output || (
          <span className="text-ink/70">
            Your sketch will show up here, line by line.
          </span>
        )}
      </div>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-ink/70">
        Demo build. The real planner lives in the app.
      </p>
    </div>
  );
}
