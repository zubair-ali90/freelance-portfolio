"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HeaderLogoMarquee } from "@/components/HeaderLogoMarquee";
import { UpworkHireLink } from "@/components/UpworkHireLink";

const links = [
  { href: "/work", label: "work" },
  { href: "/services", label: "services" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

const HEADER_OFFSET = 80;

export function SiteHeader() {
  const pathname = usePathname();
  const [showClientLogos, setShowClientLogos] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setShowClientLogos(false);
      return;
    }

    const update = () => {
      const section = document.getElementById("client-logos");
      if (!section) {
        setShowClientLogos(false);
        return;
      }
      // Reveal in the header once the homepage logo strip has scrolled past.
      setShowClientLogos(section.getBoundingClientRect().bottom < HEADER_OFFSET);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <header className={`site-header${showClientLogos ? " has-client-logos" : ""}`}>
      <Link href="/" className="mark" aria-label="Zubair home">
        Z
      </Link>
      {showClientLogos ? <HeaderLogoMarquee /> : <div className="header-logos-spacer" aria-hidden />}
      <nav className="nav-pills" aria-label="Primary">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link key={link.href} href={link.href} className={active ? "pill active" : "pill"}>
              {link.label}
            </Link>
          );
        })}
        <UpworkHireLink className="pill solid">hire on upwork</UpworkHireLink>
      </nav>
    </header>
  );
}
