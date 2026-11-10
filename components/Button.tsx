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
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold transition-colors duration-150 min-h-[46px] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // terracotta-dark gives bone text about 6:1 contrast; plain terracotta
  // falls just short at this text size, so the darker shade is the default.
  primary: "bg-terracotta-dark text-white hover:bg-terracotta-deep",
  secondary: "border border-ink/20 bg-white text-ink hover:border-ink/40",
  ghost: "bg-transparent text-ink hover:bg-ink/[0.06]",
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
