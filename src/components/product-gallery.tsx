"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ProductImage } from "@/data/products";

export function ProductGallery({ images }: { images: readonly ProductImage[] }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  const move = (step: number) => setIndex((value) => (value + step + images.length) % images.length);

  return (
    <section className="gallery" aria-label="Product photos" onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
      <div className="gallery-frame">
        <Image src={current.src} alt={current.alt} fill loading={index === 0 ? "eager" : "lazy"} />
        {images.length > 1 && (
          <>
            <button type="button" className="gallery-prev" onClick={() => move(-1)} aria-label="Previous image">
              <ChevronLeft size={21} aria-hidden="true" />
            </button>
            <button type="button" className="gallery-next" onClick={() => move(1)} aria-label="Next image">
              <ChevronRight size={21} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <p className="sr-only" role="status">Image {index + 1} of {images.length}. {current.alt}</p>
      {images.length > 1 && <div className="gallery-thumbnails">
        {images.map((image, position) => (
          <button key={`${image.src}-${position}`} type="button" aria-label={`Image ${position + 1}: ${image.alt}`} aria-pressed={index === position} onClick={() => setIndex(position)}>
            <Image src={image.src} alt="" fill />
          </button>
        ))}
      </div>}
    </section>
  );
}
