import type { ReactNode } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import "./sign-in.css";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sign-in-shell">
      <aside className="sign-in-intro" aria-label="Bulkout">
        <BrandWordmark href="/login/" signIn />
        <div className="sign-in-intro-copy">
          <p className="sign-in-tagline">Clothing for <span>bulk orders.</span></p>
          <p>Browse the collection and enquire directly with sales.</p>
        </div>
      </aside>
      <main className="sign-in-main" id="main-content">{children}</main>
    </div>
  );
}
