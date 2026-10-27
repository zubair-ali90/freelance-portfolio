import Link from "next/link";
import { UpworkHireLink } from "@/components/UpworkHireLink";

export function FinalCta() {
  return (
    <section className="home-section home-final-cta" aria-labelledby="final-cta-title">
      <div className="wrap home-final-inner">
        <p className="home-eyebrow home-eyebrow-light">Your Idea, Brought to Life / 06</p>
        <h2 id="final-cta-title" className="home-final-title">
          Have an idea? Let&apos;s make it <span>real.</span>
        </h2>
        <p className="home-final-body">
          Whether you need a standout product render, an engaging animation, or an interactive 3D
          experience, I&apos;d love to hear what you&apos;re building.
        </p>
        <p className="home-final-body">Let&apos;s turn your next idea into something people remember.</p>
        <div className="hero-actions home-final-actions">
          <UpworkHireLink className="pill on-dark">Hire Me on Upwork</UpworkHireLink>
          <Link className="pill ghost-light" href="/work">
            Explore All Work
          </Link>
        </div>
      </div>
    </section>
  );
}
