import Image from "next/image";
import { catalogueTitle, company } from "@/config/company";

export function BrandWordmark({ href = "/", signIn = false }: { href?: string; signIn?: boolean }) {
  const icon = signIn ? "/icon.svg" : company.logoPath ?? "/icon.svg";

  return (
    <a className="wordmark" href={href} aria-label={`${catalogueTitle} home`}>
      <span className="brand-mark" aria-hidden="true">
        <Image src={icon} alt="" width={42} height={42} loading="eager" className="object-contain" />
      </span>
      <span className="brand-name">{catalogueTitle}</span>
    </a>
  );
}
