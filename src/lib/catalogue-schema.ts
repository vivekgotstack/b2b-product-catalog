import { z } from "zod";

const slug = z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens for the URL.");
const label = z.string().trim().min(1).max(160);
const imagePath = z.string().regex(/^\/(?:images\/(?:products|brand)\/[\w/-]+\.(?:avif|jpe?g|png|webp|svg)|media\/[a-f0-9-]{36}\.(?:webp|jpg|png)\/?)$/i, "Use an existing or uploaded image.");
const optionalText = z.string().trim().min(1).max(4000).nullable();

const category = z.object({ slug, name: label });
const image = z.object({ src: imagePath, alt: z.string().trim().max(240) });
const product = z.object({
  slug,
  name: label,
  sku: label,
  category: slug,
  description: z.string().trim().min(1).max(4000),
  specifications: z.record(z.string().trim().min(1).max(120), z.string().trim().min(1).max(500)),
  images: z.array(image).min(1, "Add at least one photo.").max(4, "Use at most four photos."),
});

const company = z.object({
  name: label,
  description: optionalText,
  about: optionalText,
  siteUrl: z.url({ protocol: /^https?$/ }).nullable(),
  location: optionalText,
  logoPath: imagePath.nullable(),
  socialImagePath: imagePath.nullable(),
  phone: z.object({
    display: label,
    international: z.string().trim().regex(/^\+[1-9]\d{6,14}$/, "Enter the phone number with its international country code."),
  }).nullable(),
  whatsappNumber: z.string().trim().regex(/^[1-9]\d{6,14}$/, "Enter the WhatsApp number and country code using digits.").nullable(),
  email: z.email().nullable(),
});

export const catalogueSchema = z.object({
  company,
  banner: z.object({
    title: label,
    accent: z.string().trim().max(160),
    description: z.string().trim().min(1).max(500),
  }),
  categories: z.array(category).max(80),
  products: z.array(product).max(200),
}).superRefine(({ categories, products }, context) => {
  const categorySlugs = new Set<string>();
  for (const [index, item] of categories.entries()) {
    if (categorySlugs.has(item.slug)) context.addIssue({ code: "custom", path: ["categories", index, "slug"], message: "Category URLs must be unique." });
    categorySlugs.add(item.slug);
  }
  const productSlugs = new Set<string>();
  const skus = new Set<string>();
  for (const [index, item] of products.entries()) {
    if (!categorySlugs.has(item.category)) context.addIssue({ code: "custom", path: ["products", index, "category"], message: "Select an existing category." });
    if (productSlugs.has(item.slug)) context.addIssue({ code: "custom", path: ["products", index, "slug"], message: "Product URLs must be unique." });
    if (skus.has(item.sku.toLowerCase())) context.addIssue({ code: "custom", path: ["products", index, "sku"], message: "Product SKUs must be unique." });
    productSlugs.add(item.slug);
    skus.add(item.sku.toLowerCase());
  }
});

export type Catalogue = z.infer<typeof catalogueSchema>;
export type Company = Catalogue["company"];
export type Category = Catalogue["categories"][number];
export type Product = Catalogue["products"][number];
export type ProductImage = Product["images"][number];
