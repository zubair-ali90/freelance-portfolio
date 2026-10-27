import Link from "next/link";

export function AboutTeaser() {
  return (
    <section className="home-section home-about paper" id="behind-the-work" aria-labelledby="about-teaser-title">
      <div className="wrap home-about-layout">
        <div className="home-about-mark" aria-hidden>
          <span>ZA</span>
        </div>
        <div>
          <p className="home-eyebrow">Behind the Work / 05</p>
          <h2 id="about-teaser-title" className="manifesto home-section-title">
            One creative partner. From concept to delivery.
          </h2>
          <p className="home-section-sub">
            I&apos;m Zubair Ali, a 3D artist and interactive developer working across product visualization,
            animation, digital environments, and real-time experiences.
          </p>
          <p className="home-section-sub">
            I enjoy combining visual craftsmanship with technical problem-solving to create work that is
            not only beautiful but genuinely useful.
          </p>
          <p style={{ marginTop: 28 }}>
            <Link className="pill" href="/about">
              More About Me
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
