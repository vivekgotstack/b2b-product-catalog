import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" className="container-shell grid min-h-[48vh] place-items-center py-20 text-center">
      <div>
        <PackageSearch size={44} className="mx-auto mb-5 text-accent" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Page unavailable</h1>
        <p className="mt-3 mb-6 text-muted-foreground">Find products and contact details in the catalogue.</p>
        <Button asChild><a href="/#catalogue">Browse the catalogue</a></Button>
      </div>
    </main>
  );
}
