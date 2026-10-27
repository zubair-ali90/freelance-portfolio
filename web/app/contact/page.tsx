import { ContactForm } from "@/components/ContactForm";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Contact | Zubair" };

export default async function ContactPage() {
  const config = await readSiteConfig();
  const contact = config.pages.contact;

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">{contact.eyebrow}</p>
          <h1>{contact.headline}</h1>
          <p>{contact.intro}</p>
          <p className="meta" style={{ marginTop: 12 }}>
            {contact.formNote}
          </p>
          <p style={{ marginTop: 18 }}>
            <UpworkHireLink className="pill solid" href={config.global.upworkUrl}>
              {contact.upworkLabel}
            </UpworkHireLink>
          </p>
        </div>
      </section>
      {contact.formVisible && (
        <section className="section" style={{ paddingTop: 10 }}>
          <div className="wrap" style={{ maxWidth: 720 }}>
            <ContactForm
              successMessage={contact.successMessage}
              errorMessage={contact.errorMessage}
            />
          </div>
        </section>
      )}
    </main>
  );
}
