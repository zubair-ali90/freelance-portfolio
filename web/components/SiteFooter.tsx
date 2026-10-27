import Link from "next/link";
import { UpworkHireLink } from "@/components/UpworkHireLink";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="mark" style={{ color: "#f4f0e6", borderColor: "#f4f0e6" }}>
          Z
        </Link>
        <p className="footer-name">Zubair Ali</p>
        <p>3D Art. Animation. Interactive Experiences.</p>
      </div>
      <nav className="footer-links" aria-label="Site map">
        <div>
          <h4>navigate</h4>
          <Link href="/work">Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h4>upwork</h4>
          <UpworkHireLink>View My Upwork Profile</UpworkHireLink>
        </div>
        <div>
          <h4>contact</h4>
          <Link href="/contact">Message</Link>
          <UpworkHireLink>Hire on Upwork</UpworkHireLink>
        </div>
      </nav>
      <p className="legal">Made with imagination. Built with precision.</p>
      <p className="legal footer-note">
        Selected freelance work from live client collaborations. Contact form on this site stores
        messages locally only and does not email yet — hire via Upwork for a real conversation.
      </p>
    </footer>
  );
}
