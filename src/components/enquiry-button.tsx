import { Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enquiryEmail, phoneHref, whatsappEnquiry, type EnquiryProduct } from "@/lib/contact";
import type { Company } from "@/lib/catalogue-schema";

export function EnquiryButton({ company, product, label, className, compact, variant }: {
  company: Company;
  product?: EnquiryProduct;
  label: string;
  className?: string;
  compact?: boolean;
  variant?: "default" | "outline";
}) {
  const email = enquiryEmail(company, product);
  const whatsapp = whatsappEnquiry(company, product);
  const phone = phoneHref(company);
  const href = email ?? whatsapp ?? phone ?? "/#contact";
  const external = !email && Boolean(whatsapp);
  const Icon = email ? Mail : !whatsapp && phone ? Phone : MessageCircle;

  return (
    <Button asChild size={compact ? "sm" : "default"} className={className} variant={variant}>
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
