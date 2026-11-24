import type { Category, Product } from "@/lib/catalogue-schema";

export type { Product, ProductImage } from "@/lib/catalogue-schema";

export const categories: readonly Category[] = [
  { slug: "t-shirts", name: "T-shirts" },
  { slug: "polos", name: "Polos" },
  { slug: "shirts", name: "Shirts" },
  { slug: "sweatshirts", name: "Sweatshirts" },
  { slug: "trousers", name: "Trousers" },
  { slug: "outerwear", name: "Outerwear" },
];

function sampleImages(slug: string, alt: [string, string, string]): Product["images"] {
  return [
    { src: `/images/products/${slug}/cover.webp`, alt: alt[0] },
    { src: `/images/products/${slug}/detail.webp`, alt: alt[1] },
    { src: `/images/products/${slug}/alternate.webp`, alt: alt[2] },
  ];
}

export const products: readonly Product[] = [
  {
    slug: "ivory-pique-polo",
    name: "Ivory Piqué Polo",
    category: "polos",
    description: "A short-sleeved polo with a textured piqué knit, ribbed collar and two-button placket.",
    specifications: {
      "Colour": "Ivory",
      "Fabric": "Piqué knit",
      "Sleeve": "Short",
    },
    images: sampleImages("ivory-pique-polo", [
      "Front flat lay of the ivory polo",
      "Close-up of the piqué fabric, collar and placket",
      "Back flat lay of the ivory polo",
    ]),
  },
  {
    slug: "rust-pullover-hoodie",
    name: "Rust Pullover Hoodie",
    category: "sweatshirts",
    description: "A relaxed pullover hoodie with a drawstring hood, ribbed cuffs and a kangaroo pocket.",
    specifications: {
      "Colour": "Rust",
      "Fit": "Relaxed",
      "Pocket": "Kangaroo",
    },
    images: sampleImages("rust-pullover-hoodie", [
      "Front flat lay of the rust hoodie",
      "Close-up of the rust hoodie fabric and construction",
      "Back flat lay of the rust hoodie",
    ]),
  },
  {
    slug: "indigo-denim-jacket",
    name: "Indigo Denim Jacket",
    category: "outerwear",
    description: "A classic trucker jacket with contrast stitching, flap chest pockets and a button front.",
    specifications: {
      "Colour": "Dark indigo",
      "Fabric": "Denim",
      "Closure": "Button front",
    },
    images: sampleImages("indigo-denim-jacket", [
      "Front flat lay of the indigo denim jacket",
      "Close-up of the denim and contrast stitching",
      "Back flat lay of the indigo denim jacket",
    ]),
  },
  {
    slug: "crew-neck-t-shirts",
    name: "Crew Neck T-Shirts",
    category: "t-shirts",
    description: "Three crew-neck T-shirt styles for an everyday assortment, from a classic fit to a roomier cut.",
    specifications: {
      "Neckline": "Crew neck",
      "Sleeve": "Short",
      "Styles": "Classic, oversized, athletic",
    },
    images: sampleImages("crew-neck-t-shirts", [
      "Ivory classic crew-neck T-shirt",
      "Black oversized crew-neck T-shirt",
      "Slate blue athletic crew-neck T-shirt",
    ]),
  },
  {
    slug: "olive-cargo-trousers",
    name: "Olive Cargo Trousers",
    category: "trousers",
    description: "Full-length utility trousers with patch cargo pockets for carrying essentials.",
    specifications: {
      "Colour": "Olive",
      "Length": "Full length",
      "Pockets": "Cargo",
    },
    images: sampleImages("olive-cargo-trousers", [
      "Front flat lay of the olive cargo trousers",
      "Close-up of the olive cargo pocket and seams",
      "Back flat lay of the olive cargo trousers",
    ]),
  },
  {
    slug: "blue-oxford-shirt",
    name: "Blue Oxford Shirt",
    category: "shirts",
    description: "A long-sleeved button-down shirt with a chest pocket and a soft Oxford weave.",
    specifications: {
      "Colour": "Sky blue",
      "Fabric": "Oxford weave",
      "Sleeve": "Long",
    },
    images: sampleImages("blue-oxford-shirt", [
      "Front flat lay of the blue Oxford shirt",
      "Close-up of the blue Oxford fabric and buttoned cuff",
      "Back flat lay of the blue Oxford shirt",
    ]),
  },
  {
    slug: "sage-crewneck-sweatshirt",
    name: "Sage Crewneck Sweatshirt",
    category: "sweatshirts",
    description: "A fleece sweatshirt with a ribbed crew neck, cuffs and hem.",
    specifications: {
      "Colour": "Sage",
      "Fabric": "Fleece",
      "Neckline": "Crew neck",
    },
    images: sampleImages("sage-crewneck-sweatshirt", [
      "Front flat lay of the sage sweatshirt",
      "Close-up of the sage fleece and ribbing",
      "Back flat lay of the sage sweatshirt",
    ]),
  },
  {
    slug: "sand-canvas-overshirt",
    name: "Sand Canvas Overshirt",
    category: "outerwear",
    description: "A canvas layering shirt with a button front and large front patch pockets.",
    specifications: {
      "Colour": "Sand",
      "Fabric": "Canvas",
      "Closure": "Button front",
    },
    images: sampleImages("sand-canvas-overshirt", [
      "Front flat lay of the sand overshirt",
      "Close-up of the canvas texture and hardware",
      "Back flat lay of the sand overshirt",
    ]),
  },
  {
    slug: "stone-tapered-chinos",
    name: "Stone Tapered Chinos",
    category: "trousers",
    description: "A full-length flat-front chino with a tapered leg for everyday wear.",
    specifications: {
      "Colour": "Stone",
      "Fit": "Tapered",
      "Front": "Flat",
    },
    images: sampleImages("stone-tapered-chinos", [
      "Front flat lay of the stone chinos",
      "Close-up of the chino fabric and waistband",
      "Back flat lay of the stone chinos",
    ]),
  },
  {
    slug: "everyday-t-shirts",
    name: "Everyday T-Shirts",
    category: "t-shirts",
    description: "An assortment of long-sleeve, V-neck and pocket tees.",
    specifications: {
      "Styles": "Long-sleeve, V-neck, pocket",
      "Colours": "Oatmeal, green, brick red",
    },
    images: sampleImages("everyday-t-shirts", [
      "Oatmeal long-sleeve T-shirt",
      "Dark green V-neck T-shirt",
      "Brick red pocket T-shirt",
    ]),
  },
];

