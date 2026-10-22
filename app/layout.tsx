import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cormorant, manrope } from "./fonts";
import { SITE } from "@/lib/utils";
import { ambianceBootScript, ambianceCss, DEFAULT_LIGHT, DEFAULT_SEASON } from "@/data/ambiances";
import { InlineScript } from "@/components/ambiance/InlineScript";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { AmbianceVeil } from "@/components/ambiance/AmbianceVeil";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Maison Sillage — Des saveurs qui traversent le temps",
    template: "%s · Maison Sillage",
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: "Maison Sillage — Des saveurs qui traversent le temps",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1e140d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${manrope.variable}`}
      data-season={DEFAULT_SEASON}
      data-light={DEFAULT_LIGHT}
      data-ambiance-mode="manuel"
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={ambianceBootScript()} />
        <style dangerouslySetInnerHTML={{ __html: ambianceCss() }} />
      </head>
      <body>
        <Providers>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <AmbianceVeil />
        </Providers>
      </body>
    </html>
  );
}
