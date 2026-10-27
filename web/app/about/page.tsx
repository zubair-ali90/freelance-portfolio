import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "About | Zubair" };

export default async function AboutPage() {
  const { pages } = await readSiteConfig();
  const about = pages.about;

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">{about.eyebrow}</p>
          <h1>{about.headline}</h1>
          <p>{about.intro}</p>
          {about.editorialFlag ? (
            <p className="meta" style={{ marginTop: 16, color: "#8a5a2b" }}>
              {about.editorialFlag}
            </p>
          ) : null}
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap reason-grid">
          <article className="reason">
            <h3>{about.startTitle}</h3>
            <p>{about.startBody}</p>
          </article>
          <article className="reason">
            <h3>{about.finishTitle}</h3>
            <p>{about.finishBody}</p>
          </article>
          <article className="reason">
            <h3>{about.hireTitle}</h3>
            <p>{about.hireBody}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
