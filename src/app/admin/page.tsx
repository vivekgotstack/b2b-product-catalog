import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth-actions";
import { CatalogueEditor } from "@/components/admin/catalogue-editor";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Button } from "@/components/ui/button";
import { hasValidSession, sessionCookieName } from "@/lib/auth";
import { catalogueStorageConnected, readCatalogue } from "@/lib/catalogue-store";
import "./admin.css";

export const metadata: Metadata = { title: "Catalogue editor", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasValidSession((await cookies()).get(sessionCookieName)?.value)) redirect("/login/");
  const { data, revision } = await readCatalogue();

  return (
    <>
      <header className="admin-header">
        <div className="container-shell">
          <BrandWordmark />
          <div className="admin-header-actions">
            <Button asChild variant="outline"><a href="/">View catalogue</a></Button>
            <form action={signOut}><Button type="submit" variant="ghost"><LogOut size={16} aria-hidden="true" />Sign out</Button></form>
          </div>
        </div>
      </header>
      <main id="main-content" className="container-shell admin-main">
        <h1>Catalogue editor</h1>
        <p>Edit your products and store details, then publish them to the public catalogue.</p>
        <CatalogueEditor initial={data} initialRevision={revision} connected={catalogueStorageConnected()} />
      </main>
    </>
  );
}
