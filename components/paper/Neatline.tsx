/**
 * The graduated border every printed chart has: a hairline, a band of
 * alternating dark and light blocks, another hairline. Sized by its parent
 * (position it with `className`), so it frames a whole screen or one panel
 * equally well.
 */
export default function Neatline({ className = "" }: { className?: string }) {
  const band = "rgba(38,32,27,.8)";
  const horizontal = `repeating-linear-gradient(90deg, ${band} 0 14px, transparent 14px 28px)`;
  const vertical = `repeating-linear-gradient(180deg, ${band} 0 14px, transparent 14px 28px)`;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <div className="absolute inset-0 border border-ink" />
      <div className="absolute inset-x-[2px] top-[2px] h-[3px]" style={{ background: horizontal }} />
      <div className="absolute inset-x-[2px] bottom-[2px] h-[3px]" style={{ background: horizontal }} />
      <div className="absolute inset-y-[2px] left-[2px] w-[3px]" style={{ background: vertical }} />
      <div className="absolute inset-y-[2px] right-[2px] w-[3px]" style={{ background: vertical }} />
      <div className="absolute inset-[6px] border border-ink" />
    </div>
  );
}
