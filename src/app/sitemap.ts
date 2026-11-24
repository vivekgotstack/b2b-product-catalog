import type { MetadataRoute } from "next";
import { company } from "@/config/company";
import { products } from "@/data/products";
import { productPath } from "@/lib/catalogue";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl, name } = company;
  if (!siteUrl || !name) return [];

  return ["/", ...products.map(({ slug }) => productPath(slug))].map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
