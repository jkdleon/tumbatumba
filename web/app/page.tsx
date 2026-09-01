import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { carinderia } from "@/theme/carinderia";

export const metadata: Metadata = {
  title: "Crispy pata & pancit by the bilao in Mandaluyong",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <LandingPage theme={carinderia} />;
}
