import Link from "next/link";

/** Title block at the top of every app screen. */
export function PageHeader({
  title,
  sub,
  action,
  back,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-7">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-ink/75 hover:text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {back.label}
        </Link>
      )}
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] font-semibold leading-tight tracking-tightish text-ink md:text-4xl">{title}</h1>
          {sub && <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink/75">{sub}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

export function Section({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** A bordered surface. Used for objects (a trip, a card, a form), not as page furniture. */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-ink/10 bg-white ${className}`}>{children}</div>;
}

const TAG_TONES = {
  neutral: "bg-ink/[0.06] text-ink/80",
  good: "bg-trail/10 text-trail",
  accent: "bg-terracotta/10 text-terracotta-dark",
  warn: "bg-amber/20 text-ink",
} as const;

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: keyof typeof TAG_TONES }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${TAG_TONES[tone]}`}>
      {children}
    </span>
  );
}

/**
 * A plain statement about what is and isn't live yet. This preview runs on
 * sample data with no partners connected; wherever that changes what the
 * traveller sees, one of these says so instead of faking a result.
 */
export function Notice({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex gap-3 rounded-xl border border-ink/10 bg-cream px-4 py-3.5 text-sm leading-relaxed text-ink/80 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="mt-0.5 shrink-0 text-ink/60" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 7.6v.4" />
      </svg>
      <div>
        {title && <p className="font-semibold text-ink">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[13px] leading-snug text-ink/65">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/20 px-6 py-10 text-center">
      <p className="font-serif text-xl font-semibold tracking-tightish text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink/70">{body}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** A full-width row that links somewhere: label, optional detail, chevron. */
export function LinkRow({ href, label, detail, icon }: { href: string; label: string; detail?: string; icon?: React.ReactNode }) {
  return (
    <Link href={href} className="group flex min-h-[56px] items-center gap-3.5 border-b border-ink/10 px-1 py-3 last:border-b-0 hover:bg-ink/[0.03]">
      {icon && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink/80">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {detail && <span className="block truncate text-[13px] text-ink/65">{detail}</span>}
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

/** An on/off switch backed by a real checkbox. */
export function Toggle({
  id,
  label,
  detail,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  detail?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 border-b border-ink/10 py-3 last:border-b-0">
      <span className="min-w-0">
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {detail && <span className="block text-[13px] leading-snug text-ink/65">{detail}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="h-7 w-12 rounded-full bg-ink/20 transition-colors peer-checked:bg-trail peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta-dark" />
        <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
