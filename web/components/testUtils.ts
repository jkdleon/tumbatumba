import { afterEach, beforeEach, vi } from "vitest";

/** Freeze time (inside opening hours, Manila) and stub IntersectionObserver. */
export function setupLandingEnv() {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T05:00:00Z")); // 1 PM Manila
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
}
