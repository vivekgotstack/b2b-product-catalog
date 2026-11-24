import { catalogueTitle, company } from "@/config/company";

type EnquiryProduct = { name: string; sku: string };

export const phoneHref = company.phone ? `tel:${company.phone.international}` : null;

export function enquiryEmail(product?: EnquiryProduct) {
  if (!company.email) return null;

  const subject = product ? `Enquiry for ${product.name} (${product.sku})` : "Bulk order enquiry";
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}`;
}

export function whatsappEnquiry(product?: EnquiryProduct) {
  if (!company.whatsappNumber) return null;

  const message = product
    ? `Hello ${catalogueTitle}, I would like a bulk quotation for ${product.name} (${product.sku}). Please share pricing, minimum order quantity and lead time.`
    : `Hello ${catalogueTitle}, I would like to enquire about a bulk order. Please share quotation and availability details.`;

  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
