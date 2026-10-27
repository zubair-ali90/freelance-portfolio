"use client";

import Link from "next/link";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import { HomeMedia } from "./HomeMedia";

export function HomeHero({ mediaSrc }: { mediaSrc: string }) {
  return (
    <section className="home-hero" aria-label="Introduction">
      <div className="home-hero-media" aria-hidden>
        <HomeMedia src={mediaSrc} title="Featured motion" className="home-hero-video" priority active />
        <div className="home-hero-veil" />
      </div>

      <div className="home-hero-content">
        <p className="home-eyebrow home-eyebrow-light">Zubair Ali / 3D Artist &amp; Interactive Developer</p>
        <h1 className="home-hero-title">
          3D that goes beyond the <span>render.</span>
        </h1>
        <p className="home-hero-lede">
          I create product visuals, character animation, immersive spaces, and interactive 3D
          experiences—helping brands and teams turn ideas into something people can see, understand, and
          explore.
        </p>
        <div className="hero-actions home-hero-actions">
          <Link className="pill on-dark" href="#selected-work">
            Explore My Work
          </Link>
          <UpworkHireLink className="pill ghost-light">Hire Me on Upwork</UpworkHireLink>
        </div>
      </div>

      <a className="home-scroll-indicator" href="#selected-work">
        <span className="home-scroll-line" aria-hidden />
        <span>Scroll to Explore</span>
      </a>
    </section>
  );
}
