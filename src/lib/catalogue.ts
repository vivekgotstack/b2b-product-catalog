import { company } from "@/config/company";

export function productPath(slug: string) {
  return `/products/${slug}/`;
}

export function absoluteUrl(path: string) {
  return company.siteUrl ? new URL(path, company.siteUrl).href : undefined;
}
