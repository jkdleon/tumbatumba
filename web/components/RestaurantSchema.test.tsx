import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { RestaurantSchema } from "@/components/RestaurantSchema";

describe("RestaurantSchema", () => {
  it("emits valid Restaurant JSON-LD with the confirmed data", () => {
    const { container } = render(<RestaurantSchema />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const data = JSON.parse(script.textContent!);
    expect(data["@type"]).toBe("Restaurant");
    expect(data.name).toBe("Aling Nene's Tumba Tumba Crispy Pata");
    expect(data.telephone).toBe("+63-2-8570-8560");
    expect(data.address.streetAddress).toBe("823 General Kalentong Street");
    expect(data.openingHoursSpecification[0].opens).toBe("09:00");
    expect(data.openingHoursSpecification[0].closes).toBe("22:00");
    expect(data.sameAs).toContain("https://www.facebook.com/alingnenetumbatumba");
  });
});
