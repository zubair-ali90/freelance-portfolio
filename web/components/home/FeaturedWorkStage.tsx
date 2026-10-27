"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import type { FeaturedChapterCopy } from "@/lib/homepage-content";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HomeMedia } from "./HomeMedia";

export type FeaturedChapter = FeaturedChapterCopy & {
  project: Project;
};

function ChapterCopy({
  chapter,
  index,
  total,
  active,
}: {
  chapter: FeaturedChapter;
  index: number;
  total: number;
  active: boolean;
}) {
  const pad = String(index + 1).padStart(2, "0");
  const totalPad = String(total).padStart(2, "0");
  return (
    <div className={`home-featured-copy ${active ? "is-active" : ""}`} aria-hidden={!active}>
      <p className="home-featured-index">
        {pad} / {totalPad}
      </p>
      <p className="home-eyebrow">{chapter.clientLabel}</p>
      <h3 className="home-featured-headline">{chapter.headline}</h3>
      <p className="home-featured-body">{chapter.body}</p>
      <Link className="pill solid" href={`/work/${chapter.slug}`}>
        {chapter.cta}
      </Link>
    </div>
  );
}

function StickyDesktopStage({ chapters }: { chapters: FeaturedChapter[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const travel = Math.max(track.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      const progress = scrolled / travel;
      const next = Math.min(chapters.length - 1, Math.floor(progress * chapters.length + 0.001));
      setActive((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [chapters.length]);

  const current = chapters[active] ?? chapters[0];

  return (
    <div
      ref={trackRef}
      className="home-featured-track"
      style={{ height: `${chapters.length * 75}vh` }}
    >
      <div className="home-featured-sticky">
        <div className="home-featured-stage wrap wrap-wide">
          <div className="home-featured-visual">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.slug}
                className={`home-featured-frame ${index === active ? "is-active" : ""}`}
              >
                <HomeMedia
                  src={chapter.project.cover}
                  title={chapter.project.title}
                  className="home-featured-media"
                  priority={index === 0}
                  active={index === active}
                />
              </div>
            ))}
            <div className="home-featured-progress" aria-hidden>
              {chapters.map((chapter, index) => (
                <span
                  key={chapter.slug}
                  className={`home-featured-dot ${index === active ? "is-active" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="home-featured-sidebar">
            {chapters.map((chapter, index) => (
              <ChapterCopy
                key={chapter.slug}
                chapter={chapter}
                index={index}
                total={chapters.length}
                active={index === active}
              />
            ))}
            {current && (
              <p className="home-featured-live-title sr-only">
                Viewing {current.clientLabel}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedMobileStage({ chapters }: { chapters: FeaturedChapter[] }) {
  return (
    <div className="home-featured-stack">
      {chapters.map((chapter, index) => (
        <article key={chapter.slug} className="home-featured-card">
          <div className="home-featured-card-media">
            <HomeMedia
              src={chapter.project.cover}
              title={chapter.project.title}
              className="home-featured-media"
              priority={index === 0}
              active
            />
          </div>
          <ChapterCopy chapter={chapter} index={index} total={chapters.length} active />
        </article>
      ))}
    </div>
  );
}

export function FeaturedWorkStage({ chapters }: { chapters: FeaturedChapter[] }) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const useSticky = !reduced && !isMobile && chapters.length > 0;

  if (chapters.length === 0) return null;

  return (
    <section className="home-section home-featured" id="selected-work" aria-labelledby="selected-work-title">
      <div className="wrap home-section-intro">
        <p className="home-eyebrow">Selected Work / 01</p>
        <h2 id="selected-work-title" className="manifesto home-section-title">
          See the idea come to life.
        </h2>
        <p className="home-section-sub">
          A closer look at projects where detail, motion, and interaction make the difference.
        </p>
      </div>

      {useSticky ? <StickyDesktopStage chapters={chapters} /> : <StackedMobileStage chapters={chapters} />}

      <div className="wrap home-featured-footer">
        <Link className="pill" href="/work">
          View All Projects
        </Link>
      </div>
    </section>
  );
}
