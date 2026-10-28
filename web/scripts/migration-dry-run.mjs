import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(
  readFileSync(path.join(root, "data", "work_portfolio_source_data.json"), "utf8"),
);
const projects = JSON.parse(readFileSync(path.join(root, "lib", "projects.json"), "utf8"));
const mapSrc = readFileSync(path.join(root, "lib", "portfolio-map.ts"), "utf8");

const sourceIdToSlug = {};
for (const match of mapSrc.matchAll(/"([^"]+)":\s*("([^"]+)"|null)/g)) {
  sourceIdToSlug[match[1]] = match[3] ?? null;
}

const matched = [];
const missing = [];
const candidates = [];

for (const project of source.projects) {
  const slug = sourceIdToSlug[project.id];
  if (slug) {
    matched.push({ sourceId: project.id, slug, title: project.title });
    continue;
  }
  if (String(project.status).includes("media-pending") || project.status === "review_evidence_only") {
    missing.push({ sourceId: project.id, title: project.title, status: project.status });
  } else {
    candidates.push({ sourceId: project.id, title: project.title, status: project.status });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  liveProjectCount: projects.length,
  sourceProjectCount: source.projects.length,
  sourceReviewCount: source.reviews.length,
  matchedExisting: matched,
  missingMediaOrReviewOnly: missing,
  candidateNewDraft: candidates,
  foxMergeNote:
    "stylized-fox-vrm maps to unity-unity-character — merged, not duplicated.",
  actionTaken:
    "No destructive import. Enrichment reads matched source text for case studies only.",
};

const out = path.join(root, "..", "Docs", "MIGRATION_DRY_RUN.md");
const md = `# MIGRATION DRY RUN

Generated: ${report.generatedAt}

## Inventory

- Live base projects: **${report.liveProjectCount}**
- Supplemental source projects: **${report.sourceProjectCount}**
- Source reviews: **${report.sourceReviewCount}**

## Actions

- **No wipe / no clone import.** Live 51-project collection preserved.
- Matched source records enrich case-study overview/story blocks when slug mapping exists.
- Unmapped / media-pending items stay out of public routes.

## Fox merge

${report.foxMergeNote}

## Matched existing (${matched.length})

| Source ID | Live slug | Title |
|---|---|---|
${matched.map((row) => `| ${row.sourceId} | ${row.slug} | ${row.title.replace(/\|/g, "/")} |`).join("\n")}

## Missing media / review-only (${missing.length})

| Source ID | Title | Status |
|---|---|---|
${missing.map((row) => `| ${row.sourceId} | ${row.title.replace(/\|/g, "/")} | ${row.status} |`).join("\n")}

## Candidate new drafts (${candidates.length})

| Source ID | Title | Status |
|---|---|---|
${candidates.map((row) => `| ${row.sourceId} | ${row.title.replace(/\|/g, "/")} | ${row.status} |`).join("\n") || "| — | none | — |"}
`;

writeFileSync(out, md);
console.log(JSON.stringify({ matched: matched.length, missing: missing.length, candidates: candidates.length }, null, 2));
console.log("wrote", out);
