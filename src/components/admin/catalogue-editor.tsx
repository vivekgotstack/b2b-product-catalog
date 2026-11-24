"use client";

import { ArrowDown, ArrowUp, Check, GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { publishCatalogue } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { Catalogue, Category, Company, Product } from "@/lib/catalogue-schema";
import { moveItem, newSlug } from "./editor-utils";
import { ImagePicker } from "./image-picker";

const sections = [
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "store", label: "Store details" },
] as const;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="admin-field"><span>{label}</span>{children}</label>;
}

function TextField({ label, value, setValue, multiline, type = "text" }: {
  label: string;
  value: string | null;
  setValue: (value: string) => void;
  multiline?: boolean;
  type?: "text" | "email" | "tel" | "url";
}) {
  return (
    <Field label={label}>
      {multiline
        ? <textarea rows={3} value={value ?? ""} onChange={(event) => setValue(event.target.value)} />
        : <input type={type} value={value ?? ""} onChange={(event) => setValue(event.target.value)} />}
    </Field>
  );
}

function Specifications({ product, change }: { product: Product; change: (patch: Partial<Product>) => void }) {
  const [text, setText] = useState(() => Object.entries(product.specifications).map(([label, value]) => `${label}: ${value}`).join("\n"));
  return (
    <Field label="Specifications">
      <textarea rows={4} aria-describedby="spec-format" value={text} onChange={(event) => {
        const value = event.currentTarget.value;
        setText(value);
        const rows = value.split(/\r?\n/).filter((line) => line.trim()).map((line) => {
          const separator = line.indexOf(":");
          return separator === -1 ? [line.trim(), ""] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
        });
        change({ specifications: Object.fromEntries(rows) });
      }} />
      <small id="spec-format">Paste one specification per line in the format “Material: Cotton”.</small>
    </Field>
  );
}

function ProductForm({ product, categories, change, remove, connected, onBusy }: {
  product: Product;
  categories: Category[];
  change: (patch: Partial<Product>) => void;
  remove: () => void;
  connected: boolean;
  onBusy: (busy: boolean) => void;
}) {
  return (
    <div className="admin-panel admin-product-form">
      <div className="admin-panel-title">
        <h2>{product.name || "New product"}</h2>
        <button type="button" className="admin-small-button admin-delete" onClick={remove}><Trash2 size={16} aria-hidden="true" />Remove product</button>
      </div>
      <div className="admin-fields-grid">
        <TextField label="Product name" value={product.name} setValue={(name) => change({ name })} />
        <Field label="Category">
          <select value={product.category} onChange={(event) => change({ category: event.currentTarget.value })}>
            <option value="">Select a category</option>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </Field>
        <TextField label="Product URL slug" value={product.slug} setValue={(slug) => change({ slug })} />
      </div>
      <TextField label="Description" value={product.description} setValue={(description) => change({ description })} multiline />
      <Specifications product={product} change={change} />
      <ImagePicker label="Product photos" images={product.images} limit={4} connected={connected} onBusy={onBusy} onChange={(images) => change({ images })} />
    </div>
  );
}

