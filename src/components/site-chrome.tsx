import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { EnquiryButton } from "@/components/enquiry-button";
import { StaffEntrance } from "@/components/staff-entrance";
import { readCatalogue } from "@/lib/catalogue-store";
import { enquiryEmail, phoneHref, whatsappEnquiry } from "@/lib/contact";

export async function Header() {
  const { data: { company } } = await readCatalogue();
  const email = enquiryEmail(company);

  return (
    <header>
      {(company.location || email) && (
        <div className="utility-bar">
          <div className="container-shell utility-inner">
            {company.location && <span><MapPin size={15} aria-hidden="true" />{company.location}</span>}
            {email && <a href={email}><Mail size={15} aria-hidden="true" />{company.email}</a>}
          </div>
        </div>
      )}
      <div className="header-main">
        <div className="container-shell header-inner">
          <BrandWordmark />
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/#catalogue">Catalogue</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          <EnquiryButton company={company} label="Request a quote" className="header-quote" />
        </div>
      </div>
    </header>
  );
}

export async function Footer() {
  const { data: { company } } = await readCatalogue();
  const email = enquiryEmail(company);
  const whatsapp = whatsappEnquiry(company);
  const phone = phoneHref(company);

  return (
    <footer className="site-footer">
      <div className="container-shell">
        <div className="footer-content">
          <div><BrandWordmark /></div>
          <nav aria-label="Footer navigation">
            <Link href="/#catalogue">Catalogue</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          {(phone || email || whatsapp) && (
            <div className="footer-actions">
              {phone && <a href={phone} aria-label="Call sales"><Phone size={19} aria-hidden="true" /></a>}
              {email && <a href={email} aria-label="Email sales"><Mail size={19} aria-hidden="true" /></a>}
              {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp (opens in a new tab)"><MessageCircle size={19} aria-hidden="true" /></a>}
            </div>
          )}
        </div>
        <div className="footer-note"><span>© {new Date().getUTCFullYear()} {company.name}</span><StaffEntrance /></div>
      </div>
    </footer>
  );
}
