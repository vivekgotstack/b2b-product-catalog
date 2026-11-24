import { Suspense, type ReactNode } from "react";
import { Footer, Header } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { catalogueDescription } from "@/config/company";
import { absoluteUrl } from "@/lib/catalogue";
import { readCatalogue } from "@/lib/catalogue-store";

export const revalidate = 3600;

async function CatalogueOrganization() {
  const { data: { company } } = await readCatalogue();
  if (!company.siteUrl) return null;

  return (
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
  );
}

export default function CatalogueLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}><CatalogueOrganization /></Suspense>
      <Suspense fallback={
        <div className="header-main" aria-hidden="true">
          <div className="container-shell header-inner">
            <div className="catalogue-skeleton h-10 w-36" />
          </div>
        </div>
      }><Header /></Suspense>
      {children}
      <Suspense fallback={null}><Footer /></Suspense>
    </>
  );
}
