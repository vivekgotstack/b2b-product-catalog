import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryName, type Product } from "@/data/products";
import { productPath } from "@/lib/catalogue";
import { enquiryEmail, whatsappEnquiry } from "@/lib/contact";

export function ProductCard({ product }: { product: Product }) {
  const { name, slug, category, specifications, images } = product;
  const path = productPath(slug);
  const email = enquiryEmail(product);
  const whatsapp = whatsappEnquiry(product);
  const leadSpecs = Object.entries(specifications).slice(0, 3);

  return (
    <article className="product-card">
      <a href={path} tabIndex={-1} aria-hidden="true" className="product-card-image">
        <Image src={images[0].src} alt="" fill />
      </a>
      <div className="product-card-body">
        <p className="product-category">{categoryName(category)}</p>
        <h3><a href={path}>{name}</a></h3>
        {leadSpecs.length > 0 && (
          <dl className="product-card-specs">
            {leadSpecs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        )}
        <div className="product-card-actions">
          <Button asChild variant="outline" size="sm" className="grow">
            <a href={path} aria-label={`View details for ${name}`}>View details</a>
          </Button>
          {email ? (
            <Button asChild size="sm" className="grow">
              <a href={email} aria-label={`Email an enquiry about ${name}`}><Mail size={16} aria-hidden="true" />Enquire</a>
            </Button>
          ) : whatsapp && (
            <Button asChild size="sm" className="grow">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`Enquire about ${name} on WhatsApp (opens in a new tab)`}>
                <MessageCircle size={16} aria-hidden="true" />Enquire
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
