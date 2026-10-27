import Link from "next/link";
import type { HomepageStore } from "@/lib/cms/homepage-defaults";

export function AboutTeaser({ content }: { content: HomepageStore["about"] }) {
  return (
    <section className="home-section home-about paper" id="behind-the-work" aria-labelledby="about-teaser-title">
      <div className="home-about-layout">
        <div className="home-about-mark" aria-hidden>
          <span>ZA</span>
        </div>
        <div>
          <p className="home-eyebrow">{content.eyebrow}</p>
          <h2 id="about-teaser-title" className="manifesto home-section-title">
            {content.title}
          </h2>
          <p className="home-section-sub">{content.paragraph1}</p>
          <p className="home-section-sub">{content.paragraph2}</p>
          <p style={{ marginTop: 28 }}>
            <Link className="pill" href={content.ctaHref}>
              {content.ctaLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
