"use client";

import Link from "next/link";
import type { PortfolioReview } from "@/lib/portfolio-reviews";
import { ReviewCarousel } from "./ReviewCarousel";

export function TrustSection({
  reviews,
  eyebrow = "Client Trust / 04",
  title = "The work matters. So does the experience.",
  description = "From first concept to final delivery, I focus on clear communication, thoughtful execution, and results clients feel confident sharing.",
  support = "Feedback from real client projects.",
}: {
  reviews: PortfolioReview[];
  eyebrow?: string;
  title?: string;
  description?: string;
  support?: string;
}) {
  if (!reviews.length) return null;

  return (
    <section className="home-section home-trust cream" id="client-trust" aria-labelledby="trust-title">
      <div className="home-wrap home-section-intro">
        <p className="home-eyebrow">{eyebrow}</p>
        <h2 id="trust-title" className="manifesto home-section-title">
          {title}
        </h2>
        <p className="home-section-sub">{description}</p>
        <p className="home-section-sub home-trust-support">{support}</p>
      </div>

      <div className="home-wrap-wide home-trust-carousel-wrap">
        <ReviewCarousel reviews={reviews} />
      </div>

      <div className="home-wrap home-trust-footer">
        <p className="home-trust-disclaimer">
          Quotes are transcribed from Upwork contract feedback provided in studio records. No public
          review permalink is claimed. Ratings-only contracts are excluded from this carousel.
        </p>
        <p style={{ marginTop: 18 }}>
          <Link className="pill" href="/reviews">
            Browse all client feedback
          </Link>
        </p>
      </div>
    </section>
  );
}
