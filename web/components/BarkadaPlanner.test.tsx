import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BarkadaPlanner } from "@/components/BarkadaPlanner";

const total = () => screen.getByLabelText("Your order estimate").textContent ?? "";

describe("BarkadaPlanner", () => {
  it("starts at 8 people with a large bilao and one XL crispy pata", () => {
    render(<BarkadaPlanner />);
    expect(total()).toContain("Large Bilao — Bihon");
    expect(total()).toContain("Crispy Pata (XL)");
    expect(total()).toContain("₱1,520");
  });

  it("re-sizes the bilao when the head-count changes", () => {
    render(<BarkadaPlanner />);
    fireEvent.change(screen.getByLabelText("Number of people"), { target: { value: "16" } });
    expect(total()).toContain("XL Bilao — Bihon");
    expect(total()).toContain("Small Bilao — Bihon");
  });

  it("applies the +₱50 noodle surcharge and preset buttons", () => {
    render(<BarkadaPlanner />);
    fireEvent.click(screen.getByRole("button", { name: /squad · 4/i }));
    fireEvent.click(screen.getByLabelText(/canton \+₱50/i));
    expect(total()).toContain("Small Bilao — Canton");
    expect(total()).toContain("₱400");
  });

  it("adds and removes add-ons with the steppers", () => {
    render(<BarkadaPlanner />);
    fireEvent.click(screen.getByRole("button", { name: "Add one Sisig" }));
    expect(total()).toContain("Sisig");
    fireEvent.click(screen.getByRole("button", { name: "Remove one Sisig" }));
    expect(total()).not.toContain("Sisig");
  });

  it("hands the slip off by SMS to the mobile and by Messenger", () => {
    render(<BarkadaPlanner />);
    const sms = screen.getByRole("link", { name: /text it/i });
    expect(sms.getAttribute("href")).toMatch(/^sms:\+639325147741\?body=/);
    expect(decodeURIComponent(sms.getAttribute("href")!)).toContain("Estimated total: ₱1,520");
    const msg = screen.getByRole("link", { name: /open messenger/i });
    expect(msg).toHaveAttribute("href", "https://m.me/alingnenetumbatumba");
    expect(msg).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
