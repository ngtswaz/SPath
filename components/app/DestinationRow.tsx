import Link from "next/link";

/**
 * The flight-row list structure (borrowed from the reference the user
 * liked, kept inside the brand palette): a plain bordered list, not a grid
 * of rounded cards. One bold accent — terracotta, as a filled tag — does
 * all the "look here" work; everything else stays quiet lines and type.
 * Shared by Explore, Trips, Saved and Profile so the one pattern covers
 * every list in the app instead of each screen inventing its own card.
 */

export function RowBoard({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-ink">{children}</div>;
}

export function ListRow({
  href,
  title,
  subtitle,
  tagLabel,
  tagVariant = "outline",
  primary,
  secondary,
}: {
  href: string;
  title: string;
  subtitle?: string;
  tagLabel?: string;
  tagVariant?: "outline" | "filled";
  primary: string;
  secondary?: string;
}) {
  return (
    <Link
      href={href}
      className="grid grid-cols-[1fr_auto_auto] items-center gap-3.5 border-b border-sandstone py-[15px]"
    >
      <span className="min-w-0 truncate font-serif text-[18px] italic text-ink">
        {title}
        {subtitle && <span className="ml-2 font-sans text-[13px] not-italic text-ink/50">{subtitle}</span>}
      </span>
      {tagLabel ? (
        tagVariant === "filled" ? (
          <span className="rounded-[2px] bg-terracotta px-[7px] py-[3px] font-mono text-[10.5px] text-bone">
            {tagLabel}
          </span>
        ) : (
          <span className="rounded-[2px] border border-trail px-[7px] py-[3px] font-mono text-[10.5px] text-trail">
            {tagLabel}
          </span>
        )
      ) : (
        <span />
      )}
      <span className="text-right">
        <span className="block font-mono text-sm font-bold text-ink">{primary}</span>
        {secondary && <span className="mt-0.5 block font-mono text-[11px] text-ink/55">{secondary}</span>}
      </span>
    </Link>
  );
}

/** Thin convenience wrapper for the common case: a destination with an
 * open/saved state and a price. */
export function DestinationRow({
  href,
  name,
  country,
  tag,
  price,
  days,
}: {
  href: string;
  name: string;
  country: string;
  tag: "open" | "saved";
  price: number;
  days: number;
}) {
  return (
    <ListRow
      href={href}
      title={name}
      subtitle={country}
      tagLabel={tag === "open" ? "Open" : "Saved"}
      tagVariant={tag === "open" ? "outline" : "filled"}
      primary={`$${price}`}
      secondary={`${days} days`}
    />
  );
}
