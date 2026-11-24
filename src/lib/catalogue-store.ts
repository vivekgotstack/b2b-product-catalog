import { get, put } from "@vercel/blob";
import { cache } from "react";
import { company } from "@/config/company";
import { categories, products } from "@/data/products";
import { catalogueSchema, type Catalogue } from "@/lib/catalogue-schema";

const catalogueKey = "bulkout/catalogue.json";

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

export const readCatalogue = cache(async () => {
  if (!catalogueStorageConnected()) return { data: starter, revision: null };
  const result = await get(catalogueKey, { access: "private", useCache: false });
  if (!result) return { data: starter, revision: null };
  if (result.statusCode !== 200) throw new Error("Could not read the published catalogue.");
  const data = catalogueSchema.parse(await new Response(result.stream).json());
  return { data, revision: result.blob.etag };
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
