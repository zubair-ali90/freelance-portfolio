import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Services | Zubair" };

export default async function ServicesPage() {
  const { pages } = await readSiteConfig();
  const services = pages.services;
  const offers = services.offers.filter((offer) => offer.enabled);

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">{services.eyebrow}</p>
          <h1>{services.headline}</h1>
          <p>{services.intro}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 12 }}>
        <div className="wrap service-grid">
          {offers.map((offer, index) => (
            <article key={offer.title} className="service">
              <p className="kicker">0{index + 1}</p>
              <h3>{offer.title}</h3>
              <p>{offer.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
