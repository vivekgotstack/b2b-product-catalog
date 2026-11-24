export type Category = {
  slug: string;
  name: string;
};

export type ProductImage = {
  src: `/images/products/${string}`;
  alt: string;
};

type ProductImages =
  | readonly [ProductImage, ProductImage, ProductImage]
  | readonly [ProductImage, ProductImage, ProductImage, ProductImage];

export type Product = {
  slug: string;
  name: string;
  sku: string;
  category: Category["slug"];
  description: string;
  specifications: Readonly<Record<string, string>>;
  images: ProductImages;
};

export const categories: readonly Category[] = [];

export const products: readonly Product[] = [];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function categoryName(slug: Category["slug"]) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}
