import type { ReactNode } from "react";
import type { Metadata } from "next";
import { BrandWordmark } from "@/components/brand-wordmark";
import "./sign-in.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sign-in-shell">
      <aside className="sign-in-intro" aria-label="Store">
        <BrandWordmark href="/" />
        <div className="sign-in-intro-copy">
          <p className="sign-in-tagline">Clothing for <span>bulk orders.</span></p>
          <p>Manage the public catalogue and product photos.</p>
        </div>
      </aside>
      <main className="sign-in-main" id="main-content">{children}</main>
    </div>
  );
}
