import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface SharedProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

interface ButtonAsButton
  extends SharedProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

interface ButtonAsLink extends SharedProps {
  href: string;
}

type Props = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-150 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-dark disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // terracotta-dark gives bone text ~6:1 contrast; plain terracotta falls just
  // short at this text size, so the darker shade is the button default.
  primary: "bg-terracotta-dark text-bone hover:bg-[#7c3016]",
  secondary:
    "bg-transparent text-ink border border-ink/30 hover:border-ink/60",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

export default function Button(props: Props) {
  const { variant = "primary", children, className = "" } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  // Strip the props Button already consumed above (variant, className,
  // children) before spreading the rest — otherwise an explicitly-passed
  // className (even "") rides along in the spread and overwrites the
  // merged `classes` string, silently dropping base + variant styles.
  const {
    href: _href,
    variant: _variant,
    className: _className,
    children: _children,
    ...buttonProps
  } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
