import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Catalogue } from "@/lib/catalogue-schema";

export function CatalogueHero({ banner, products }: Pick<Catalogue, "banner" | "products">) {
  const covers = products.slice(0, 3).map(({ images }) => images[0]);

  return (
    <section className="container-shell catalogue-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 id="home-title">{banner.title}{banner.accent && <> <span>{banner.accent}</span></>}</h1>
        <p>{banner.description}</p>
        <Button asChild size="lg" className="hero-contact">
          <a href="#contact"><Mail size={18} aria-hidden="true" />Contact sales</a>
        </Button>
      </div>
      {covers.length > 0 && (
        <div className="hero-photos" aria-hidden="true">
          {covers.map(({ src }) => (
            <div className="hero-photo" key={src}>
              <Image src={src} alt="" fill loading="eager" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
