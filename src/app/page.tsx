import type { Metadata } from "next";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { CatalogueHero } from "@/components/catalogue-hero";
import { ContactSection } from "@/components/contact-section";
import { ProductCard } from "@/components/product-card";
import { categories, categoryName, products } from "@/data/products";
import { absoluteUrl } from "@/lib/catalogue";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default function Home() {
  return (
    <main id="main-content">
      <CatalogueHero />
      <section className="catalogue-section container-shell" id="catalogue" aria-labelledby="catalogue-title">
        <CatalogueBrowser
          categories={categories.map((category) => ({
            ...category,
            count: products.filter((product) => product.category === category.slug).length,
          }))}
          entries={products.map((product) => ({
            slug: product.slug,
            category: product.category,
            terms: [
              product.name,
              product.sku,
              product.description,
              categoryName(product.category),
              ...Object.entries(product.specifications).flat(),
            ].join(" ").toLowerCase(),
            card: <ProductCard product={product} />,
          }))}
        />
      </section>
      <ContactSection />
    </main>
  );
}
