"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PortfolioReview } from "@/lib/portfolio-reviews";
import { excerptQuote, formatRating } from "@/lib/portfolio-reviews";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PREVIEW_LEN = 240;

function StarRow({ rating }: { rating: number }) {
  const label = formatRating(rating);
  const filled = rating >= 4.95 ? 5 : Math.round(rating);
  return (
    <p className="review-stars" aria-label={`Rated ${label}`}>
      <span aria-hidden>
        {"★".repeat(filled)}
        {"☆".repeat(Math.max(0, 5 - filled))}
      </span>
      <span className="review-stars-score">{label}</span>
    </p>
  );
}

function ReviewCard({
  review,
  expanded,
  onToggle,
}: {
  review: PortfolioReview;
  expanded: boolean;
  onToggle: () => void;
}) {
  const quote = review.quote?.trim() ?? "";
  const needsExpand = quote.length > PREVIEW_LEN;
  const shown = expanded || !needsExpand ? quote : excerptQuote(quote, PREVIEW_LEN);

  return (
    <article className="review-card" aria-label={`Client feedback: ${review.contractTitle}`}>
      <p className="review-mark" aria-hidden>
        “
      </p>
      <StarRow rating={review.rating} />
      <blockquote className="review-quote">
        <p>{shown}</p>
      </blockquote>
      {needsExpand && (
        <button type="button" className="review-expand" onClick={onToggle}>
          {expanded ? "Show less" : "Read full review"}
        </button>
      )}
      <p className="review-contract">{review.contractTitle}</p>
      <p className="review-meta">
        Client feedback · Upwork
        <span className="quote-meta"> · {review.discipline}</span>
      </p>
      {review.projectSlug ? (
        <p className="review-project-link">
          <Link href={`/work/${review.projectSlug}`}>View Project</Link>
        </p>
      ) : (
        <p className="review-project-link meta">Associated portfolio media pending</p>
      )}
    </article>
  );
}

export function ReviewCarousel({ reviews }: { reviews: PortfolioReview[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-review-card]")];
    if (!cards.length) return;

    const mid = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let best = Number.POSITIVE_INFINITY;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < best) {
        best = dist;
        closest = i;
      }
    });
    setIndex(closest);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync, reviews.length]);

  const scrollToIndex = (next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-review-card]")];
    const card = cards[Math.max(0, Math.min(reviews.length - 1, next))];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - 8,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      scrollToIndex(reviews.length - 1);
    }
  };

  if (!reviews.length) return null;

  const pad = String(index + 1).padStart(2, "0");
  const total = String(reviews.length).padStart(2, "0");

  return (
    <div className="review-carousel">
      <div className="review-carousel-toolbar">
        <p id={labelId} className="review-carousel-progress" aria-live="polite">
          {pad} / {total}
        </p>
        <div className="review-carousel-actions">
          <button
            type="button"
            className="review-nav-btn"
            aria-label="Previous review"
            disabled={!canPrev}
            onClick={() => scrollToIndex(index - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="review-nav-btn"
            aria-label="Next review"
            disabled={!canNext}
            onClick={() => scrollToIndex(index + 1)}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="review-carousel-track"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {reviews.map((review) => (
          <div key={review.id} className="review-carousel-slide" data-review-card>
            <ReviewCard
              review={review}
              expanded={expandedId === review.id}
              onToggle={() => setExpandedId((current) => (current === review.id ? null : review.id))}
            />
          </div>
        ))}
      </div>

      <div className="review-carousel-dots" aria-hidden>
        <span
          className="review-carousel-dot-fill"
          style={{ width: `${((index + 1) / reviews.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