function StoreFields({ draft, setDraft, connected, onBusy }: {
  draft: Catalogue;
  setDraft: (update: (value: Catalogue) => Catalogue) => void;
  connected: boolean;
  onBusy: (busy: boolean) => void;
}) {
  const { company, banner } = draft;
  const changeCompany = (patch: Partial<Company>) => setDraft((value) => ({ ...value, company: { ...value.company, ...patch } }));
  const changeBanner = (patch: Partial<Catalogue["banner"]>) => setDraft((value) => ({ ...value, banner: { ...value.banner, ...patch } }));
  const changePhone = (patch: Partial<NonNullable<Company["phone"]>>) => {
    const next = { display: "", international: "", ...company.phone, ...patch };
    changeCompany({ phone: next.display || next.international ? next : null });
  };

  return (
    <div className="admin-panel admin-store-form">
      <h2>Store details</h2>
      <div className="admin-fields-grid">
        <TextField label="Store name" value={company.name} setValue={(name) => changeCompany({ name })} />
        <TextField label="Website URL" type="url" value={company.siteUrl} setValue={(siteUrl) => changeCompany({ siteUrl: siteUrl || null })} />
        <TextField label="Sales email" type="email" value={company.email} setValue={(email) => changeCompany({ email: email || null })} />
        <TextField label="Location" value={company.location} setValue={(location) => changeCompany({ location: location || null })} />
        <TextField label="Displayed phone number" type="tel" value={company.phone?.display ?? null} setValue={(display) => changePhone({ display })} />
        <TextField label="Callable phone with country code" type="tel" value={company.phone?.international ?? null} setValue={(international) => changePhone({ international })} />
        <TextField label="WhatsApp number with country code" type="tel" value={company.whatsappNumber} setValue={(whatsappNumber) => changeCompany({ whatsappNumber: whatsappNumber || null })} />
      </div>
      <TextField label="Search and social description" value={company.description} setValue={(description) => changeCompany({ description: description || null })} multiline />
      <TextField label="About the store" value={company.about} setValue={(about) => changeCompany({ about: about || null })} multiline />
      <h2>Homepage banner</h2>
      <div className="admin-fields-grid">
        <TextField label="Headline" value={banner.title} setValue={(title) => changeBanner({ title })} />
        <TextField label="Emphasised line" value={banner.accent} setValue={(accent) => changeBanner({ accent })} />
      </div>
      <TextField label="Banner description" value={banner.description} setValue={(description) => changeBanner({ description })} multiline />
      <ImagePicker label="Store logo" images={company.logoPath ? [{ src: company.logoPath, alt: "" }] : []} limit={1} connected={connected} onBusy={onBusy} altText={false} onChange={(images) => changeCompany({ logoPath: images[0]?.src ?? null })} />
      <ImagePicker label="Social preview image" images={company.socialImagePath ? [{ src: company.socialImagePath, alt: "" }] : []} limit={1} connected={connected} onBusy={onBusy} altText={false} onChange={(images) => changeCompany({ socialImagePath: images[0]?.src ?? null })} />
    </div>
  );
}

