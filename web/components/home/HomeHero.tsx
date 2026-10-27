"use client";

import Link from "next/link";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import type { HomepageStore } from "@/lib/cms/homepage-defaults";
import { HomeMedia } from "./HomeMedia";

export function HomeHero({
  mediaSrc,
  content,
}: {
  mediaSrc: string;
  content: HomepageStore["hero"];
}) {
  const secondaryIsUpwork = /upwork\.com/i.test(content.secondaryCtaHref);

  return (
    <section className="home-hero" aria-label="Introduction">
      <div className="home-hero-media" aria-hidden>
        <HomeMedia src={mediaSrc} title="Featured motion" className="home-hero-video" priority active />
        <div className="home-hero-veil" />
      </div>

      <div className="home-hero-content">
        <p className="home-eyebrow home-eyebrow-light">{content.eyebrow}</p>
        <h1 className="home-hero-title">
          {content.headline.includes("render") ? (
            <>
              {content.headline.replace(/render\.?$/i, "").trim()}{" "}
              <span>render.</span>
            </>
          ) : (
            content.headline
          )}
        </h1>
        <p className="home-hero-lede">{content.description}</p>
        <div className="hero-actions home-hero-actions">
          <Link className="pill on-dark" href={content.primaryCtaHref}>
            {content.primaryCtaLabel}
          </Link>
          {secondaryIsUpwork ? (
            <UpworkHireLink className="pill ghost-light" href={content.secondaryCtaHref}>
              {content.secondaryCtaLabel}
            </UpworkHireLink>
          ) : (
            <Link className="pill ghost-light" href={content.secondaryCtaHref}>
              {content.secondaryCtaLabel}
            </Link>
          )}
        </div>
      </div>

      <a className="home-scroll-indicator" href={content.primaryCtaHref || "#selected-work"}>
        <span className="home-scroll-line" aria-hidden />
        <span>{content.scrollLabel}</span>
      </a>
    </section>
  );
}
