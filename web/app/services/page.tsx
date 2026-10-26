export const metadata = { title: "Services | Zubair" };

const offers = [
  {
    title: "Product stills and turntables",
    detail: "One hero angle, three supporting angles, and a 4–6 second loop. Useful for Shopify, Amazon, and pitch decks.",
  },
  {
    title: "Character and mascot",
    detail: "A model, a simple rig, and three poses or a short loop. Built so later shots stay on-model.",
  },
  {
    title: "Spaces",
    detail: "Interior or exterior stills with lighting that matches the brand, not a default studio HDRI.",
  },
  {
    title: "Explainers and app motion",
    detail: "A short film or UI animation with a storyboard first, so the edit does not wander.",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">services</p>
          <h1>what you can hire.</h1>
          <p>Written the way an Upwork client scans a profile: outcome first, then the files they receive.</p>
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
