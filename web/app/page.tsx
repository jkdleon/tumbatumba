import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { carinderia } from "@/theme/carinderia";

export const metadata: Metadata = {
  // Root segment: title.template from layout is NOT applied here, so spell out
  // the brand suffix explicitly.
  title: {
    absolute: "Crispy pata & pancit by the bilao in Mandaluyong · Aling Nene's Tumba Tumba",
  },
  alternates: { canonical: "/" },
};

export default function Page() {
  return <LandingPage theme={carinderia} />;
}
