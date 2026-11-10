import { ReactNode } from "react";

/** Layout for the public pages: a title, a lede, then the page's own sections. */
export default function PageShell({
  title,
  lede,
  children,
}: {
  title: ReactNode;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-tightish text-ink md:text-6xl">
        {title}
      </h1>
      {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{lede}</p>}
      <div className="mt-12 md:mt-16">{children}</div>
    </main>
  );
}
