"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "@/components/Button";
import Photo from "@/components/ui/Photo";
import { Field, Notice } from "@/components/ui";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_PROFILE, KEYS, readString, useLocal, type Profile } from "@/lib/store";

/**
 * Sign in and sign up share one form. With Supabase keys configured it
 * calls real auth; without them (this preview) it remembers the name and
 * email on this device only, and says so on the page.
 */
export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [, setProfile] = useLocal<Profile>(KEYS.profile, DEFAULT_PROFILE);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabase();
  const signup = mode === "signup";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    if (supabase) {
      const { error: authError } = signup
        ? await supabase.auth.signUp({ email, password, options: { data: { name } } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        setBusy(false);
        return;
      }
    }

    setProfile((p) => ({ ...p, email, name: signup && name.trim() ? name.trim() : p.name }));
    // New accounts start with the quiz; returning travellers go straight in
    // if this device already has a quiz result.
    router.push(signup || !readString(KEYS.label) ? "/app/onboarding" : "/app/explore");
  }

  return (
    <main className="grid min-h-screen pt-16 md:grid-cols-2">
      <Photo name={signup ? "group" : "platform"} width={900} eager className="hidden md:block" />

      <div className="flex items-center justify-center px-5 py-12 md:px-12">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-4xl font-semibold tracking-tightish text-ink">
            {signup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
            {signup ? "Free to start. The quiz comes next and takes nine taps." : "Pick up where you left off."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {signup && (
              <Field label="First name" htmlFor="auth-name">
                <input id="auth-name" className="field" autoComplete="given-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
            )}
            <Field label="Email" htmlFor="auth-email">
              <input id="auth-email" type="email" className="field" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password" htmlFor="auth-password" hint={signup ? "At least 8 characters." : undefined}>
              <input
                id="auth-password"
                type="password"
                className="field"
                autoComplete={signup ? "new-password" : "current-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            {error && (
              <p role="alert" className="text-sm font-medium text-burgundy">
                {error}
              </p>
            )}

            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "One moment" : signup ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-ink/75">
            {signup ? "Already have an account?" : "New here?"}{" "}
            <Link href={signup ? "/signin" : "/signup"} className="font-semibold text-terracotta-dark underline-offset-4 hover:underline">
              {signup ? "Sign in" : "Create an account"}
            </Link>
          </p>

          {!supabase && (
            <Notice className="mt-8" title="Preview build">
              Accounts aren&rsquo;t connected yet. This remembers your name and email on
              this device only, and your password isn&rsquo;t sent or stored anywhere.
            </Notice>
          )}
        </div>
      </div>
    </main>
  );
}
