import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OurStory } from "@/components/OurStory";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";
import { story } from "@/content/story";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <OurStory />
    </ThemeProvider>,
  );
}

describe("OurStory", () => {
  it("renders every story paragraph", () => {
    mount();
    expect(
      screen.getByText(/Aling Nene started cooking for the neighbourhood/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Today the kitchen is run by/)).toBeInTheDocument();
  });

  it("shows a visible placeholder banner while unconfirmed", () => {
    mount();
    // story.paragraphs[0] also contains the word "Placeholder", so target the
    // banner by its own distinctive copy rather than a bare /placeholder/i match.
    expect(screen.getByText(/Placeholder — nothing here is confirmed/i)).toBeInTheDocument();
  });

  it("lists all questions for the family", () => {
    mount();
    for (const q of story.questionsForFamily) {
      expect(screen.getByText(q)).toBeInTheDocument();
    }
  });
});
