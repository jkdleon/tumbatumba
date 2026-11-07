"use client";

import { useEffect, useRef, type ReactNode } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible popup: traps Tab focus, closes on Esc / backdrop / close button,
 * locks page scroll, and hands focus back to whatever opened it.
 */
export function VideoModal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-deep/85 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-full w-full max-w-fit flex-col items-center gap-3"
      >
        <div className="flex w-full items-center justify-between gap-4">
          <p className="font-display text-lg font-extrabold text-fg">{title}</p>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="pop grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fg font-display text-xl font-bold text-on-bright"
          >
            ✕
          </button>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}
