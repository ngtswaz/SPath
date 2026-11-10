"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FACETS, FAMILY_COLOR, FAMILY_ROOMS } from "@/lib/app-data";
import { uid, useLocal } from "@/lib/store";
import Button from "@/components/Button";
import Icon from "@/components/ui/icons";
import { EmptyState, Notice } from "@/components/ui";

interface Message {
  id: string;
  text: string;
  at: number;
}

export default function RoomPage({ params }: { params: { room: string } }) {
  const room = FAMILY_ROOMS.find((r) => r.slug === params.room);
  const [messages, setMessages] = useLocal<Message[]>(`sidepath_room_${params.room}`, []);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  if (!room) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState title="No room by that name" body="There are three rooms: Cultural, Adventure and Restorative." action={<Button href="/app/community">Back to Community</Button>} />
      </div>
    );
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: uid(), text: value, at: Date.now() }]);
    setText("");
  }

  const styles = FACETS.filter((f) => f.family === room.family).map((f) => f.label);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col">
      <Link href="/app/community" className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 self-start text-sm font-medium text-ink/75 hover:text-ink">
        <Icon name="arrow" size={16} className="rotate-180" />
        Community
      </Link>

      <header className="border-b border-ink/10 pb-5">
        <span className="block h-1.5 w-10 rounded-full" style={{ background: FAMILY_COLOR[room.family] }} />
        <h1 className="mt-3 font-serif text-[32px] font-semibold leading-tight tracking-tightish text-ink md:text-4xl">{room.family}</h1>
        <p className="mt-1 text-[15px] leading-relaxed text-ink/75">{room.blurb}</p>
        <p className="mt-2 text-[13px] text-ink/65">For {styles.join(", ")}.</p>
      </header>

      <div className="flex-1 py-6" aria-live="polite">
        {messages.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-serif text-xl font-semibold tracking-tightish text-ink">Quiet in here, for now</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink/70">
              Rooms open to everyone at launch. Leave the first note: a place worth the detour, or a question you want answered.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="flex flex-col items-end">
                <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[15px] leading-relaxed text-bone">{m.text}</p>
                <p className="mt-1 text-xs text-ink/55">
                  You, {new Date(m.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div ref={end} />
      </div>

      <div className="sticky bottom-0 -mx-5 border-t border-ink/10 bg-bone/95 px-5 pb-4 pt-3 backdrop-blur md:-mx-10 md:px-10">
        <form onSubmit={send} className="flex gap-2">
          <label htmlFor="room-message" className="sr-only">
            Message to the {room.family} room
          </label>
          <input id="room-message" className="field flex-1" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note to the room" autoComplete="off" />
          <Button type="submit" disabled={!text.trim()} aria-label="Send">
            <Icon name="send" size={18} />
          </Button>
        </form>
        <Notice className="mt-3">
          Chat isn&rsquo;t connected yet. Your notes stay on this device and nobody else can
          see them.
        </Notice>
      </div>
    </div>
  );
}
