import Link from "next/link";
import { UpworkHireLink } from "@/components/UpworkHireLink";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-glow" aria-hidden />

      <div className="wrap site-footer-inner">
        <div className="site-footer-intro">
          <p className="site-footer-label">Zubair Ali / Independent Creative</p>
          <h2 className="site-footer-headline">Ideas deserve dimension.</h2>
          <p className="site-footer-desc">
            I create 3D visuals, animation, and interactive experiences that turn ambitious ideas into
            something people can see, feel, and explore.
          </p>
          <div className="site-footer-actions">
            <UpworkHireLink className="pill solid site-footer-hire">Hire Me on Upwork</UpworkHireLink>
            <Link className="pill ghost-light" href="/work">
              View My Work
            </Link>
          </div>
        </div>

        <div className="site-footer-columns">
          <nav aria-label="Explore">
            <h3>Explore</h3>
            <Link href="/work">Selected Work</Link>
            <Link href="/reviews">Client Feedback</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About Me</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <nav aria-label="Connect">
            <h3>Connect</h3>
            <UpworkHireLink>Upwork Profile</UpworkHireLink>
            <UpworkHireLink>Start a Project</UpworkHireLink>
          </nav>
          <div>
            <h3>What I Do</h3>
            <p className="site-footer-specialty">Product CGI &amp; Animation</p>
            <p className="site-footer-specialty">Characters &amp; Motion</p>
            <p className="site-footer-specialty">Spaces &amp; Environments</p>
            <p className="site-footer-specialty">Interactive 3D &amp; AR</p>
          </div>
        </div>

        <p className="site-footer-signature" aria-hidden={false}>
          Zubair Ali
        </p>

        <div className="site-footer-bar">
          <p className="site-footer-copy">© {year} Zubair Ali. All rights reserved.</p>
          <p className="site-footer-tagline">Made with imagination. Built with precision.</p>
          <a className="site-footer-top" href="#top">
            Back to Top
          </a>
        </div>
      </div>
    </footer>
  );
}
