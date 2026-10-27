import Link from "next/link";
import { formatRating, getPublicWrittenReviews } from "@/lib/portfolio-reviews";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = {
  title: "Client Feedback | Zubair Ali",
  description: "Verified Upwork client feedback transcribed from studio records.",
};

export default async function ReviewsPage() {
  const config = await readSiteConfig();
  const reviews = getPublicWrittenReviews(config.reviews.hiddenIds).filter(
    (review) => review.id !== "r25",
  );

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">client feedback</p>
          <h1>what clients said.</h1>
          <p>
            Written Upwork feedback associated with real contracts. Quotes are transcribed from studio
            records; no public review permalink is claimed. Rating-only contracts are omitted here.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="reviews-index">
            {reviews.map((review) => (
              <article key={review.id} className="reviews-index-card">
                <p className="review-stars" aria-label={`Rated ${formatRating(review.rating)}`}>
                  <span aria-hidden>
                    {"★".repeat(review.rating >= 4.95 ? 5 : Math.round(review.rating))}
                  </span>
                  <span className="review-stars-score">{formatRating(review.rating)}</span>
                </p>
                <blockquote>
                  <p>&ldquo;{review.quote}&rdquo;</p>
                </blockquote>
                <p className="reviews-index-contract">{review.contractTitle}</p>
                <p className="meta">
                  Client feedback · Upwork
                  {review.dates ? ` · ${review.dates}` : ""}
                </p>
                <p className="meta">{review.discipline}</p>
                {review.projectSlug ? (
                  <p style={{ marginTop: 14 }}>
                    <Link href={`/work/${review.projectSlug}`}>View related project</Link>
                  </p>
                ) : (
                  <p className="meta" style={{ marginTop: 14 }}>
                    Portfolio media for this contract is not published yet.
                  </p>
                )}
              </article>
            ))}
          </div>
          <p style={{ marginTop: 36 }}>
            <Link className="pill" href="/#client-trust">
              Back to homepage trust section
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
