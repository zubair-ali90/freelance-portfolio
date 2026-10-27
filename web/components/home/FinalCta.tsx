import Link from "next/link";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import type { HomepageStore } from "@/lib/cms/homepage-defaults";

export function FinalCta({ content }: { content: HomepageStore["finalCta"] }) {
  const primaryIsUpwork = /upwork\.com/i.test(content.primaryHref);

  return (
    <section className="home-section home-final-cta" aria-labelledby="final-cta-title">
      <div className="home-final-inner">
        <p className="home-eyebrow home-eyebrow-light">{content.eyebrow}</p>
        <h2 id="final-cta-title" className="home-final-title">
          {content.title.includes("real") ? (
            <>
              {content.title.replace(/real\.?$/i, "").trim()} <span>real.</span>
            </>
          ) : (
            content.title
          )}
        </h2>
        <p className="home-final-body">{content.description}</p>
        <p className="home-final-body">{content.closing}</p>
        <div className="hero-actions home-final-actions">
          {primaryIsUpwork ? (
            <UpworkHireLink className="pill solid home-final-hire" href={content.primaryHref}>
              {content.primaryLabel}
            </UpworkHireLink>
          ) : (
            <Link className="pill solid home-final-hire" href={content.primaryHref}>
              {content.primaryLabel}
            </Link>
          )}
          <Link className="pill ghost-light" href={content.secondaryHref}>
            {content.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
