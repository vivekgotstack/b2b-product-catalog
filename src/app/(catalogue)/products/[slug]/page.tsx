import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { EnquiryButton } from "@/components/enquiry-button";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { absoluteUrl, productPath } from "@/lib/catalogue";
import { readCatalogue } from "@/lib/catalogue-store";
import { enquiryEmail, phoneHref, whatsappEnquiry } from "@/lib/contact";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";

export async function generateStaticParams() {
  const { data: { products } } = await readCatalogue();
  return products.slice(0, 12).map(({ slug }) => ({ slug }));
}

async function readProduct(slug: string) {
  const { data: { company, categories, products } } = await readCatalogue();
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return { company, product, category: categories.find((item) => item.slug === product.category)?.name ?? product.category };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company, product } = await readProduct((await params).slug);
  const url = absoluteUrl(productPath(product.slug), company.siteUrl);
  const image = absoluteUrl(product.images[0].src, company.siteUrl);

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      siteName: company.name,
      url,
      images: image ? [{ url: image, alt: product.images[0].alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { company, product, category } = await readProduct((await params).slug);
  const email = enquiryEmail(company, product);
  const whatsapp = whatsappEnquiry(company, product);
  const phone = phoneHref(company);

  return (
    <main id="main-content" className="container-shell product-page">
      <Link href="/#catalogue" className="back-link"><ChevronLeft size={18} aria-hidden="true" />Catalogue</Link>
      {company.siteUrl && (
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          category,
          url: absoluteUrl(productPath(product.slug), company.siteUrl),
          image: product.images.map(({ src }) => absoluteUrl(src, company.siteUrl)),
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
          <p>{product.description}</p>
          <h2>Specifications</h2>
          <dl className="spec-table">
            {Object.entries(product.specifications).map(([name, value]) => (
              <div key={name}><dt>{name}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <section className="product-contact" aria-labelledby="product-contact-title">
            <h2 id="product-contact-title">Request a bulk quote</h2>
            <p>Include your quantity, sizes and delivery location.</p>
            <div className="product-contact-actions">
              {phone && <Button asChild><a href={phone}><Phone size={17} aria-hidden="true" />Call {company.phone?.display}</a></Button>}
              {email && <Button asChild variant={phone ? "outline" : "default"}><a href={email}><Mail size={17} aria-hidden="true" />Email enquiry</a></Button>}
              {whatsapp && <Button asChild variant="whatsapp"><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></Button>}
              {!email && !phone && !whatsapp && <EnquiryButton company={company} product={product} label="Contact sales" />}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
