import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { heritage } from "@/theme/heritage";

export const metadata: Metadata = {
  title: "A Mandaluyong institution — crispy pata since the neighbourhood knew her",
  alternates: { canonical: "/heritage" },
};

export default function HeritagePage() {
  return <LandingPage theme={heritage} />;
}
