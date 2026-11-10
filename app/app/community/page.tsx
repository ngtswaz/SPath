"use client";

import Link from "next/link";
import { COMMUNITY_POSTS, FAMILY_COLOR, FAMILY_ROOMS, destinationByPlace } from "@/lib/app-data";
import { useLocal } from "@/lib/store";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/icons";
import { Notice, PageHeader, Section } from "@/components/ui";

export default function CommunityPage() {
  const [liked, setLiked] = useLocal<string[]>("sidepath_liked_posts", []);

  return (
    <div>
      <PageHeader title="Community" sub="Real trips from people who've actually been there." />

      <Section title="Rooms">
        <ul className="grid gap-3 md:grid-cols-3">
          {FAMILY_ROOMS.map((room) => (
            <li key={room.slug}>
              <Link
                href={`/app/community/${room.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-5 hover:border-ink/30"
              >
                <span className="h-1.5 w-10 rounded-full" style={{ background: FAMILY_COLOR[room.family] }} />
                <span className="mt-3 font-serif text-xl font-semibold tracking-tightish text-ink group-hover:underline">{room.family}</span>
                <span className="mt-1 flex-1 text-sm leading-snug text-ink/75">{room.blurb}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-dark">
                  Open the room
                  <Icon name="arrow" size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Notes from the road" className="mt-10">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY_POSTS.map((post) => {
            const d = destinationByPlace(post.destination);
            const isLiked = liked.includes(post.id);
            return (
              <li key={post.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white">
                  {d && <Photo name={d.photo} width={520} className="aspect-[16/10]" />}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-ink/65">{post.destination}</p>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink">&ldquo;{post.caption}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-base font-semibold text-bone">
                        {post.authorInitial}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">{post.authorName}</span>
                        <span className="block truncate text-[13px] text-ink/65">{post.authorLabel}</span>
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                      <span className="font-mono text-xs font-bold text-ink/75">
                        ${post.price}, {post.days} days
                      </span>
                      <button
                        type="button"
                        aria-label={`${isLiked ? "Unlike" : "Like"} ${post.authorName}'s note`}
                        aria-pressed={isLiked}
                        onClick={() => setLiked((l) => (isLiked ? l.filter((x) => x !== post.id) : [...l, post.id]))}
                        className="-mr-2 flex min-h-[44px] items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold text-ink hover:bg-ink/[0.05]"
                      >
                        <Icon name="saved" size={17} filled={isLiked} className={isLiked ? "text-terracotta" : "text-ink/70"} />
                        <span className="font-mono text-xs">{post.likes + (isLiked ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <Notice className="mt-6">
          Posting your own trip isn&rsquo;t built yet. This is a preview of what the feed will
          look like once it is.
        </Notice>
      </Section>
    </div>
  );
}
