import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/inter/wght.css";
import { Footer, Header } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { catalogueDescription, catalogueTitle, company } from "@/config/company";
import { absoluteUrl } from "@/lib/catalogue";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: company.siteUrl ? new URL(company.siteUrl) : undefined,
  title: { default: `${catalogueTitle} | Wholesale Clothing`, template: `%s | ${catalogueTitle}` },
  description: catalogueDescription,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: catalogueTitle,
    title: `${catalogueTitle} | Wholesale Clothing`,
    description: catalogueDescription,
    url: absoluteUrl("/"),
    images: company.socialImagePath ? absoluteUrl(company.socialImagePath) : undefined,
  },
  twitter: { card: company.socialImagePath ? "summary_large_image" : "summary" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {company.name && company.siteUrl && (
          <StructuredData data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": absoluteUrl("/#organization"),
            name: company.name,
            url: absoluteUrl("/"),
            logo: company.logoPath ? absoluteUrl(company.logoPath) : undefined,
            description: catalogueDescription,
            address: company.location ?? undefined,
            email: company.email ?? undefined,
            telephone: company.phone?.international,
          }} />
        )}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
