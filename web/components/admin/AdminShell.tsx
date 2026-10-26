"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Project management" },
  { href: "/admin/configuration", label: "Configuration", disabled: true },
  { href: "/admin/analytics", label: "Analytics", disabled: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-brand">Portfolio admin</p>
        <nav aria-label="Admin">
          {nav.map((item) =>
            item.disabled ? (
              <span key={item.href} className="admin-nav-link admin-nav-disabled">
                {item.label}
                <small>soon</small>
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "admin-nav-link active" : "admin-nav-link"}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <button type="button" className="pill admin-logout" onClick={logout}>
          Sign out
        </button>
        <Link href="/" className="admin-back">
          ← Public site
        </Link>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
