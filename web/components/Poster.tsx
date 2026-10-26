import type { Project } from "@/lib/content";

export function Poster({ project }: { project: Project }) {
  const { hue, accent, kind, title } = project;
  return (
    <div className="poster" style={{ background: hue }} aria-hidden>
      <svg viewBox="0 0 640 440" role="img">
        <title>{`${title} dummy preview`}</title>
        <rect width="640" height="440" fill={hue} />
        <circle cx="480" cy="120" r="90" fill={accent} opacity="0.9" />
        <circle cx="160" cy="300" r="120" fill="#000" opacity="0.25" />
        {kind === "product" && (
          <>
            <rect x="220" y="150" width="200" height="140" rx="70" fill="#f4f0e6" />
            <rect x="250" y="175" width="140" height="18" rx="9" fill={hue} />
            <circle cx="290" cy="230" r="16" fill={accent} />
          </>
        )}
        {kind === "character" && (
          <>
            <circle cx="320" cy="170" r="58" fill="#f4f0e6" />
            <rect x="250" y="230" width="140" height="120" rx="50" fill={accent} />
            <circle cx="300" cy="164" r="6" fill={hue} />
            <circle cx="338" cy="164" r="6" fill={hue} />
          </>
        )}
        {kind === "space" && (
          <>
            <path d="M120 320 L320 120 L520 320 Z" fill="#f4f0e6" />
            <rect x="250" y="230" width="140" height="90" fill={accent} />
          </>
        )}
        {kind === "motion" && (
          <>
            <rect x="150" y="110" width="340" height="210" rx="18" fill="#f4f0e6" />
            <polygon points="290,175 290,255 370,215" fill={accent} />
          </>
        )}
      </svg>
      <span className="poster-label">Dummy preview</span>
    </div>
  );
}
