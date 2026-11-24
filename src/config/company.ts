type Company = {
  name: string | null;
  description: string | null;
  about: string | null;
  siteUrl: string | null;
  location: string | null;
  logoPath: `/images/brand/${string}` | null;
  socialImagePath: `/images/brand/${string}` | null;
  phone: { display: string; international: `+${number}` } | null;
  whatsappNumber: string | null;
  email: string | null;
};

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

export const catalogueTitle = company.name ?? "Bulkout";
export const catalogueDescription =
  company.description ?? "A clothing catalogue for bulk orders, quotations and product enquiries.";
