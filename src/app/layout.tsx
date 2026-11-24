import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/inter/wght.css";
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
        {children}
      </body>
    </html>
  );
}
