import { get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { company, environmentContactPhone } from "@/config/company";
import { categories, products } from "@/data/products";
import { catalogueSchema, type Catalogue } from "@/lib/catalogue-schema";

const catalogueKey = "bulkout/catalogue.json";
export const catalogueCacheTag = "bulkout-published-catalogue";

const starter: Catalogue = {
  company,
  banner: {
    title: "Clothing for",
    accent: "bulk orders.",
    description: "Browse apparel by category, compare specifications and request a quote from sales.",
  },
  categories: [...categories],
  products: [...products],
};

export function catalogueStorageConnected() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export async function readCatalogueForEditing() {
  if (!catalogueStorageConnected()) return { data: starter, revision: null };
  const result = await get(catalogueKey, { access: "private", useCache: false });
  if (!result) return { data: starter, revision: null };
  if (result.statusCode !== 200) throw new Error("Could not read the published catalogue.");
  const data = catalogueSchema.parse(await new Response(result.stream).json());
  return { data, revision: result.blob.etag };
}

const readCachedCatalogue = unstable_cache(
  readCatalogueForEditing,
  ["bulkout-catalogue-v1"],
  { tags: [catalogueCacheTag], revalidate: 3600 },
);

export const readCatalogue = cache(async () => {
  const snapshot = await (catalogueStorageConnected() ? readCachedCatalogue() : readCatalogueForEditing());
  const phone = snapshot.data.company.phone ?? environmentContactPhone();
  if (phone === snapshot.data.company.phone) return snapshot;

  return {
    ...snapshot,
    data: { ...snapshot.data, company: { ...snapshot.data.company, phone } },
  };
});

export async function writeCatalogue(data: Catalogue, revision: string | null) {
  return put(catalogueKey, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: revision !== null,
    ...(revision && { ifMatch: revision }),
  });
}

export function storePhoto(file: string, bytes: ArrayBuffer, contentType: string) {
  return put(`bulkout/media/${file}`, bytes, { access: "private", contentType });
}

export function readPhoto(file: string) {
  if (!catalogueStorageConnected()) return null;
  return get(`bulkout/media/${file}`, { access: "private" });
}
