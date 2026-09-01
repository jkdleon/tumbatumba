import { describe, expect, it } from "vitest";
import { story } from "@/content/story";

describe("story content", () => {
  it("is flagged unconfirmed", () => {
    expect(story.confirmed).toBe(false);
  });

  it("carries the five questions for the family", () => {
    expect(story.questionsForFamily).toHaveLength(5);
  });

  it("keeps the bracketed placeholder markers in the copy", () => {
    const joined = story.paragraphs.join("\n");
    expect(joined).toContain("[Placeholder");
    expect(joined).toContain("[the rocking chair / the story you'll tell us]");
    expect(joined).toContain("[or however many]");
    expect(joined).toContain("[names, roles]");
    expect(joined).toContain("—"); // em-dash must not be downgraded to a hyphen
  });
});
