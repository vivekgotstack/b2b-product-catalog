import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/inter/wght.css";
import { catalogueDescription } from "@/config/company";
import { absoluteUrl, siteUrl } from "@/lib/catalogue";
import { readCatalogue } from "@/lib/catalogue-store";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { data: { company } } = await readCatalogue();
  const base = siteUrl(company.siteUrl);
  const title = `${company.name} | Wholesale Clothing`;
  const description = company.description ?? catalogueDescription;
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: title, template: `%s | ${company.name}` },
    description,
    icons: { icon: company.logoPath ?? "/icon.svg" },
    openGraph: {
      type: "website",
      siteName: company.name,
      title,
      description,
      url: absoluteUrl("/", company.siteUrl),
      images: company.socialImagePath ? absoluteUrl(company.socialImagePath, company.siteUrl) : undefined,
    },
    twitter: { card: company.socialImagePath ? "summary_large_image" : "summary" },
  };
}

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
