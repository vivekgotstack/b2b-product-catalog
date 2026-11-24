import { Mail, MapPin, MessageCircle, Phone, MessagesSquare } from "lucide-react";
import { company } from "@/config/company";
import { enquiryEmail, phoneHref, whatsappEnquiry } from "@/lib/contact";

export function ContactSection() {
  const methods = [
    { label: "Email sales", value: company.email, href: enquiryEmail(), icon: Mail },
    { label: "Call sales", value: company.phone?.display, href: phoneHref, icon: Phone },
    { label: "WhatsApp", value: "Start an enquiry", href: whatsappEnquiry(), icon: MessageCircle, external: true },
  ].filter((method) => method.href);

  return (
    <section className="company-section" id="about" aria-labelledby="about-title">
      <div className="container-shell company-grid">
        <div className="company-intro">
          <h2 id="about-title">{company.name ?? "About the catalogue"}</h2>
          <p className="company-description">{company.about ?? company.description ?? "Explore garment styles, colours and specifications before placing a bulk enquiry."}</p>
          {company.location && <p className="company-location"><MapPin size={19} aria-hidden="true" />{company.location}</p>}
        </div>
        <section className="contact-panel" id="contact" tabIndex={-1} aria-labelledby="contact-title">
          <div className="contact-heading">
            <span className="contact-icon"><MessagesSquare size={22} aria-hidden="true" /></span>
            <h2 id="contact-title">Contact sales</h2>
          </div>
          {methods.length ? (
            <>
              <p>For a bulk quote, share the product name or SKU, quantity, sizes and delivery location.</p>
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
          ) : <p>Sales contact details are being set up. Please check back for bulk enquiries.</p>}
        </section>
      </div>
    </section>
  );
}
