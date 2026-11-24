"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";

export function ProductCardMedia({ href, name, images }: {
  href: string;
  name: string;
  images: Product["images"];
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showAlternates, setShowAlternates] = useState(false);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const visibleIndex = images[index] && loaded.has(images[index].src) ? index : 0;

  useEffect(() => {
    if (!playing) return;

    const next = () => setIndex((current) => (current + 1) % images.length);
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      next();
      interval = window.setInterval(next, 1500);
    }, 400);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [playing, images.length]);

  function browse(step: number) {
    setPlaying(false);
    setShowAlternates(true);
    setIndex((current) => (current + step + images.length) % images.length);
  }

  if (images.length === 1) {
    return <Link href={href} prefetch tabIndex={-1} aria-hidden="true" className="product-card-image"><Image src={images[0].src} alt="" fill /></Link>;
  }

  return (
    <div
      className="product-card-media"
      role="group"
      aria-label={`${name} photos`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || event.currentTarget.matches(":focus-within")) return;
        if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
        setShowAlternates(true);
        setPlaying(true);
      }}
      onPointerLeave={() => {
        if (playing) setIndex(0);
        setPlaying(false);
      }}
      onFocusCapture={() => setPlaying(false)}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        browse(event.key === "ArrowLeft" ? -1 : 1);
      }}
    >
      <Link href={href} prefetch tabIndex={-1} aria-hidden="true" className="product-card-image">
        <Image src={images[0].src} alt="" fill />
        {showAlternates && images.slice(1).map(({ src }, position) => (
          <Image
            key={`${src}-${position}`}
            src={src}
            alt=""
            fill
            loading="eager"
            className="product-card-slide"
            data-visible={visibleIndex === position + 1}
            onLoad={() => setLoaded((current) => new Set(current).add(src))}
          />
        ))}
      </Link>
      <button type="button" className="card-photo-control card-photo-prev" aria-label={`Previous photo of ${name}`} onClick={() => browse(-1)}>
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button type="button" className="card-photo-control card-photo-next" aria-label={`Next photo of ${name}`} onClick={() => browse(1)}>
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <span className="card-photo-count" aria-hidden="true">{visibleIndex + 1} / {images.length}</span>
      <span className="sr-only" aria-live={playing ? "off" : "polite"}>
        Photo {visibleIndex + 1} of {images.length}. {images[visibleIndex].alt}
      </span>
    </div>
  );
}
