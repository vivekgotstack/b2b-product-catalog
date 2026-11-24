import { Phone } from "lucide-react";
import Link from "next/link";
import { EnquiryButton } from "@/components/enquiry-button";
import { ProductCardMedia } from "@/components/product-card-media";
import { Button } from "@/components/ui/button";
import type { Company, Product } from "@/lib/catalogue-schema";
import { productPath } from "@/lib/catalogue";
import { phoneHref } from "@/lib/contact";

export function ProductCard({ product, company, category }: { product: Product; company: Company; category: string }) {
  const { name, slug, specifications, images } = product;
  const path = productPath(slug);
  const phone = phoneHref(company);
  const leadSpecs = Object.entries(specifications).slice(0, 3);

  return (
    <article className="product-card">
      <ProductCardMedia href={path} name={name} images={images} />
      <div className="product-card-body">
        <p className="product-category">{category}</p>
        <h3><Link href={path} prefetch={false}>{name}</Link></h3>
        {leadSpecs.length > 0 && (
          <dl className="product-card-specs">
            {leadSpecs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        )}
        <div className="product-card-actions">
          <Button asChild variant="outline" size="sm" className="grow">
            <Link href={path} prefetch={false} aria-label={`View details for ${name}`}>Details</Link>
          </Button>
          {(!phone || company.email || company.whatsappNumber) && (
            <EnquiryButton company={company} product={product} label="Enquire" className="grow" variant={phone ? "outline" : "default"} compact />
          )}
          {phone && (
            <Button asChild size="sm" className="grow">
              <a href={phone} aria-label={`Call sales about ${name}`}>
                <Phone size={16} aria-hidden="true" />Call
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
