"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/lib/homepage-content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function ProcessSection() {
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
  const activeStep = Math.min(processSteps.length - 1, Math.floor(progress * processSteps.length));

  return (
    <section
      ref={ref}
      className="home-section home-process paper"
      id="process"
      aria-labelledby="process-title"
    >
      <div className="home-wrap home-section-intro">
        <p className="home-eyebrow">My Process / 03</p>
        <h2 id="process-title" className="manifesto home-section-title">
          From first idea to final frame.
        </h2>
        <p className="home-section-sub">
          Great results start with understanding the idea. I keep the process collaborative, focused, and
          clear from the first conversation to final delivery.
        </p>
      </div>

      <div className="home-process-track">
        <div className="home-process-line" aria-hidden>
          <span className="home-process-line-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <ol className="home-process-steps">
          {processSteps.map((step, index) => (
            <li
              key={step.index}
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
