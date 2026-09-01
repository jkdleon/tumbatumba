"use client";

import type { Theme } from "@/theme/tokens";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { SignatureDishes } from "@/components/SignatureDishes";
import { SocialProof } from "@/components/SocialProof";
import { MenuBoard } from "@/components/MenuBoard";
import { OurStory } from "@/components/OurStory";
import { VisitOrder } from "@/components/VisitOrder";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyOrderBar } from "@/components/StickyOrderBar";

export function LandingPage({ theme }: { theme: Theme }) {
  return (
    <ThemeProvider theme={theme}>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-ink-invert"
      >
        Skip to the menu
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <SignatureDishes />
        <SocialProof />
        <MenuBoard />
        <OurStory />
        <VisitOrder />
      </main>
      <SiteFooter />
      <StickyOrderBar />
    </ThemeProvider>
  );
}
