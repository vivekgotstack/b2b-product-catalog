# B2B Clothing Catalogue

A static Next.js catalogue for a single apparel brand. The product list, categories, brand details and contact details start empty.

## Run and build

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
npm run build
```

Upload `out/` to a static host that serves directory index files. Configure `404.html` as the host’s error page. Run a new build after catalogue or contact changes.

## Add your catalogue

- Fill in `src/config/company.ts`. Set the full HTTPS production URL and company name to enable indexing. Leave an unused contact method set to `null`. Use an international phone number and a WhatsApp number with digits only, including the country code.
- Add categories and products in `src/data/products.ts`. Use unique lowercase, hyphenated slugs and reference a category slug from each product. Each product needs a name, SKU, description, specification labels and values, and three or four images with descriptive alt text.
- Store compressed product images under `public/images/products/<product-slug>/` and point each image at `/images/products/<product-slug>/...`. Prefer WebP or AVIF and size images for their display. The first image becomes the catalogue cover. Store your logo and social preview under `public/images/brand/`.
- Every product gets a static URL at `/products/<product-slug>/`. Email enquiries open the visitor’s mail app with the product and SKU in the subject. Replies and follow-ups stay in your sales inbox.

## Optional password protection

For a private deployment, use your static host’s password protection or serve the export through the included `deploy/Caddyfile`. Run `caddy hash-password` to create a password hash. Set `CATALOGUE_PASSWORD_HASH` on the host and optionally set `CATALOGUE_DOMAIN` and `CATALOGUE_USERNAME`. Keep the hash and password out of the repository. From the project directory, run `caddy run --config deploy/Caddyfile --adapter caddyfile`.

Public search engines need access to crawl the catalogue. Use password protection for private access or previews.
