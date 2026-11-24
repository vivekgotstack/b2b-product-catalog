export function productPath(slug: string) {
  return `/products/${slug}/`;
}

export function siteUrl(configured: string | null) {
  return configured || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
}

export function absoluteUrl(path: string, configured: string | null) {
  const base = siteUrl(configured);
  return base ? new URL(path, base).href : undefined;
}
