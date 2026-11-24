# Bulkout

A public Next.js catalogue with a private staff editor. Before the first publish, the site uses the ten sample listings and thirty WebP photos included in the repository.

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
| `CATALOGUE_LOGIN_EMAIL` | The staff sign-in email |
| `CATALOGUE_PASSWORD` | A unique catalogue password stored as a secret |
| `CATALOGUE_SESSION_SECRET` | A separate random signing key, at least 32 bytes, stored as a secret |
| `CATALOGUE_CONTACT_EMAIL` | The inbox that receives enquiries. Leave blank to hide email actions. |
| `CATALOGUE_CONTACT_PHONE` | Public sales number with `+` and country code, without spaces or punctuation. Used when Store details has no saved phone number. |
| `BLOB_READ_WRITE_TOKEN` | The private Vercel Blob store token if the project is not using its managed Blob connection |

Generate the signing key once and save it with the other login settings.

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Connect a **private Vercel Blob store** in the Vercel project’s Storage tab. The connection enables published catalogue changes and photo uploads. Deploy again after connecting storage or changing environment variables.

For local testing, copy `.env.example` to `.env.local` and fill in the staff login settings. Use a separate development Blob store to test publishing without changing the production catalogue.

## Edit the catalogue

- The public catalogue and product pages open without sign-in. For staff access, click the small screw at the right edge of the footer eight times or visit `/admin/` directly.
- Use the existing staff email and password. **Remember me on this device** keeps that browser signed in for 30 days.
- Edit products, categories, store details and homepage copy. Drag products to change their order, or use the move buttons.
- Drop or paste product photos into the photo area. Drop or paste onto a photo to replace it. The first photo is the cover.
- Select **Publish changes** to make the edits live. Public product URLs use the product slug. Changing a slug changes that product’s URL.
- Publishing refreshes the cached storefront and product pages. The editor reads the latest saved revision directly.

