# B2B Clothing Catalogue

A statically generated Next.js catalogue for a single apparel brand. It includes ten sample listings and thirty local WebP photos to demonstrate the card slideshow.

## Run and build

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

### Deploy on Vercel

Use the Next.js framework preset with the default output directory. Under **Settings → Environment Variables**, add the following values for **Production** and any **Preview** deployments that need access.

| Variable | Value |
| --- | --- |
| `CATALOGUE_LOGIN_EMAIL` | The email used as the sign-in ID |
| `CATALOGUE_PASSWORD` | A unique catalogue password stored as a secret |
| `CATALOGUE_CONTACT_EMAIL` | The inbox that receives enquiries. Leave blank to hide email actions. |

Deploy again after changing any of these values. Visitors sign in through the browser prompt. The production site stays closed if either login setting is missing.

For local sign-in testing, copy `.env.example` to `.env.local` and fill in the login settings. With both settings blank, `npm run dev` allows local browsing. Run `npm run build` followed by `npm start` to test the protected production build locally.

## Add your catalogue

- Fill in `src/config/company.ts` for brand, domain, phone and WhatsApp. Set the enquiry inbox through `CATALOGUE_CONTACT_EMAIL`. Use an international phone number and a WhatsApp number with digits only, including the country code.
- Replace the sample categories and products in `src/data/products.ts`. Use unique lowercase, hyphenated slugs and reference a category slug from each product. Each product needs a name, SKU, description, specification labels and values, and three or four images with descriptive alt text.
- Store compressed product images under `public/images/products/<product-slug>/` and point each image at `/images/products/<product-slug>/...`. Prefer WebP or AVIF and size images for their display. The first image becomes the catalogue cover. Store your logo and social preview under `public/images/brand/`.
- Every product gets a static URL at `/products/<product-slug>/`. Email enquiries open the visitor’s mail app with the product and SKU in the subject. Replies and follow-ups stay in your sales inbox.
- Product cards load alternate images on hover or when the visitor uses the photo controls. The arrows also work with touch and the keyboard.