export function CatalogueEditor({ initial, initialRevision, connected }: {
  initial: Catalogue;
  initialRevision: string | null;
  connected: boolean;
}) {
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [revision, setRevision] = useState(initialRevision);
  const [section, setSection] = useState<(typeof sections)[number]["id"]>("products");
  const [selected, setSelected] = useState(0);
  const [formVersion, setFormVersion] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean }>();
  const dragging = useRef<number | null>(null);
  const busy = uploading || publishing;
  const dirty = JSON.stringify(draft) !== saved;
  const product = draft.products[selected];

  function addProduct() {
    const slug = newSlug("product");
    setSelected(draft.products.length);
    setDraft((value) => ({
      ...value,
      products: [...value.products, { slug, name: "New product", category: value.categories[0]?.slug ?? "", description: "", specifications: {}, images: [] }],
    }));
  }

  function reorderProduct(from: number, to: number) {
    const products = moveItem(draft.products, from, to);
    setSelected(Math.max(0, products.indexOf(product)));
    setDraft({ ...draft, products });
  }

  async function publish() {
    if (!connected || busy || !dirty) return;
    setPublishing(true);
    setMessage(undefined);
    try {
      const result = await publishCatalogue(draft, revision);
      if (!result.data) {
        setMessage({ text: result.error, error: true });
        return;
      }
      setRevision(result.revision);
      setDraft(result.data);
      setSaved(JSON.stringify(result.data));
      setMessage({ text: "Published. The public catalogue now shows these changes.", error: false });
    } catch {
      setMessage({ text: "Publishing failed. Your draft is still here.", error: true });
    } finally {
      setPublishing(false);
    }
  }

  return (
    <>
      {!connected && <p className="admin-notice" role="status">Connect a private Vercel Blob store to enable photo uploads and publishing.</p>}
      <nav aria-label="Editor sections" className="admin-section-nav">
        {sections.map(({ id, label }) => (
          <button key={id} type="button" aria-pressed={section === id} disabled={busy} onClick={() => setSection(id)}>{label}</button>
        ))}
      </nav>
      <fieldset className="admin-editor-fields" disabled={busy}>
        {section === "products" && (
          <div className="admin-product-grid">
            <aside className="admin-panel admin-list">
              <div className="admin-panel-title"><h2>Products</h2><button type="button" className="admin-small-button" onClick={addProduct}><Plus size={17} aria-hidden="true" />Add product</button></div>
              {draft.products.length > 1 && <p>Drag to reorder, or use the move buttons.</p>}
              <ul>
                {draft.products.map((item, index) => (
                  <li
                    key={index}
                    draggable={!busy}
                    onDragStart={(event) => {
                      dragging.current = index;
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(index));
                    }}
                    onDragEnd={() => { dragging.current = null; }}
                    onDragOver={(event) => { if (dragging.current !== null) event.preventDefault(); }}
                    onDrop={(event) => {
                      if (dragging.current === null) return;
                      event.preventDefault();
                      reorderProduct(dragging.current, index);
                      dragging.current = null;
                    }}
                  >
                    <button type="button" className="admin-product-select" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                      <GripVertical size={16} aria-hidden="true" /><span>{item.name || "New product"}</span>
                    </button>
                    <button type="button" className="admin-icon-button" aria-label={`Move ${item.name || "product"} earlier`} disabled={index === 0} onClick={() => reorderProduct(index, index - 1)}><ArrowUp size={15} aria-hidden="true" /></button>
                    <button type="button" className="admin-icon-button" aria-label={`Move ${item.name || "product"} later`} disabled={index === draft.products.length - 1} onClick={() => reorderProduct(index, index + 1)}><ArrowDown size={15} aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            </aside>
            {product ? (
              <ProductForm
                key={`${selected}:${formVersion}`}
                product={product}
                categories={draft.categories}
                change={(patch) => setDraft((value) => ({ ...value, products: value.products.map((item, index) => index === selected ? { ...item, ...patch } : item) }))}
                remove={() => {
                  setDraft((value) => ({ ...value, products: value.products.filter((_, index) => index !== selected) }));
                  setSelected(Math.max(0, Math.min(selected, draft.products.length - 2)));
                  setFormVersion((version) => version + 1);
                }}
                connected={connected}
                onBusy={setUploading}
              />
            ) : <div className="admin-panel">Add a product to start editing the catalogue.</div>}
          </div>
        )}
        {section === "categories" && (
          <div className="admin-panel admin-category-form">
            <div className="admin-panel-title">
              <h2>Categories</h2>
              <button type="button" className="admin-small-button" onClick={() => {
                const slug = newSlug("category");
                setDraft((value) => ({ ...value, categories: [...value.categories, { slug, name: "New category" }] }));
              }}><Plus size={17} aria-hidden="true" />Add category</button>
            </div>
            {draft.categories.map((item, index) => {
              const used = draft.products.some((product) => product.category === item.slug);
              return (
                <div key={item.slug} className="admin-category-row">
                  <TextField label={`Category ${index + 1} name`} value={item.name} setValue={(name) => setDraft((value) => ({ ...value, categories: value.categories.map((category) => category.slug === item.slug ? { ...category, name } : category) }))} />
                  <button type="button" className="admin-small-button admin-delete" disabled={used} title={used ? "Move its products to another category first" : undefined} onClick={() => setDraft((value) => ({ ...value, categories: value.categories.filter((category) => category.slug !== item.slug) }))}>Remove</button>
                </div>
              );
            })}
          </div>
        )}
        {section === "store" && <StoreFields draft={draft} setDraft={setDraft} connected={connected} onBusy={setUploading} />}
      </fieldset>
      <div className="admin-publish-bar">
        <p role="status" className={message?.error ? "admin-save-error" : undefined}>
          {message && (message.error || !dirty) ? message.text : uploading ? "Uploading photos…" : dirty ? "You have unpublished changes." : "No unpublished changes."}
        </p>
        <Button type="button" onClick={() => void publish()} disabled={!connected || !dirty || busy}>
          <Check size={17} aria-hidden="true" />{publishing ? "Publishing…" : "Publish changes"}
        </Button>
      </div>
    </>
  );
}
