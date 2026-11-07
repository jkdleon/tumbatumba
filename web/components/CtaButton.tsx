import type { AnchorHTMLAttributes } from "react";

export type CtaVariant = "chili" | "cream" | "ink" | "butter";

export interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: CtaVariant;
  href: string;
}

export const CTA_BASE =
  "pop inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 " +
  "font-display text-base font-bold leading-none tracking-tight " +
  "transition-[transform,box-shadow] duration-150 " +
  "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-ink)] " +
  "active:translate-x-1 active:translate-y-1 active:shadow-none";

export const CTA_VARIANTS: Record<CtaVariant, string> = {
  chili: "bg-chili text-cream",
  cream: "bg-cream text-ink",
  ink: "bg-ink text-cream",
  butter: "bg-butter text-ink",
};

export function CtaButton({
  variant = "chili",
  href,
  className = "",
  children,
  ...rest
}: CtaButtonProps) {
  return (
    <a href={href} className={`${CTA_BASE} ${CTA_VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
