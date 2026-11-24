import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export function CatalogueHero() {
  const covers = products.slice(0, 3).map(({ images }) => images[0]);

  return (
    <section className="container-shell catalogue-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 id="home-title">Clothing for <span>bulk orders.</span></h1>
        <p>Browse apparel by category, compare specifications and request a quote from sales.</p>
        <Button asChild size="lg" className="hero-contact">
          <a href="#contact"><Mail size={18} aria-hidden="true" />Contact sales</a>
        </Button>
      </div>
      {covers.length > 0 && (
        <div className="hero-photos" aria-hidden="true">
          {covers.map(({ src }) => (
            <div className="hero-photo" key={src}>
              <Image src={src} alt="" fill />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
