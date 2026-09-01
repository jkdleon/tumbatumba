import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// next/font/google needs the Next compiler; stub it for jsdom tests.
vi.mock("next/font/google", () => {
  const stub = () => ({ variable: "", className: "", style: { fontFamily: "" } });
  return new Proxy({}, { get: () => stub });
});

// Render next/image as a plain <img> in tests.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => React.createElement("img", props),
}));
