import { UpworkHireLink } from "@/components/UpworkHireLink";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Contact | Zubair" };

export default async function ContactPage() {
  const config = await readSiteConfig();
  const contact = config.pages.contact;

  return (
    <main>
      <section className="page-hero contact-hero">
        <div className="wrap contact-hero-inner">
          <p className="kicker">{contact.eyebrow}</p>
          <h1>{contact.headline}</h1>
          {contact.intro ? <p className="contact-hero-lede">{contact.intro}</p> : null}
          <div className="contact-hero-actions">
            <UpworkHireLink className="pill solid" href={config.global.upworkUrl}>
              {contact.upworkLabel}
            </UpworkHireLink>
          </div>
        </div>
      </section>
    </main>
  );
}
