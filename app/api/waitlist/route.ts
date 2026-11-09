import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

async function fileFallback(email: string) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let existing: { email: string; at: string }[] = [];
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }
  if (!existing.some((e) => e.email === email)) {
    existing.push({ email, at: new Date().toISOString() });
    await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2));
  }
}

export async function POST(req: NextRequest) {
  let email: string | undefined;
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That doesn't look like an email address." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  if (supabase) {
    const { error } = await supabase
      .from("waitlist")
      .upsert({ email }, { onConflict: "email" });

    if (error) {
      // Supabase configured but the call failed — fall back rather than
      // losing the signup.
      await fileFallback(email);
    }
  } else {
    await fileFallback(email);
  }

  return NextResponse.json({ ok: true });
}
