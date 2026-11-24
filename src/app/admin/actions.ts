"use server";

import { BlobPreconditionFailedError } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { hasValidSession, sessionCookieName } from "@/lib/auth";
import { catalogueSchema } from "@/lib/catalogue-schema";
import { catalogueCacheTag, catalogueStorageConnected, storePhoto, writeCatalogue } from "@/lib/catalogue-store";

async function isAdmin() {
  return hasValidSession((await cookies()).get(sessionCookieName)?.value);
}

export async function publishCatalogue(draft: unknown, revision: string | null) {
  if (!(await isAdmin())) return { error: "Your session expired. Sign in and try again." };
  if (!catalogueStorageConnected()) return { error: "Connect a private Vercel Blob store to publish changes." };
  if (revision !== null && (typeof revision !== "string" || revision.length > 150)) return { error: "Reload the editor and try again." };

  const parsed = catalogueSchema.safeParse(draft);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first.path.join(" › ");
    return { error: path ? `${path}: ${first.message}` : first.message };
  }

  try {
    const version = await writeCatalogue(parsed.data, revision);
    updateTag(catalogueCacheTag);
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
    return { revision: version.etag, data: parsed.data };
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) return { error: "Someone published a newer version. Reload the editor before publishing." };
    return { error: "The catalogue could not be saved. Check the storage connection and try again." };
  }
}

export async function uploadCataloguePhoto(form: FormData) {
  if (!(await isAdmin())) return { error: "Your session expired. Sign in and try again." };
  if (!catalogueStorageConnected()) return { error: "Connect a private Vercel Blob store to upload photos." };

  const file = form.get("photo");
  if (!(file instanceof File) || file.size === 0 || file.size > 800_000) return { error: "Choose a valid image under 800 KB after compression." };

  const bytes = await file.arrayBuffer();
  const header = Buffer.from(bytes, 0, Math.min(bytes.byteLength, 12));
  const type = header.toString("ascii", 0, 4) === "RIFF" && header.toString("ascii", 8, 12) === "WEBP"
    ? { ext: "webp", mime: "image/webp" }
    : header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff
      ? { ext: "jpg", mime: "image/jpeg" }
      : header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        ? { ext: "png", mime: "image/png" }
        : null;
  if (!type) return { error: "Upload a WebP, JPEG or PNG image." };

  const filename = `${randomUUID()}.${type.ext}`;
  try {
    await storePhoto(filename, bytes, type.mime);
    return { src: `/media/${filename}/` };
  } catch {
    return { error: "The photo could not be saved. Check the storage connection and try again." };
  }
}
