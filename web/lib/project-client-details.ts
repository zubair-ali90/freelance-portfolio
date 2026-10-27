import type { Project } from "./content";

export type ProjectResourceLink = {
  label: string;
  href: string;
};

export type ProjectClientInfo = {
  clientName: string;
  clientUrl?: string;
  /** Long-form scope and deliverables (from client briefs). */
  scope: string;
  /** Short client-facing endorsement for cards and quotes. */
  review?: string;
  resources?: ProjectResourceLink[];
};

/** Client and project notes sourced from Docs/Project with reviews.docx */
export const projectClientBySlug: Record<string, ProjectClientInfo> = {
  "installation-event-visualization": {
    clientName: "The Creative Group",
    clientUrl: "https://creativegroupinc.com/",
    scope:
      "Ongoing collaboration with an experience-design agency focused on meetings, incentive programs, and brand activations. Delivered multiple 3D event visualization options per brief—including alternative design directions for a single event—so the team could present concepts to their clients. Work expanded into booth environments and spatial concepts for live activations.",
    review:
      "Zubair helped us show clients several event directions before anything was built. The renders became a regular part of how we sell experiences.",
    resources: [
      {
        label: "Event booth concepts (Drive)",
        href: "https://drive.google.com/drive/folders/1oBzcHg92ICEtfkg_ffVbGtNp-adNAbCs?usp=drive_link",
      },
    ],
  },
  "unity-unity-character": {
    clientName: "VRM / real-time avatar client",
    scope:
      "End-to-end stylized fox character for real-time use: modeling within a 50k polygon budget, clean topology for deformation, full rigging (skeleton, weight painting, tail and ear setup), and export to VRM with humanoid mapping, fox-specific bones, and spring bones where needed—ready for VRM-supported apps and avatar platforms.",
    review:
      "The character shipped rigged, optimized, and VRM-ready. We could drop it straight into our real-time stack.",
  },
  "standalone-weapon": {
    clientName: "Zaffiri Precision",
    clientUrl: "https://zaffiriprecision.com/",
    scope:
      "Precision firearm components and machined parts: accurate 3D models, material-accurate surfacing, and high-volume product visualization. Built custom render pipelines that automated large batches—5,000+ product stills over the engagement—plus product animations for detail, finish, and function.",
    review:
      "The pipeline kept quality consistent across thousands of SKUs. Animation and stills finally matched how precise the parts really are.",
  },
  "product-animation-ai-product": {
    clientName: "Zaffiri Precision",
    clientUrl: "https://zaffiriprecision.com/",
    scope:
      "Focused 3D product visualization and animation for individual firearm components—geometry, finishes, and motion that highlight machining detail for web and marketing.",
    review:
      "Component animations made complex parts easy to understand on the product page.",
  },
  "explainer-configurator": {
    clientName: "Adam AI · Engo Planet · Blue Bird",
    clientUrl: "https://adamaitest.techversoldevops.com/",
    scope:
      "Interactive configurators and architectural tooling: AI floor-plan configurator demos, solar product visualization for Engo Planet (including custom solar product pages), and PlayCanvas-based solar bench configurators. Work spans UX-ready 3D, material options, and embeddable real-time previews.",
    review:
      "Our configurators went from static PDFs to something prospects could actually walk through in the browser.",
    resources: [
      { label: "Adam AI configurator demo", href: "https://adamaitest.techversoldevops.com/" },
      {
        label: "Floor plan reference",
        href: "https://drive.google.com/open?id=11-nVo1nQsXh2xF9zVIfyUrWHKTH9rKV8&usp=drive_copy",
      },
      { label: "Engo Planet", href: "https://www.engoplanet.com/" },
      {
        label: "Engo custom solar products",
        href: "https://www.engoplanet.com/engo-custom-solar-products",
      },
      { label: "Blue Bird bench (PlayCanvas)", href: "https://playcanv.as/e/b/71442ed8" },
      {
        label: "Configurator assets (Drive)",
        href: "https://drive.google.com/drive/folders/1lYQak5bdDtkM28vec788alzPLkT5UacJ?usp=drive_link",
      },
    ],
  },
  "character-anime": {
    clientName: "MNSTR Assoc",
    clientUrl: "https://mnstrassoc.com/",
    scope:
      "360° product animation for anime-inspired jewelry collections: mesh prep, accurate proportions, and rotational turntables that show craftsmanship from every angle for e-commerce and campaign use.",
    review:
      "The 360° loops let customers study every detail of the pieces—exactly what we needed for online sales.",
    resources: [
      {
        label: "Project folder (Drive)",
        href: "https://drive.google.com/drive/folders/1NkuzgwUCr6866CZvvdpBxUoG-ec-DMNm?usp=drive_link",
      },
    ],
  },
  "lifestyle-renders-furniture": {
    clientName: "Bordertown Retail",
    clientUrl: "https://bordertownretail.com/",
    scope:
      "3D model libraries of retail racks and display systems, including FBX assets tuned for an AR visualization platform so buyers could preview fixtures in context.",
    review:
      "Having AR-ready rack models cut our sales cycle—we could show layouts without shipping samples.",
    resources: [
      {
        label: "Asset library (Drive)",
        href: "https://drive.google.com/drive/folders/1VLxPD8gOAJAkuUjMNWVr0bngN-cxUJ7N?usp=drive_link",
      },
    ],
  },
  "product-animation-product-animation": {
    clientName: "GooPlast",
    clientUrl: "https://gooplast.com/en/",
    scope:
      "3D product animation for plastic formwork and voided slab systems: assembly, installation, reinforcement, pour, and finished structure—turning complex construction workflows into clear visuals for engineers, contractors, and buyers.",
    review:
      "Install steps that used to take pages of text now land in one short animation our field teams actually share.",
  },
  "explainer-app-animation": {
    clientName: "Artscapes",
    clientUrl: "https://artscapes.co/",
    scope:
      "Artscapes AR for Android and iOS in Unity (C#) with Vuforia, ARCore/ARFoundation, and ARKit: scene setup, tracking, interaction, and mobile optimization for stable on-device AR experiences.",
    review:
      "Zubair owned the full AR pipeline—both stores, one codebase, performance we could ship.",
    resources: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.ScanscapesTech.ArtScapesAR&hl=en_US",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/artscapes/id1433059246",
      },
      {
        label: "Before / after (Drive)",
        href: "https://drive.google.com/open?id=1RoGL62BZ01abPm63Mcu7aPxC_Da-VM3Q&usp=drive_copy",
      },
    ],
  },
  "product-renders-product": {
    clientName: "Macrovey",
    clientUrl: "https://www.macrovey.com/",
    scope:
      "3D model and animation of industrial equipment for AR—showing the machine in operation for field marketing and product education.",
    review:
      "The AR demo made a heavy machine feel tangible before it arrived on site.",
  },
  "explainer-training-video": {
    clientName: "Medical VR training",
    scope:
      "VR training simulation for ski-injury response: CPR, assessment, bandaging, stretcher transfer, and helicopter handoff—scripted for medical staff in immersive practice.",
    review:
      "The scenario reads like a real call—our team rehearses steps they used to only read about.",
    resources: [
      {
        label: "Training capture (Drive)",
        href: "https://drive.google.com/open?id=1MyqRgAY_qx1XRKk0QSAzEfjXS9mym49q&usp=drive_copy",
      },
    ],
  },
  "unreal-michaela-environment": {
    clientName: "Neil · MR walkthrough",
    scope:
      "House walkthrough in mixed reality with selectable materials, furniture interaction, and household props—built for client review of finishes before build-out.",
    review:
      "Clients finally understood scale and materials—they could walk the home before drywall went up.",
  },
  "explainer-website-animation": {
    clientName: "DW Spectrum",
    clientUrl: "https://dwspectrum.com/page/dw-mobile/",
    scope:
      "Remote meeting experience: users join a shared 3D meeting room, explore materials and products, and collaborate as if in the same space—supporting mobile sales workflows.",
    review:
      "Remote buyers stopped asking for another photo sheet—they could explore the room together.",
  },
  "unity-unity-game": {
    clientName: "Dandy Shandy",
    scope:
      "Mobile game built in Unity with store-ready builds, gameplay loop, and marketing captures for launch.",
    review:
      "From prototype to Play Store listing assets without handing off to three different vendors.",
    resources: [
      {
        label: "Gameplay demo (Drive)",
        href: "https://drive.google.com/open?id=1qhWmaNGUDpF9XWni3fXp137ooMXI9PHp&usp=drive_copy",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.DandyShandy.com.unity.template.mobile2D&hl=en_US",
      },
    ],
  },
  "character-mascot": {
    clientName: "Preat",
    clientUrl: "https://www.preat.com/",
    scope:
      "Zebra mascot and dental-technology product library: animation and still renders across a full SKU range for web and sales collateral.",
    review:
      "Consistent mascot and product motion across the catalog—our site finally feels like one brand.",
  },
  "explainer-blueprint-illustrator": {
    clientName: "IntelliRoad",
    clientUrl: "https://intelliroad.com/tolling/",
    scope:
      "3D visualization supporting tolling and roadway product storytelling—technical accuracy for infrastructure buyers.",
    review:
      "Complex tolling hardware reads clearly in the visuals our RFPs depend on.",
    resources: [
      {
        label: "Project video (Drive)",
        href: "https://drive.google.com/open?id=1fqZJ0bah0OXDCuWz2KT9o5ifImdu6VjQ&usp=drive_copy",
      },
    ],
  },
  "hero-renders-cgi": {
    clientName: "Engo Planet",
    clientUrl: "https://www.engoplanet.com/",
    scope:
      "Hero CGI and product renders for solar street furniture and custom solar solutions—lighting and materials matched to live product photography standards.",
    review:
      "Renders on the site match what ships—marketing and engineering finally show the same product.",
  },
  "installation-industrial-visualization": {
    clientName: "Industrial & venue clients",
    scope:
      "Industrial and large-scale spatial visualization—equipment, venues, and environmental context for stakeholder reviews.",
    review:
      "Large-scale scenes stayed readable—exactly what we needed for executive sign-off.",
  },
};

