import Link from "next/link";
import { ProjectCover } from "@/components/ProjectMedia";
import { featuredProjects } from "@/lib/content";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>
          work that doesn&apos;t blend in<span>.</span>
        </h1>
        <p className="lede">For founders who hire a specialist, not a template.</p>
        <p className="sub">
          3D product, characters, spaces, and motion. Built to win the click on Upwork and hold up on the
          live site.
        </p>
        <div className="spark" />
        <div className="hero-actions">
          <Link className="pill on-dark" href="/contact">
            start a project
          </Link>
          <Link className="pill ghost-light" href="/work">
            see the work
          </Link>
        </div>
        <svg className="monogram" viewBox="0 0 640 280" aria-hidden>
          <text
            x="320"
            y="190"
            textAnchor="middle"
            fill="#e85a84"
            fontFamily="Georgia, serif"
            fontSize="150"
            fontWeight="700"
          >
            Zubair
          </text>
        </svg>
        <div className="scroll-hint">
          <span>[ scroll ]</span>
          <span>[ 3d &middot; motion ]</span>
        </div>
      </section>
      <div className="pixel-break" />

      <section className="section cream">
        <div className="wrap">
          <p className="kicker">[ for clients who can tell ]</p>
          <h2 className="manifesto">
            you already know when a render is almost right. this portfolio is for the jobs that have to be
            actually right.
          </h2>
          <div className="service-grid">
            <article className="service">
              <p className="kicker">01</p>
              <h3>Product</h3>
              <p>
                Watches, packaging, and objects with light that feels photographed, plus a clean turntable
                for the store.
              </p>
              <p style={{ marginTop: 16 }}>
                <Link href="/services">see product work</Link>
              </p>
            </article>
            <article className="service">
              <p className="kicker">02</p>
              <h3>Character</h3>
              <p>
                Mascots and stylized people with a few usable poses, so the brand is not stuck with one
                still.
              </p>
              <p style={{ marginTop: 16 }}>
                <Link href="/services">see character work</Link>
              </p>
            </article>
            <article className="service">
              <p className="kicker">03</p>
              <h3>Motion</h3>
              <p>
                App opens, explainers, and short films cut for a homepage, an ad, and an Upwork proposal.
              </p>
              <p style={{ marginTop: 16 }}>
                <Link href="/services">see motion work</Link>
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <h2 className="manifesto">recent work from the studio.</h2>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <Link key={project.slug} href={`/work/${project.slug}`} className="project-card">
                <ProjectCover project={project} />
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 28 }}>
            <Link className="pill" href="/work">
              view all work
            </Link>
          </p>
        </div>
      </section>

      <section className="section cream">
        <div className="wrap">
          <p className="kicker">[ why this studio ]</p>
          <h2 className="manifesto">
            one person holds the picture from the first frame to the file you upload.
          </h2>
          <div className="reason-grid">
            <article className="reason">
              <h3>Direct.</h3>
              <p>
                You talk to the person modeling, lighting, and exporting. No account manager retelling the
                brief.
              </p>
            </article>
            <article className="reason">
              <h3>Scoped.</h3>
              <p>Each job names the shots, the formats, and the revision round before the clock starts.</p>
            </article>
            <article className="reason">
              <h3>Ready to post.</h3>
              <p>
                Delivery includes web stills, a short loop, and a file named so your developer does not have
                to ask.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <h2 className="manifesto">sample notes, not real clients.</h2>
          <div className="quotes">
            <blockquote className="quote">
              <p>
                &ldquo;The turntable matched the photos we already had. We dropped it on the product page the
                same day.&rdquo;
              </p>
              <strong>Sample client &middot; product brand</strong>
            </blockquote>
            <blockquote className="quote">
              <p>&ldquo;Clear milestones. The explainer was short enough to actually finish.&rdquo;</p>
              <strong>Sample client &middot; SaaS</strong>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section cream cta">
        <div className="wrap">
          <h2>let&apos;s make the next frame.</h2>
          <p className="sub" style={{ color: "var(--ink-soft)" }}>
            Open a contract on Upwork, or send a short note with the reference and the deadline.
          </p>
          <div className="hero-actions">
            <Link className="pill solid" href="/contact">
              start a project
            </Link>
            <Link className="pill" href="/about">
              read the about
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
