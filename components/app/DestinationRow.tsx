import Link from "next/link";

/**
 * The app's one list pattern: a ruled line per entry, the name on the left,
 * a dotted leader running to the figures on the right, the way a ship's
 * manifest or an old price list is set. Shared by Explore and Profile so
 * every list reads the same.
 */

export function RowBoard({ children }: { children: React.ReactNode }) {
  return <div className="border-t-[1.5px] border-ink">{children}</div>;
}

/** A small inked tag, slightly crooked, like a rubber stamp on a ledger. */
export function InkTag({
  label,
  tone = "#2E6E5B",
  tilt = -4,
  className = "",
}: {
  label: string;
  tone?: string;
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      className={`shrink-0 border-[1.4px] px-1.5 py-px font-mono text-[10px] font-bold leading-normal ${className}`}
      style={{ borderColor: tone, color: tone, transform: `rotate(${tilt}deg)` }}
    >
      {label}
    </span>
  );
}

export function ListRow({
  href,
  title,
  subtitle,
  tagLabel,
  tagTone,
  tagTilt,
  primary,
  secondary,
  stacked = false,
}: {
  href: string;
  title: string;
  subtitle?: string;
  tagLabel?: string;
  tagTone?: string;
  tagTilt?: number;
  primary: string;
  secondary?: string;
  /** Put the two figures on separate lines (for longer values like dates). */
  stacked?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex gap-2 border-b border-ink/20 py-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-dark ${
        stacked ? "items-center" : "items-baseline"
      }`}
    >
      <span className="truncate font-serif text-xl italic text-ink decoration-terracotta decoration-wavy underline-offset-4 group-hover:underline">
        {title}
      </span>
      {subtitle && <span className="shrink-0 text-[12.5px] text-ink/78">{subtitle}</span>}
      {tagLabel && <InkTag label={tagLabel} tone={tagTone} tilt={tagTilt} className="self-center" />}
      <span aria-hidden="true" className="leader" style={stacked ? { transform: "none" } : undefined} />
      {stacked ? (
        <span className="shrink-0 text-right">
          <span className="block font-mono text-[13px] font-bold text-ink">{primary}</span>
          {secondary && <span className="mt-0.5 block font-mono text-[11px] text-ink/78">{secondary}</span>}
        </span>
      ) : (
        <>
          <span className="shrink-0 font-mono text-sm font-bold text-ink">{primary}</span>
          {secondary && <span className="shrink-0 font-mono text-[11px] text-ink/78">{secondary}</span>}
        </>
      )}
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
  index = 0,
}: {
  href: string;
  name: string;
  country: string;
  tag: "open" | "saved";
  price: number;
  days: number;
  index?: number;
}) {
  return (
    <ListRow
      href={href}
      title={name}
      subtitle={country}
      tagLabel={tag === "open" ? "Open" : "Saved"}
      tagTone={tag === "open" ? "#2E6E5B" : "#9E411F"}
      tagTilt={index % 2 === 0 ? -4 : 3}
      primary={`$${price}`}
      secondary={`${days} days`}
    />
  );
}
