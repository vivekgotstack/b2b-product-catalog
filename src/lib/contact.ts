import type { Company } from "@/lib/catalogue-schema";

export type EnquiryProduct = { name: string };

export function phoneHref(company: Company) {
  return company.phone ? `tel:${company.phone.international}` : null;
}

export function enquiryEmail(company: Company, product?: EnquiryProduct) {
  if (!company.email) return null;

  const subject = product ? `Enquiry for ${product.name}` : "Bulk order enquiry";
  const body = [
    "Hello,",
    "",
    product
      ? `I'd like a bulk quote for ${product.name}.`
      : "I'd like a quote for a bulk apparel order.",
    "",
    ...(!product ? ["Product names: "] : []),
    "Quantity: ",
    "Sizes and colours: ",
    "Delivery location: ",
    "",
    "Thank you",
  ].join("\r\n");

  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappEnquiry(company: Company, product?: EnquiryProduct) {
  if (!company.whatsappNumber) return null;

  const message = product
    ? `Hello ${company.name}, I would like a bulk quotation for ${product.name}. Please share pricing, minimum order quantity and lead time.`
    : `Hello ${company.name}, I would like to enquire about a bulk order. Please share quotation and availability details.`;

  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
