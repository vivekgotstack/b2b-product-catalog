import { Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enquiryEmail, phoneHref, whatsappEnquiry, type EnquiryProduct } from "@/lib/contact";

export function EnquiryButton({ product, label, className, compact }: {
  product?: EnquiryProduct;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  const email = enquiryEmail(product);
  const whatsapp = whatsappEnquiry(product);
  const href = email ?? whatsapp ?? phoneHref ?? "/#contact";
  const external = !email && Boolean(whatsapp);
  const Icon = email ? Mail : !whatsapp && phoneHref ? Phone : MessageCircle;

  return (
    <Button asChild size={compact ? "sm" : "default"} className={className}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={product ? `${label} about ${product.name}${external ? " (opens in a new tab)" : ""}` : undefined}
      >
        <Icon size={16} aria-hidden="true" />
        {label}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    </Button>
  );
}
