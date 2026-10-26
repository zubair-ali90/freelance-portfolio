"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { href: "/work", label: "work" },
  { href: "/services", label: "services" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="mark" aria-label="Zubair home">
        Z
      </Link>
      <nav className="nav-pills" aria-label="Primary">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link key={link.href} href={link.href} className={active ? "pill active" : "pill"}>
              {link.label}
            </Link>
          );
        })}
        <Link href="/contact" className="pill solid">
          hire on upwork
        </Link>
      </nav>
    </header>
  );
}
