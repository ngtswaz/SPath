export const STEPS = [
  {
    title: "Take the quiz",
    body: "Nine statements, scored one to five. It works out how you like to travel, not which box you belong in.",
  },
  {
    title: "Tell us the trip",
    body: "Where, when, how much, and how full you want the days. Add the points and miles you already have.",
  },
  {
    title: "Get a plan with options",
    body: "A day by day itinerary built around your scores and budget, with a few alternatives for every slot.",
  },
  {
    title: "Use what you already have",
    body: "We flag where a card benefit or your points make a slot cheaper, and check the visa for your best passport.",
  },
];

/** The four steps are a real sequence, so they are numbered. */
export default function Steps({ className = "" }: { className?: string }) {
  return (
    <ol className={`grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {STEPS.map((s, i) => (
        <li key={s.title} className="border-t-2 border-ink pt-4">
          <span className="font-mono text-sm font-bold text-terracotta-dark">{i + 1}</span>
          <h3 className="mt-2 font-serif text-xl font-semibold tracking-tightish text-ink">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
