import type { ProjectClientInfo } from "@/lib/project-client-details";

export function ProjectClientBlock({ info }: { info: ProjectClientInfo }) {
  return (
    <div className="project-client-block">
      <p className="kicker">[ client &amp; scope ]</p>
      <h2 className="manifesto" style={{ fontSize: "clamp(24px, 3.5vw, 36px)", marginTop: 8 }}>
        {info.clientName}
      </h2>
      {info.clientUrl && (
        <p style={{ marginTop: 8 }}>
          <a href={info.clientUrl} target="_blank" rel="noopener noreferrer">
            {info.clientUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        </p>
      )}
      <p style={{ marginTop: 16, maxWidth: "52ch" }}>{info.scope}</p>
      {info.resources && info.resources.length > 0 && (
        <ul className="project-resource-list">
          {info.resources.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
