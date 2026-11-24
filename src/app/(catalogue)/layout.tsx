import type { ReactNode } from "react";
import { Footer, Header } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { catalogueDescription, company } from "@/config/company";
import { absoluteUrl } from "@/lib/catalogue";

export default function CatalogueLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {company.name && company.siteUrl && (
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": absoluteUrl("/#organization"),
          name: company.name,
          url: absoluteUrl("/"),
          logo: absoluteUrl(company.logoPath ?? "/icon.svg"),
          description: catalogueDescription,
          address: company.location ?? undefined,
          email: company.email ?? undefined,
          telephone: company.phone?.international,
        }} />
      )}
      <Header />
      {children}
      <Footer />
    </>
  );
}
