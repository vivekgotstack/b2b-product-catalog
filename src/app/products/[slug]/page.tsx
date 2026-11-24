import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { catalogueTitle, company } from "@/config/company";
import { categoryName, getProduct, products } from "@/data/products";
import { absoluteUrl, productPath } from "@/lib/catalogue";
import { enquiryEmail, phoneHref, whatsappEnquiry } from "@/lib/contact";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // Next.js static export requires a parameter even when the catalogue is empty.
  return products.length ? products.map(({ slug }) => ({ slug })) : [{ slug: "__empty__" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const url = absoluteUrl(productPath(product.slug));
  const image = absoluteUrl(product.images[0].src);

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      siteName: catalogueTitle,
      url,
      images: image ? [{ url: image, alt: product.images[0].alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = categoryName(product.category);
  const email = enquiryEmail(product);
  const whatsapp = whatsappEnquiry(product);

  return (
    <main id="main-content" className="container-shell product-page">
      <a href="/#catalogue" className="back-link"><ChevronLeft size={18} aria-hidden="true" />Catalogue</a>
      {company.siteUrl && (
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          sku: product.sku,
          category,
          url: absoluteUrl(productPath(product.slug)),
          image: product.images.map(({ src }) => absoluteUrl(src)),
          brand: company.name ? { "@type": "Brand", name: company.name } : undefined,
          additionalProperty: Object.entries(product.specifications).map(([name, value]) => ({
            "@type": "PropertyValue", name, value,
          })),
        }} />
      )}
      <div className="product-detail-layout">
        <ProductGallery images={product.images} />
        <div className="product-summary">
          <p className="product-category">{category}</p>
          <h1>{product.name}</h1>
          <p className="sku">SKU {product.sku}</p>
          <p>{product.description}</p>
          <h2>Specifications</h2>
          <dl className="spec-table">
            {Object.entries(product.specifications).map(([name, value]) => (
              <div key={name}><dt>{name}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <div className="product-contact">
            {email && <Button asChild><a href={email}><Mail size={17} aria-hidden="true" />Email enquiry</a></Button>}
            {phoneHref && <Button asChild variant="outline"><a href={phoneHref}><Phone size={17} aria-hidden="true" />Call sales</a></Button>}
            {whatsapp && <Button asChild variant="whatsapp"><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></Button>}
          </div>
        </div>
      </div>
    </main>
  );
}
