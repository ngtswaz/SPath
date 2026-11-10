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
  "inline-flex items-center justify-center gap-2 rounded-[3px] border-[1.5px] px-6 py-3 text-sm font-semibold transition-[color,background-color,transform,box-shadow] duration-150 min-h-[44px] active:translate-x-px active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-dark disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // terracotta-dark gives bone text ~6:1 contrast; plain terracotta falls just
  // short at this text size, so the darker shade is the button default.
  primary: "border-ink bg-terracotta-dark text-bone shadow-press hover:bg-[#7c3016]",
  secondary:
    "border-ink bg-bone/70 text-ink shadow-card hover:bg-sandstone/50",
  ghost: "border-transparent bg-transparent text-ink hover:bg-ink/5",
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
