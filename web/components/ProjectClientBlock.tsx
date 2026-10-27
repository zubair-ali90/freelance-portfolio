import Link from "next/link";
import type { ProjectClientInfo } from "@/lib/project-client-details";

export function ProjectClientBlock({ info }: { info: ProjectClientInfo }) {
  return (
    <div className="project-client-block">
      <p className="kicker">[ client &amp; scope ]</p>
      <h2 className="manifesto" style={{ fontSize: "clamp(24px, 3.5vw, 36px)", marginTop: 8 }}>
        {info.clientName}
      </h2>
      {info.clientUrl && (
        <p style={{ marginTop: 8 }}>
          <a href={info.clientUrl} target="_blank" rel="noopener noreferrer">
            {info.clientUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        </p>
      )}
      <p style={{ marginTop: 16, maxWidth: "52ch" }}>{info.scope}</p>
      {info.review && (
        <blockquote className="quote project-client-quote">
          <p>&ldquo;{info.review}&rdquo;</p>
          <strong>{info.clientName}</strong>
        </blockquote>
      )}
      {info.resources && info.resources.length > 0 && (
        <ul className="project-resource-list">
          {info.resources.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ClientReviewsSection({
  reviews,
}: {
  reviews: { quote: string; clientName: string; subtitle: string; projectSlug: string }[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="section paper" id="client-reviews">
      <div className="wrap">
        <p className="kicker">[ reviews from clients ]</p>
        <h2 className="manifesto">what clients say after the files land.</h2>
        <div className="quotes">
          {reviews.map((item) => (
            <blockquote key={item.projectSlug} className="quote">
              <p>&ldquo;{item.quote}&rdquo;</p>
              <strong>
                {item.clientName}
                <span className="quote-meta"> · {item.subtitle}</span>
              </strong>
              <p style={{ marginTop: 12 }}>
                <Link href={`/work/${item.projectSlug}`}>view project</Link>
              </p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
