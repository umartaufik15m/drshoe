import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyWhatsAppButton } from "@/components/layout/StickyWhatsAppButton";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "DR. SHOE - Shoes Laundry & Treatment Bekasi",
  description:
    "Layanan cuci dan perawatan sepatu profesional di Bekasi. Tersedia Fast Clean, Deep Clean, Extra Dirty, Repaint, Unyellowing, drop point, dan peluang franchise.",
  keywords: [
    "cuci sepatu bekasi",
    "laundry sepatu bekasi",
    "shoe cleaning bekasi",
    "dr shoe",
    "shoes treatment",
    "franchise cuci sepatu"
  ],
  openGraph: {
    title: "DR. SHOE - Clean Your Shoes With Our Special Treatment",
    description: "Shoes Laundry & Treatment profesional di Bekasi.",
    images: ["/og-image.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <StickyWhatsAppButton />
      </body>
    </html>
  );
}
