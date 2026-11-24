import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "@/config/company";
import { enquiryEmail, phoneHref, whatsappEnquiry } from "@/lib/contact";

export function ContactSection() {
  const methods = [
    { label: "Call sales", value: company.phone?.display, href: phoneHref, icon: Phone },
    { label: "Email sales", value: company.email, href: enquiryEmail(), icon: Mail },
    { label: "WhatsApp", value: "Start an enquiry", href: whatsappEnquiry(), icon: MessageCircle, external: true },
  ].filter((method) => method.href);

  return (
    <section className="company-section" id="about" aria-labelledby="about-title">
      <div className="container-shell company-grid">
        <div className="company-intro">
          {company.name && <p className="section-kicker">Company information</p>}
          <h2 id="about-title">{company.name ?? "Company information"}</h2>
          <p className="company-description">{company.about ?? company.description ?? "Company details will be added here."}</p>
          {company.location && <p className="company-location"><MapPin size={19} aria-hidden="true" />{company.location}</p>}
        </div>
        <div className="contact-panel" id="contact">
          <h2>Request a quote</h2>
          {methods.length ? (
            <>
              <p>Share the garment name or code, quantity and any required specifications.</p>
              <ul>
                {methods.map(({ label, value, href, icon: Icon, external }) => (
                  <li key={label}>
                    <a href={href ?? undefined} {...(external && { target: "_blank", rel: "noopener noreferrer", "aria-label": `${label} enquiry (opens in a new tab)` })}>
                      <span className="contact-icon"><Icon size={19} aria-hidden="true" /></span>
                      <span><strong>{label}</strong><span>{value}</span></span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : <p>Sales contact details will be added here.</p>}
        </div>
      </div>
    </section>
  );
}
