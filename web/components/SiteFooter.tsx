import Link from "next/link";
import { Suspense } from "react";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import { buildDefaultGlobal } from "@/lib/cms/homepage-defaults";
import { readSiteConfig } from "@/lib/site-config";
import type { GlobalSiteSettings } from "@/lib/cms/homepage-defaults";

const year = new Date().getFullYear();

function FooterMarkup({ global }: { global: GlobalSiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-glow" aria-hidden />

      <div className="wrap site-footer-inner">
        <div className="site-footer-intro">
          <p className="site-footer-label">{global.footerLabel}</p>
          <h2 className="site-footer-headline">{global.footerHeadline}</h2>
          <p className="site-footer-desc">{global.footerDescription}</p>
          <div className="site-footer-actions">
            <UpworkHireLink className="pill solid site-footer-hire" href={global.upworkUrl}>
              Hire Me on Upwork
            </UpworkHireLink>
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
            <UpworkHireLink href={global.upworkUrl}>Upwork Profile</UpworkHireLink>
            <UpworkHireLink href={global.upworkUrl}>Start a Project</UpworkHireLink>
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
          <p className="site-footer-tagline">{global.footerTagline}</p>
          <a className="site-footer-top" href="#top">
            Back to Top
          </a>
        </div>
      </div>
    </footer>
  );
}

async function SiteFooterAsync() {
  const config = await readSiteConfig();
  return <FooterMarkup global={config.global} />;
}

export function SiteFooter() {
  return (
    <Suspense fallback={<FooterMarkup global={buildDefaultGlobal()} />}>
      <SiteFooterAsync />
    </Suspense>
  );
}
