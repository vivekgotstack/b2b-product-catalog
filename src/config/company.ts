import { internationalPhonePattern, type Company } from "@/lib/catalogue-schema";

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

export function environmentContactPhone(): Company["phone"] {
  const configured = process.env.CATALOGUE_CONTACT_PHONE?.trim();
  if (!configured) return null;

  const display = configured.replace(/^(["'])(.*)\1$/, "$2").trim().replace(/^tel:\s*/i, "");
  const dial = display
    .replace(/[\s().\-\u2010-\u2014]/g, "")
    .replace(/^00(?=[1-9])/, "+");

  return internationalPhonePattern.test(dial) || /^\d{7,15}$/.test(dial)
    ? { display, international: dial }
    : null;
}
