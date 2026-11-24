import type { ReactNode } from "react";
import { Footer, Header } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { catalogueDescription } from "@/config/company";
import { absoluteUrl } from "@/lib/catalogue";
import { readCatalogue } from "@/lib/catalogue-store";

export const dynamic = "force-dynamic";

export default async function CatalogueLayout({ children }: { children: ReactNode }) {
  const { data: { company } } = await readCatalogue();
  return (
    <>
      {company.name && company.siteUrl && (
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Organization",
            "@id": absoluteUrl("/#organization", company.siteUrl),
          name: company.name,
            url: absoluteUrl("/", company.siteUrl),
            logo: absoluteUrl(company.logoPath ?? "/icon.svg", company.siteUrl),
            description: company.description ?? catalogueDescription,
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
