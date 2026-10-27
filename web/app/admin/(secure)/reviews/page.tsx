import { ReviewsManager } from "@/components/admin/ReviewsManager";
import { getAllReviews } from "@/lib/portfolio-reviews";
import { readEditableSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Reviews | Admin" };

export default async function AdminReviewsPage() {
  const { config } = await readEditableSiteConfig();
  const reviews = getAllReviews().map((review) => ({
    id: review.id,
    quote: review.quote ?? "",
    rating: review.rating,
    contractTitle: review.contractTitle,
    projectSlug: review.projectSlug,
    hasWrittenReview: review.hasWrittenReview,
    dates: review.dates ?? null,
  }));

  return <ReviewsManager initialConfig={config} reviews={reviews} />;
}
