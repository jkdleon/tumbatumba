import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// next/font/google needs the Next compiler; stub it for jsdom tests.
vi.mock("next/font/google", () => {
  const stub = () => ({ variable: "", className: "", style: { fontFamily: "" } });
  return new Proxy({}, { get: () => stub });
});

// Render next/image as a plain <img> in tests, dropping the next/image-only
// props that are not valid DOM attributes on <img>.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const {
      priority: _priority,
      fill: _fill,
      loader: _loader,
      quality: _quality,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      unoptimized: _unoptimized,
      onLoadingComplete: _onLoadingComplete,
      ...imgProps
    } = props;
    return React.createElement("img", imgProps);
  },
}));
