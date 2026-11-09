"use client";

import { COMMUNITY_POSTS } from "@/lib/app-data";

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-7">
      <h1 className="font-serif text-2xl font-semibold tracking-tightish">Community</h1>
      <p className="mt-1 text-[13px] text-ink/70">
        Real trips from people who&rsquo;ve actually been there.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        {COMMUNITY_POSTS.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-[14px] border-[1.5px] border-sandstone bg-cream"
          >
            <div className="flex items-center gap-2.5 px-3.5 pt-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta font-serif text-sm font-semibold text-bone">
                {post.authorInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold leading-tight">{post.authorName}</div>
                <div className="font-mono text-[10px] text-ink/65">{post.authorLabel}</div>
              </div>
            </div>

            <div
              className="relative mt-3 h-[150px]"
              style={{ background: `linear-gradient(135deg, ${post.gradient[0]}, ${post.gradient[1]})` }}
            >
              <span className="absolute bottom-2.5 left-3.5 rounded bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-bone">
                {post.destination}
              </span>
            </div>

            <div className="p-3.5">
              <p className="text-[13px] leading-snug text-ink/90">{post.caption}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[10.5px] text-ink/72">
                  ${post.price} · {post.days} days
                </span>
                <button
                  type="button"
                  aria-label={`Like ${post.authorName}'s post`}
                  className="flex items-center gap-1.5 text-ink/72"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0532E" strokeWidth="2" aria-hidden="true">
                    <path d="M20.8 8.6c0-3-2.4-5.4-5.4-5.4-1.7 0-3.2.8-4.2 2-1-1.2-2.5-2-4.2-2-3 0-5.4 2.4-5.4 5.4 0 6 9.6 11 9.6 11s9.6-5 9.6-11z" />
                  </svg>
                  <span className="font-mono text-[10.5px]">{post.likes}</span>
                </button>
              </div>
            </div>
          </article>
        ))}

        <p className="mt-2 text-center text-[13px] text-ink/60">
          Posting your own trip isn&rsquo;t built yet &mdash; this is a preview of what the
          feed will look like once it is.
        </p>
      </div>
    </div>
  );
}
