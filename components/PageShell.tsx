import { ReactNode } from "react";

export default function PageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 pb-24 pt-36">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-terracotta-dark">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-4xl leading-tight tracking-tightish text-ink md:text-5xl">
        {title}
      </h1>
      {lede && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">
          {lede}
        </p>
      )}
      <div className="mt-14">{children}</div>
    </main>
  );
}
