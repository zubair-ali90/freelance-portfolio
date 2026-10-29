"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/admin/dashboard", label: "Overview", match: ["/admin/dashboard"] },
  { href: "/admin/homepage", label: "Homepage", match: ["/admin/homepage"] },
  { href: "/admin/configuration", label: "My Work", match: ["/admin/configuration"] },
  { href: "/admin/projects", label: "Projects", match: ["/admin/projects"] },
  { href: "/admin/reviews", label: "Reviews", match: ["/admin/reviews"] },
  { href: "/admin/services", label: "Services", match: ["/admin/services"] },
  { href: "/admin/about", label: "About", match: ["/admin/about"] },
  { href: "/admin/contact", label: "Contact", match: ["/admin/contact"] },
  { href: "/admin/media", label: "Media Library", match: ["/admin/media"] },
  { href: "/admin/settings", label: "Global Settings", match: ["/admin/settings"] },
];

function isActive(pathname: string, match: string[]) {
  return match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AdminShell({
  children,
  hasDraft = false,
}: {
  children: React.ReactNode;
  hasDraft?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-shell admin-shell-top">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <p className="admin-brand">Zubair Portfolio Admin</p>
          <p className={`admin-status-pill ${hasDraft ? "is-draft" : "is-live"}`}>
            {hasDraft ? "Unpublished draft" : "All changes published"}
          </p>
        </div>
        <div className="admin-topbar-actions">
          <a className="pill ghost-light" href="/" target="_blank" rel="noopener noreferrer">
            Preview website
          </a>
          <a
            className="pill ghost-light"
            href="https://zubarirali.3dverse.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live site
          </a>
          <button type="button" className="pill admin-logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        <div className="admin-tabs-scroll">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              prefetch={false}
              className={isActive(pathname, tab.match) ? "admin-tab active" : "admin-tab"}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="admin-main" key={pathname}>
        {children}
      </div>
    </div>
  );
}
