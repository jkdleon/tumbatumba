import { Fragment, type ReactNode } from "react";

/**
 * Infinite ticker. Content is duplicated once for a seamless loop; the copy is
 * aria-hidden so screen readers hear it a single time.
 */
export function Marquee({
  items,
  className = "",
  reverse = false,
  separator = "✦",
}: {
  items: ReactNode[];
  className?: string;
  reverse?: boolean;
  separator?: ReactNode;
}) {
  const row = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10"
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap">{item}</span>
          <span aria-hidden="true" className="opacity-70">
            {separator}
          </span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${reverse ? "motion-safe:animate-marquee-reverse" : "motion-safe:animate-marquee"} hover:[animation-play-state:paused]`}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
