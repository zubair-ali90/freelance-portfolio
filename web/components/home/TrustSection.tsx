"use client";

import Link from "next/link";
import type { Project } from "@/lib/content";
import type { ProjectClientInfo } from "@/lib/project-client-details";

export type TrustCard = {
  project: Project;
  client: ProjectClientInfo;
};

function evidenceLead(client: ProjectClientInfo) {
  const lead = client.scope.split(/(?<=[.!?])\s+/)[0]?.trim();
  return lead && lead.length > 20 ? lead : client.scope;
}

/**
 * Project-based collaboration evidence only.
 * Paraphrased “review” strings are not shown as testimonials until verified client quotes exist.
 */
export function TrustSection({ cards }: { cards: TrustCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section className="home-section home-trust cream" id="client-trust" aria-labelledby="trust-title">
      <div className="wrap home-section-intro">
        <p className="home-eyebrow">Client Trust / 04</p>
        <h2 id="trust-title" className="manifesto home-section-title">
          Good work is built on trust.
        </h2>
        <p className="home-section-sub">
          The final result should do more than look impressive. It should communicate clearly, meet the
          project&apos;s needs, and work in the real world.
        </p>
        <p className="home-section-sub home-trust-support">
          Explore the work, the details behind it, and feedback from previous collaborations.
        </p>
      </div>

      <div className="wrap home-trust-grid">
        {cards.map(({ project, client }) => (
          <article key={project.slug} className="home-trust-card">
            <p className="home-eyebrow">{client.clientName}</p>
            <h3 className="home-trust-quote">{project.title}</h3>
            <p className="home-trust-evidence">{evidenceLead(client)}</p>
            {client.clientUrl && (
              <p className="meta">
                <a href={client.clientUrl} target="_blank" rel="noopener noreferrer">
                  {client.clientUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </p>
            )}
            <p style={{ marginTop: 14 }}>
              <Link href={`/work/${project.slug}`}>View project</Link>
            </p>
          </article>
        ))}
      </div>
      <div className="wrap">
        <p className="home-trust-disclaimer">
          Verified client quotes are not published on this page yet. Cards above cite named
          collaborations and project scope from studio records — open each project for full details.
        </p>
      </div>
    </section>
  );
}
