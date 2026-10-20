import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { preload } from "react-dom";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GridOverlay } from "@/components/layout/GridOverlay";
import "./globals.css";

// Archivo, instanced to the ranges the design uses (weight 400 to 800, width 100% to 125%)
// and subset to Latin: about 52 KB for every heading on the site.
const archivo = localFont({
  src: "../fonts/archivo-display.woff2",
  variable: "--font-archivo",
  weight: "400 800",
  style: "normal",
  // The headline is the design. "block" waits briefly for this small, preloaded file
  // instead of painting in Arial and re-painting, which also keeps the largest paint single.
  display: "block",
  preload: true,
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: design and engineering studio`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.legalName,
    title: `${site.name}: ideas, given their final form`,
    description: site.description,
    url: "/",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ideas, given their final form`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e7e8e3",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.legalName,
  url: site.url,
  email: site.email,
  description: site.description,
  slogan: site.tagline,
  address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.country },
  areaServed: "Worldwide",
  sameAs: site.socials.map((s) => s.href),
  knowsAbout: ["Web design", "Web development", "E-commerce", "UX design", "Frontend performance"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Newsreader is declared in globals.css so only the roman face is preloaded;
  // the italic loads on demand. Both are instanced and subset to about 50 KB each.
  preload("/fonts/newsreader-text-normal-v1.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="en-GB" className={archivo.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <GridOverlay />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
