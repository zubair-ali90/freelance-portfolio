"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { expertiseItems } from "@/lib/homepage-content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HomeMedia } from "./HomeMedia";

export function ExpertiseSection({ mediaBySlug }: { mediaBySlug: Record<string, Project | undefined> }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const nodes = itemRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActive(index);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.25, 0.5, 0.75] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section className="home-section home-expertise cream" id="expertise" aria-labelledby="expertise-title">
      <div className="home-wrap home-section-intro">
        <p className="home-eyebrow">What I Create / 02</p>
        <h2 id="expertise-title" className="manifesto home-section-title">
          The right visual for the right idea.
        </h2>
        <p className="home-section-sub">
          From the first frame to the final interactive experience, I combine creativity and technology to
          bring complex ideas to life.
        </p>
      </div>

      <div className="home-expertise-layout">
        <div className="home-expertise-visual" aria-hidden>
          {expertiseItems.map((item, index) => {
            const project = mediaBySlug[item.mediaSlug];
            if (!project) return null;
            return (
              <div key={item.id} className={`home-expertise-frame ${index === active ? "is-active" : ""}`}>
                <HomeMedia
                  src={project.cover}
                  title={project.title}
                  className="home-expertise-media"
                  active={index === active}
                />
              </div>
            );
          })}
        </div>

        <ol className="home-expertise-list">
          {expertiseItems.map((item, index) => (
            <li
              key={item.id}
              data-index={index}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className={`home-expertise-item ${index === active ? "is-active" : ""}`}
            >
              <button
                type="button"
                className="home-expertise-trigger"
                onClick={() => setActive(index)}
                aria-current={index === active ? "true" : undefined}
              >
                <span className="home-expertise-num">{item.index}</span>
                <span>
                  <span className="home-expertise-name">{item.title}</span>
                  <span className="home-expertise-body">{item.body}</span>
                </span>
              </button>
              <Link className="home-expertise-link" href={item.href}>
                View related work
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="home-expertise-cta">
        <Link className="pill" href="/services">
          Explore My Services
        </Link>
      </div>
    </section>
  );
}
