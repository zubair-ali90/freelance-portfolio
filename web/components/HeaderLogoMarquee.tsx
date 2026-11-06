"use client";

import { CLIENT_LOGOS } from "@/lib/client-logos";

/** Compact infinite logo strip for the sticky site header. */
export function HeaderLogoMarquee() {
  const loop = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <div className="header-logos" aria-label="Client logos">
      <div className="header-logos-track">
        {loop.map((logo, index) => (
          <a
            key={`${logo.name}-${index}`}
            className="header-logos-item"
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            title={logo.name}
            tabIndex={index >= CLIENT_LOGOS.length ? -1 : undefined}
            aria-hidden={index >= CLIENT_LOGOS.length ? true : undefined}
          >
            <img src={logo.src} alt="" loading="lazy" decoding="async" />
          </a>
        ))}
      </div>
    </div>
  );
}
