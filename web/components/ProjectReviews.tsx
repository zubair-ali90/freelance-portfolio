import type { PortfolioReview } from "@/lib/portfolio-reviews";
import { formatRating } from "@/lib/portfolio-reviews";

export function ProjectReviews({
  reviews,
  ratingOnly = [],
}: {
  reviews: PortfolioReview[];
  ratingOnly?: PortfolioReview[];
}) {
  if (!reviews.length && !ratingOnly.length) return null;

  return (
    <div className="project-reviews">
      <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: 10 }}>
        Client feedback
      </h2>

      <div className="project-reviews-list">
        {reviews.map((review) => (
          <blockquote key={review.id} className="project-review-card quote">
            <p className="review-stars" aria-label={`Rated ${formatRating(review.rating)}`}>
              <span aria-hidden>{"★".repeat(5)}</span>
              <span className="review-stars-score">{formatRating(review.rating)}</span>
            </p>
            <p>&ldquo;{review.quote}&rdquo;</p>
            <strong>
              Client feedback · Upwork
              <span className="quote-meta"> · {review.contractTitle}</span>
            </strong>
            {review.dates && <p className="meta">{review.dates}</p>}
          </blockquote>
        ))}
      </div>

      {ratingOnly.length > 0 && (
        <div className="project-rating-only">
          <p className="meta">Verified contract ratings without a written quote:</p>
          <ul>
            {ratingOnly.map((review) => (
              <li key={review.id}>
                {review.contractTitle} — {formatRating(review.rating)}
                {review.dates ? ` (${review.dates})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
