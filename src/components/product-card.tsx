import { EnquiryButton } from "@/components/enquiry-button";
import { ProductCardMedia } from "@/components/product-card-media";
import { Button } from "@/components/ui/button";
import type { Company, Product } from "@/lib/catalogue-schema";
import { productPath } from "@/lib/catalogue";

export function ProductCard({ product, company, category }: { product: Product; company: Company; category: string }) {
  const { name, slug, specifications, images } = product;
  const path = productPath(slug);
  const leadSpecs = Object.entries(specifications).slice(0, 3);

  return (
    <article className="product-card">
      <ProductCardMedia href={path} name={name} images={images} />
      <div className="product-card-body">
        <p className="product-category">{category}</p>
        <h3><a href={path}>{name}</a></h3>
        {leadSpecs.length > 0 && (
          <dl className="product-card-specs">
            {leadSpecs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        )}
        <div className="product-card-actions">
          <Button asChild variant="outline" size="sm" className="grow">
            <a href={path} aria-label={`View details for ${name}`}>Details</a>
          </Button>
          <EnquiryButton company={company} product={product} label="Enquire" className="grow" compact />
        </div>
      </div>
    </article>
  );
}
