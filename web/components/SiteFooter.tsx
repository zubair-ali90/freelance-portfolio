import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="mark" style={{ color: "#f4f0e6", borderColor: "#f4f0e6" }}>
          Z
        </Link>
        <p>3D, motion, and product visuals for founders who hire on Upwork.</p>
      </div>
      <nav className="footer-links" aria-label="Site map">
        <div>
          <h4>work</h4>
          <Link href="/work">projects</Link>
          <Link href="/services">services</Link>
          <Link href="/contact">start a project</Link>
        </div>
        <div>
          <h4>studio</h4>
          <Link href="/about">about</Link>
          <Link href="/contact">availability</Link>
        </div>
        <div>
          <h4>upwork</h4>
          <a href="https://www.upwork.com" target="_blank" rel="noreferrer">
            profile link goes here
          </a>
          <Link href="/contact">email</Link>
        </div>
      </nav>
      <p className="legal">
        Dummy portfolio for layout review. Artwork on this site is placeholder, not client work.
      </p>
    </footer>
  );
}
