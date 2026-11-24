"use client";

import { useState, type ReactNode } from "react";
import { LayoutGrid, PackageSearch, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Category = { slug: string; name: string; count: number };
type Entry = { slug: string; category: string; terms: string; card: ReactNode };

export function CatalogueBrowser({ categories, entries }: { categories: Category[]; entries: Entry[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matching = entries.filter(
    (entry) => (!category || entry.category === category) && terms.every((term) => entry.terms.includes(term)),
  );
  const visible = new Set(matching.map((entry) => entry.slug));

  return (
    <>
      <div className="catalogue-heading">
        <div>
          <h1 id="catalogue-title">Clothing catalogue</h1>
          <p>Garment specifications and bulk order enquiries.</p>
        </div>
        <div role="search" aria-label="Product catalogue" className="catalogue-search">
          <label htmlFor="product-search" className="sr-only">Search products, specifications or SKU</label>
          <Search size={19} aria-hidden="true" className="search-icon" />
          <Input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or SKU"
            autoComplete="off"
            className="pr-10 pl-10"
          />
          {query && (
            <button type="button" className="clear-search" aria-label="Clear search" onClick={() => {
              setQuery("");
              document.getElementById("product-search")?.focus();
            }}>
              <X size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="catalogue-toolbar">
        <ul className="category-filters" aria-label="Filter by category">
          <li>
            <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>
              <LayoutGrid size={16} aria-hidden="true" /> All products
            </button>
          </li>
          {categories.map(({ slug, name, count }) => (
            <li key={slug}>
              <button type="button" aria-pressed={category === slug} onClick={() => setCategory(slug)}>
                {name} <small>{count}</small>
              </button>
            </li>
          ))}
        </ul>
        <p className="result-count" role="status">{matching.length} {matching.length === 1 ? "product" : "products"}</p>
      </div>
      {matching.length === 0 && (
        <div className="empty-results">
          <span><PackageSearch size={28} strokeWidth={1.65} aria-hidden="true" /></span>
          <h2>{entries.length ? "No matching products" : "No products listed yet"}</h2>
          <p>{entries.length ? "Try a different search term or category." : "Products will appear here once the catalogue is ready."}</p>
          {entries.length > 0 && (
            <button type="button" className="reset-filters" onClick={() => {
              setCategory(null);
              setQuery("");
              document.getElementById("product-search")?.focus();
            }}>Clear filters</button>
          )}
        </div>
      )}
      <div className="product-grid">
        {entries.map(({ slug, card }) => <div key={slug} hidden={!visible.has(slug)}>{card}</div>)}
      </div>
      <noscript><style>{`.catalogue-search, .category-filters, .card-photo-control, .card-photo-count { display: none !important; }`}</style></noscript>
    </>
  );
}
