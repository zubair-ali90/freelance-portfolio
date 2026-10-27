"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ProcessStep = { index: string; title: string; body: string };

export function ProcessSection({
  eyebrow,
  title,
  description,
  steps,
}: {
  eyebrow: string;
  title: string;
  description: string;
  steps: ProcessStep[];
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const view = window.innerHeight;
      const start = view * 0.75;
      const end = view * 0.25;
      const raw = (start - rect.top) / (start - end + rect.height * 0.35);
      setScrollProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const progress = reduced ? 1 : scrollProgress;
  const activeStep = Math.min(Math.max(steps.length - 1, 0), Math.floor(progress * steps.length));

  return (
    <section
      ref={ref}
      className="home-section home-process paper"
      id="process"
      aria-labelledby="process-title"
    >
      <div className="home-wrap home-section-intro">
        <p className="home-eyebrow">{eyebrow}</p>
        <h2 id="process-title" className="manifesto home-section-title">
          {title}
        </h2>
        <p className="home-section-sub">{description}</p>
      </div>

      <div className="home-process-track">
        <div className="home-process-line" aria-hidden>
          <span className="home-process-line-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <ol className="home-process-steps">
          {steps.map((step, index) => (
            <li
              key={`${step.index}-${step.title}`}
              className={`home-process-step ${index <= activeStep ? "is-active" : ""}`}
            >
              <p className="home-process-num">{step.index}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
