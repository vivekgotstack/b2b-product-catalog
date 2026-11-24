import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/catalogue";
import { readCatalogue } from "@/lib/catalogue-store";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { data: { company } } = await readCatalogue();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login"] },
    sitemap: absoluteUrl("/sitemap.xml", company.siteUrl),
  };
}
