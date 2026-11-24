import type { Metadata } from "next";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { CatalogueHero } from "@/components/catalogue-hero";
import { ContactSection } from "@/components/contact-section";
import { ProductCard } from "@/components/product-card";
import { absoluteUrl } from "@/lib/catalogue";
import { readCatalogue } from "@/lib/catalogue-store";

export async function generateMetadata(): Promise<Metadata> {
  const { data: { company } } = await readCatalogue();
  return { alternates: { canonical: absoluteUrl("/", company.siteUrl) } };
}

export default async function Home() {
  const { data: { company, banner, categories, products } } = await readCatalogue();
  const categoryNames = new Map(categories.map(({ slug, name }) => [slug, name]));

  return (
    <main id="main-content">
      <CatalogueHero banner={banner} products={products} />
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
              product.description,
              categoryNames.get(product.category),
              ...Object.entries(product.specifications).flat(),
            ].join(" ").toLowerCase(),
            card: <ProductCard product={product} company={company} category={categoryNames.get(product.category) ?? product.category} />,
          }))}
        />
      </section>
      <ContactSection company={company} />
    </main>
  );
}
