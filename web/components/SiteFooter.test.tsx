import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/SiteFooter";

describe("SiteFooter", () => {
  it("shows the restaurant name and address", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Aling Nene's Tumba Tumba Crispy Pata/)).toBeInTheDocument();
    expect(screen.getByText(/823 General Kalentong Street/)).toBeInTheDocument();
  });

  it("links the landline and Facebook", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /8570 8560/ })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
    expect(screen.getByRole("link", { name: /facebook/i })).toHaveAttribute(
      "href",
      "https://www.facebook.com/alingnenetumbatumba",
    );
  });

  it("shows the current year and the family credit", () => {
    render(<SiteFooter />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
    expect(screen.getByText(/Site by the family/)).toBeInTheDocument();
  });
});
