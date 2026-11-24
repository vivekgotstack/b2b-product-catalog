"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { uploadCataloguePhoto } from "@/app/admin/actions";
import type { ProductImage } from "@/lib/catalogue-schema";
import { moveItem } from "./editor-utils";

async function compressPhoto(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  try {
    const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser could not prepare the photo.");

    for (const quality of [.84, .7, .56]) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale * (quality / .84)));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale * (quality / .84)));
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size <= 800_000) return blob;
    }
    throw new Error("This photo could not be compressed enough. Try a smaller image.");
  } finally {
    bitmap.close();
  }
}

export function ImagePicker({ label, images, limit, connected, onChange, onBusy, altText = true }: {
  label: string;
  images: ProductImage[];
  limit: number;
  connected: boolean;
  onChange: (images: ProductImage[]) => void;
  onBusy: (busy: boolean) => void;
  altText?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const replaceIndex = useRef<number | null>(null);
  const inProgress = useRef(false);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  async function addPictures(files: File[], replace: number | null = null) {
    if (!connected || !files.length || inProgress.current) return;
    const available = replace === null ? limit - images.length : 1;
    if (available < 1) {
      setMessage("Remove or replace a photo to make room.");
      return;
    }

    inProgress.current = true;
    setWorking(true);
    onBusy(true);
    setMessage("");
    const next = [...images];
    try {
      for (const file of files.slice(0, available)) {
        let photo: Blob;
        try {
          photo = await compressPhoto(file);
        } catch (error) {
          throw new Error(error instanceof Error ? `Could not open ${file.name || "the pasted image"}. ${error.message}` : "Could not open the image.");
        }
        const form = new FormData();
        form.append("photo", photo, "photo");
        const result = await uploadCataloguePhoto(form);
        if (!result.src) throw new Error(result.error);
        if (replace === null) next.push({ src: result.src, alt: "" });
        else next[replace] = { ...next[replace], src: result.src };
        onChange(next.slice());
      }
      if (files.length > available) setMessage(`Added ${available} photo${available === 1 ? "" : "s"}. This section holds up to ${limit}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload the photo.");
    } finally {
      inProgress.current = false;
      setWorking(false);
      onBusy(false);
    }
  }

  function choose(index: number | null) {
    replaceIndex.current = index;
    input.current?.click();
  }

  return (
    <section className="admin-photos" aria-label={label}>
      <h3>{label}</h3>
      {limit > 1 && <p>The first photo is the cover. Add up to {limit}, or drop or paste onto a photo to replace it.</p>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(event) => {
        const files = Array.from(event.currentTarget.files ?? []);
        event.currentTarget.value = "";
        void addPictures(files, replaceIndex.current);
      }} />
      {images.length > 0 && (
        <ul className="admin-photo-list">
          {images.map((photo, index) => (
            <li
              key={`${photo.src}-${index}`}
              tabIndex={connected ? 0 : undefined}
              onDragOver={(event) => { if (connected && event.dataTransfer.types.includes("Files")) event.preventDefault(); }}
              onDrop={(event) => {
                if (!connected) return;
                event.preventDefault();
                void addPictures(Array.from(event.dataTransfer.files), index);
              }}
              onPaste={(event) => {
                const files = Array.from(event.clipboardData.files);
                if (!connected || !files.length) return;
                event.preventDefault();
                void addPictures(files, index);
              }}
            >
              <Image src={photo.src} alt={photo.alt || `Photo ${index + 1}`} width={100} height={100} />
              <div className="admin-photo-options">
                {altText && (
                  <label className="admin-field">
                    <span>{index === 0 ? "Cover photo description" : `Photo ${index + 1} description`}</span>
                    <input value={photo.alt} maxLength={240} onChange={(event) => onChange(images.map((image, position) => position === index ? { ...image, alt: event.target.value } : image))} />
                  </label>
                )}
                <div className="admin-inline">
                  <button type="button" className="admin-small-button" disabled={!connected || working} onClick={() => choose(index)}>Replace</button>
                  {limit > 1 && (
                    <>
                      <button type="button" className="admin-icon-button" aria-label={`Move photo ${index + 1} earlier`} disabled={index === 0} onClick={() => onChange(moveItem(images, index, index - 1))}><ArrowUp size={16} aria-hidden="true" /></button>
                      <button type="button" className="admin-icon-button" aria-label={`Move photo ${index + 1} later`} disabled={index === images.length - 1} onClick={() => onChange(moveItem(images, index, index + 1))}><ArrowDown size={16} aria-hidden="true" /></button>
                    </>
                  )}
                  <button type="button" className="admin-icon-button admin-delete" aria-label={`Remove photo ${index + 1}`} onClick={() => onChange(images.filter((_, position) => position !== index))}><Trash2 size={16} aria-hidden="true" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {connected && images.length < limit && (
        <div
          className="admin-dropzone"
          tabIndex={0}
          role="group"
          aria-label={`Drop or paste images for ${label.toLowerCase()}`}
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes("Files")) event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            void addPictures(Array.from(event.dataTransfer.files));
          }}
          onPaste={(event) => {
            const files = Array.from(event.clipboardData.files);
            if (!files.length) return;
            event.preventDefault();
            void addPictures(files);
          }}
        >
          <ImagePlus size={23} aria-hidden="true" />
          <span>Drop or paste an image here</span>
          <button type="button" className="admin-small-button" disabled={working} onClick={() => choose(null)}>Choose files</button>
        </div>
      )}
      {(working || message) && <p role="status">{working ? "Uploading photos…" : message}</p>}
    </section>
  );
}