export type ClientReviewCard = {
  quote: string;
  clientName: string;
  subtitle: string;
  projectSlug: string;
};

const homepageReviewSlugs: string[] = [
  "installation-event-visualization",
  "standalone-weapon",
  "explainer-configurator",
  "character-anime",
  "product-animation-product-animation",
  "explainer-app-animation",
  "character-mascot",
  "unreal-michaela-environment",
];

export function getProjectClientInfo(slug: string): ProjectClientInfo | undefined {
  return projectClientBySlug[slug];
}

export function getFeaturedClientReviews(projects: Project[]): ClientReviewCard[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const cards: ClientReviewCard[] = [];
  for (const slug of homepageReviewSlugs) {
    const info = projectClientBySlug[slug];
    const project = bySlug.get(slug);
    if (!info?.review) continue;
    cards.push({
      quote: info.review,
      clientName: info.clientName,
      subtitle: project?.title ?? slug,
      projectSlug: slug,
    });
  }
  return cards;
}

/** One-line client credit for cards when we have a named client. */
export function projectClientCredit(slug: string): string | undefined {
  const info = projectClientBySlug[slug];
  if (!info) return undefined;
  return info.clientName;
}

export function mergeProjectSummary(project: Project): Project {
  const info = projectClientBySlug[project.slug];
  if (!info) return project;
  const lead = info.scope.split(/(?<=[.!?])\s+/)[0]?.trim() ?? info.scope;
  if (!lead || lead.length < 24) return project;
  const summary = lead.length > 220 ? `${lead.slice(0, 217).trimEnd()}…` : lead;
  return { ...project, summary };
}
