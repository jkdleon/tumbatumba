import type { AnchorHTMLAttributes } from "react";

export type CtaVariant = "solid" | "ghost";

export interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: CtaVariant;
  href: string;
}

const BASE =
  "inline-flex items-center justify-center rounded-theme px-5 py-3 text-base font-semibold " +
  "transition-transform duration-[var(--t-motion-fast)] motion-safe:active:scale-[0.97] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const VARIANTS: Record<CtaVariant, string> = {
  solid: "bg-accent text-ink-invert hover:bg-accent-strong",
  ghost: "border border-current text-accent hover:bg-accent/10",
};

export function CtaButton({
  variant = "solid",
  href,
  className = "",
  children,
  ...rest
}: CtaButtonProps) {
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
