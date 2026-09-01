import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Fraunces, Newsreader } from "next/font/google";
import { siteUrl } from "@/lib/siteUrl";
import { formatHours } from "@/lib/openNow";
import { restaurant } from "@/content/restaurant";
import { RestaurantSchema } from "@/components/RestaurantSchema";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aling Nene's Tumba Tumba Crispy Pata — Mandaluyong",
    template: "%s · Aling Nene's Tumba Tumba",
  },
  description: `Crispy pata, sisig, lengua asado, and pancit by the bilao. A family kitchen on General Kalentong Street, Mandaluyong. Open daily ${formatHours(restaurant.hours)}. Call to order — ${restaurant.phone.landlineDisplay}.`,
  openGraph: {
    type: "website",
    siteName: "Aling Nene's Tumba Tumba Crispy Pata",
    images: [{ url: "/logo.jpg", width: 1080, height: 1080 }],
  },
  twitter: { card: "summary" },
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
};

export const viewport: Viewport = { themeColor: "#a5211a" };

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const fontVars = [bricolage, inter, fraunces, newsreader].map((f) => f.variable).join(" ");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <RestaurantSchema />
        {children}
      </body>
    </html>
  );
}
