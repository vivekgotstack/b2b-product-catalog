import type { MetadataRoute } from "next";
import { productPath, siteUrl } from "@/lib/catalogue";
import { readCatalogue } from "@/lib/catalogue-store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: { company, products } } = await readCatalogue();
  const base = siteUrl(company.siteUrl);
  if (!base) return [];

  return ["/", ...products.map(({ slug }) => productPath(slug))].map((path) => ({
    url: new URL(path, base).href,
  }));
}
