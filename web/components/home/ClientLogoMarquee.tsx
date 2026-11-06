"use client";

import { CLIENT_LOGOS } from "@/lib/client-logos";

export function ClientLogoMarquee() {
  const loop = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="home-section home-logos paper" id="client-logos" aria-label="Client logos">
      <div className="home-logos-marquee">
        <div className="home-logos-track">
          {loop.map((logo, index) => (
            <a
              key={`${logo.name}-${index}`}
              className="home-logos-item"
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              title={logo.name}
              tabIndex={index >= CLIENT_LOGOS.length ? -1 : undefined}
              aria-hidden={index >= CLIENT_LOGOS.length ? true : undefined}
            >
              <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
