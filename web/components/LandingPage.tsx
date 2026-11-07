import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { TapeStrip } from "@/components/TapeStrip";
import { SignatureDishes } from "@/components/SignatureDishes";
import { Method } from "@/components/Method";
import { MenuBoard } from "@/components/MenuBoard";
import { BarkadaPlanner } from "@/components/BarkadaPlanner";
import { SocialFeed } from "@/components/SocialFeed";
import { OurStory } from "@/components/OurStory";
import { VisitOrder } from "@/components/VisitOrder";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyOrderBar } from "@/components/StickyOrderBar";
import { ScrollReveal } from "@/components/ScrollReveal";

export function LandingPage() {
  return (
    <>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to the menu
      </a>
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <TapeStrip />
        <SignatureDishes />
        <Method />
        <MenuBoard />
        <BarkadaPlanner />
        <SocialFeed />
        <OurStory />
        <VisitOrder />
      </main>
      <SiteFooter />
      <StickyOrderBar />
      <ScrollReveal />
    </>
  );
}
