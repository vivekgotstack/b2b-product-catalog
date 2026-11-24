import Image from "next/image";
import { Layers3, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogueTitle, company } from "@/config/company";
import { enquiryEmail, phoneHref, whatsappEnquiry } from "@/lib/contact";

function Wordmark() {
  return (
    <a className="wordmark" href="/" aria-label={`${catalogueTitle} home`}>
      <span className="brand-mark" aria-hidden="true">
        {company.logoPath
          ? <Image src={company.logoPath} alt="" width={42} height={42} className="object-contain" />
          : <Layers3 size={23} strokeWidth={1.65} />}
      </span>
      <span className="brand-name">{catalogueTitle}</span>
    </a>
  );
}

export function Header() {
  const email = enquiryEmail();

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
          <Wordmark />
          <nav className="main-nav" aria-label="Main navigation">
            <a href="/#catalogue">Catalogue</a>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
          </nav>
          <Button asChild className="header-quote">
            <a href="/#contact"><Send size={16} aria-hidden="true" /><span>Request a quote</span></a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const email = enquiryEmail();
  const whatsapp = whatsappEnquiry();

  return (
    <footer className="site-footer">
      <div className="container-shell">
        <div className="footer-content">
          <div><Wordmark /></div>
          <nav aria-label="Footer navigation">
            <a href="/#catalogue">Catalogue</a>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
          </nav>
          {(phoneHref || email || whatsapp) && (
            <div className="footer-actions">
              {phoneHref && <a href={phoneHref} aria-label="Call sales"><Phone size={19} aria-hidden="true" /></a>}
              {email && <a href={email} aria-label="Email sales"><Mail size={19} aria-hidden="true" /></a>}
              {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp (opens in a new tab)"><MessageCircle size={19} aria-hidden="true" /></a>}
            </div>
          )}
        </div>
        {company.name && <p className="footer-note">© {new Date().getUTCFullYear()} {company.name}</p>}
      </div>
    </footer>
  );
}
