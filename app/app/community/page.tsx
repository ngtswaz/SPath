"use client";

import { COMMUNITY_POSTS, SCENE_TONE, destinationByPlace } from "@/lib/app-data";
import PostcardScene from "@/components/paper/PostcardScene";
import { Postmark, Stamp } from "@/components/paper/Stamp";
import { sceneLabel } from "@/components/app/Postcard";

export default function CommunityPage() {
  return (
    <div className="flex flex-col px-6 pb-10 pt-[26px] md:px-10 md:pt-10">
      <h1 className="font-serif text-3xl font-semibold tracking-tightish text-ink md:text-4xl">Community</h1>
      <p className="mt-1 text-[13.5px] text-ink/80">
        Real trips from people who&rsquo;ve actually been there.
      </p>

      <div className="mt-[22px] flex flex-col gap-[22px]">
        {COMMUNITY_POSTS.map((post, i) => {
          const d = destinationByPlace(post.destination);
          const city = post.destination.split(",")[0];
          return (
            // Each post is a postcard someone sent back: the picture, then
            // the back of the card with their note on the left and the
            // stamp (what it cost) and postmark (where, how long) on the right.
            <article
              key={post.id}
              className={`relative border border-ink/20 bg-bone p-2 shadow-card md:flex ${
                i % 2 === 0 ? "-rotate-[1.2deg]" : "rotate-[1.3deg]"
              }`}
            >
              {/* Phone: picture on top. Desktop: the card laid open, picture beside the note. */}
              {d && (
                <div className="md:w-[40%] md:shrink-0">
                  <PostcardScene scene={d.scene} label={sceneLabel(d)} className="h-[110px] md:h-full md:min-h-[190px]" />
                </div>
              )}
              <div className="flex min-w-0 flex-1 gap-3.5 px-1.5 pb-1.5 pt-3 md:pl-4 md:pt-2">
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[14.5px] italic leading-[1.45] text-ink md:text-base">{post.caption}</p>
                  <p className="mt-2.5 font-serif text-[19px] font-semibold italic leading-tight text-ink">
                    {post.authorName}
                  </p>
                  <p className="mt-px font-mono text-[9.5px] leading-snug text-ink/80">{post.authorLabel}</p>
                  <p className="mt-1.5 font-mono text-[10.5px] text-ink/85">
                    {post.destination}, ${post.price}, {post.days} days
                  </p>
                </div>
                <div className="relative flex w-24 shrink-0 flex-col items-end justify-between border-l border-ink/35 pl-3.5">
                  <Stamp
                    value={`$${post.price}`}
                    tone={d ? SCENE_TONE[d.scene] : "#C0532E"}
                    className={i % 2 === 0 ? "rotate-[4deg]" : "-rotate-[5deg]"}
                  />
                  <Postmark
                    city={city}
                    lines={[`${post.days} days`]}
                    className={`absolute -left-3 top-[52px] ${i % 2 === 0 ? "-rotate-12" : "rotate-[9deg]"}`}
                  />
                  <button
                    type="button"
                    aria-label={`Like ${post.authorName}'s postcard, ${post.likes} likes`}
                    className="-mb-2 -mr-1 mt-3 flex min-h-[44px] min-w-[44px] items-center justify-end gap-1.5 px-1 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9E411F" strokeWidth="2.2" aria-hidden="true">
                      <path d="M20.8 8.6c0-3-2.4-5.4-5.4-5.4-1.7 0-3.2.8-4.2 2-1-1.2-2.5-2-4.2-2-3 0-5.4 2.4-5.4 5.4 0 6 9.6 11 9.6 11s9.6-5 9.6-11z" />
                    </svg>
                    <span className="font-mono text-[11.5px]">{post.likes}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        <p className="mt-2 text-center font-serif text-[15px] italic text-ink/80">
          Posting your own trip isn&rsquo;t built yet. This is a preview of what the
          feed will look like once it is.
        </p>
      </div>
    </div>
  );
}
