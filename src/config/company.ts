import type { Company } from "@/lib/catalogue-schema";

export const company: Company = {
  name: "Bulkout",
  description: null,
  about: null,
  siteUrl: null,
  location: null,
  logoPath: null,
  socialImagePath: null,
  phone: null,
  whatsappNumber: null,
  email: process.env.CATALOGUE_CONTACT_EMAIL?.trim() || null,
};

export const catalogueDescription =
  "A clothing catalogue for bulk orders, quotations and product enquiries.";
