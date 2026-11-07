import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { OurStory } from "@/components/OurStory";

describe("OurStory", () => {
  it("renders nothing while the family's copy is unconfirmed", () => {
    const { container } = render(<OurStory />);
    expect(container).toBeEmptyDOMElement();
  });
});
