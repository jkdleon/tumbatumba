"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard blocked — the value is still visible to copy by hand */
        }
      }}
      className={
        "pop rounded-full bg-yellow px-3 py-1 font-display text-xs font-bold text-on-bright " +
        "transition-transform active:translate-x-0.5 active:translate-y-0.5 " +
        className
      }
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
