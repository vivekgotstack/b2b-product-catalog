import Image from "next/image";
import { readCatalogue } from "@/lib/catalogue-store";

export async function BrandWordmark({ href = "/" }: { href?: string }) {
  const { data: { company } } = await readCatalogue();
  const icon = company.logoPath ?? "/icon.svg";

  return (
    <a className="wordmark" href={href} aria-label={`${company.name} home`}>
      <span className="brand-mark" aria-hidden="true">
        <Image src={icon} alt="" width={42} height={42} loading="eager" className="object-contain" />
      </span>
      <span className="brand-name">{company.name}</span>
    </a>
  );
}
