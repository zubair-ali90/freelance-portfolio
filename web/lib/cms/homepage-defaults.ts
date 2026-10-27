import {
  expertiseItems,
  featuredChaptersCopy,
  HERO_FALLBACK_MEDIA,
  processSteps,
} from "@/lib/homepage-content";
import { UPWORK_PROFILE_URL } from "@/lib/site-links";

export type FeaturedProjectPlacement = {
  slug: string;
  enabled: boolean;
  clientLabel: string;
  headline: string;
  body: string;
  cta: string;
  /** Optional media override (path under /assets/…). */
  mediaSrc: string;
};

export type HomepageStore = {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    scrollLabel: string;
    mediaSrc: string;
  };
  featuredProjects: FeaturedProjectPlacement[];
  expertise: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      index: string;
      title: string;
      body: string;
      href: string;
      mediaSlug: string;
      enabled: boolean;
    }>;
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{ index: string; title: string; body: string; enabled: boolean }>;
  };
  trust: {
    eyebrow: string;
    title: string;
    description: string;
    support: string;
    enabled: boolean;
    reviewIds: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    ctaLabel: string;
    ctaHref: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    closing: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export type GlobalSiteSettings = {
  upworkUrl: string;
  footerLabel: string;
  footerHeadline: string;
  footerDescription: string;
  footerTagline: string;
  siteTitle: string;
};

export type AboutPageStore = {
  eyebrow: string;
  headline: string;
  intro: string;
  startTitle: string;
  startBody: string;
  finishTitle: string;
  finishBody: string;
  hireTitle: string;
  hireBody: string;
  editorialFlag: string;
};

export type ServicesPageStore = {
  eyebrow: string;
  headline: string;
  intro: string;
  offers: Array<{ title: string; detail: string; enabled: boolean }>;
};

export type ContactPageStore = {
  eyebrow: string;
  headline: string;
  intro: string;
  formVisible: boolean;
  formNote: string;
  successMessage: string;
  errorMessage: string;
  upworkLabel: string;
};

export type PagesStore = {
  about: AboutPageStore;
  services: ServicesPageStore;
  contact: ContactPageStore;
};

export function buildDefaultPages(): PagesStore {
  return {
    about: {
      eyebrow: "about",
      headline: "a one-person studio for pictures that have to move.",
      intro:
        "Zubair makes 3D and motion for product brands, apps, and small studios. The work on this site is dummy layout content so the design can be reviewed before real projects go in.",
      startTitle: "How jobs start",
      startBody:
        "A short brief, two references, and the place the file will live. That is enough to price a first round.",
      finishTitle: "How jobs finish",
      finishBody:
        "Preview stills, one revision pass on the approved frames, then final exports for web and a master file.",
      hireTitle: "Where to hire",
      hireBody: "Upwork is the front door. Start a conversation with a clear brief and references.",
      editorialFlag: "Needs editorial review: biography still contains placeholder wording.",
    },
    services: {
      eyebrow: "services",
      headline: "what you can hire.",
      intro: "Written the way an Upwork client scans a profile: outcome first, then the files they receive.",
      offers: [
        {
          title: "Product stills and turntables",
          detail:
            "One hero angle, three supporting angles, and a 4–6 second loop. Useful for Shopify, Amazon, and pitch decks.",
          enabled: true,
        },
        {
          title: "Character and mascot",
          detail:
            "A model, a simple rig, and three poses or a short loop. Built so later shots stay on-model.",
          enabled: true,
        },
        {
          title: "Spaces",
          detail:
            "Interior or exterior stills with lighting that matches the brand, not a default studio HDRI.",
          enabled: true,
        },
        {
          title: "Explainers and app motion",
          detail:
            "A short film or UI animation with a storyboard first, so the edit does not wander.",
          enabled: true,
        },
      ],
    },
    contact: {
      eyebrow: "contact",
      headline: "tell me the frame you need.",
      intro: "Use this while the site is local. It does not email anyone yet.",
      formVisible: true,
      formNote: "Messages are stored locally for testing and are not emailed.",
      successMessage: "Message saved locally. This form does not send email yet.",
      errorMessage: "Could not save your message. Please try again.",
      upworkLabel: "Prefer Upwork? Open my profile",
    },
  };
}

export function buildDefaultHomepage(): HomepageStore {
  return {
    hero: {
      eyebrow: "Zubair Ali / 3D Artist & Interactive Developer",
      headline: "3D that goes beyond the render.",
      description:
        "I create product visuals, character animation, immersive spaces, and interactive 3D experiences—helping brands and teams turn ideas into something people can see, understand, and explore.",
      primaryCtaLabel: "Explore My Work",
      primaryCtaHref: "#selected-work",
      secondaryCtaLabel: "Hire Me on Upwork",
      secondaryCtaHref: UPWORK_PROFILE_URL,
      scrollLabel: "Scroll to Explore",
      mediaSrc: HERO_FALLBACK_MEDIA,
    },
    featuredProjects: featuredChaptersCopy.map((chapter) => ({
      ...chapter,
      enabled: true,
      mediaSrc: "",
    })),
    expertise: {
      eyebrow: "What I Create / 02",
      title: "The right visual for the right idea.",
      description:
        "From the first frame to the final interactive experience, I combine creativity and technology to bring complex ideas to life.",
      items: expertiseItems.map((item) => ({ ...item, enabled: true })),
    },
    process: {
      eyebrow: "My Process / 03",
      title: "From first idea to final frame.",
      description:
        "Great results start with understanding the idea. I keep the process collaborative, focused, and clear from the first conversation to final delivery.",
      steps: processSteps.map((step) => ({ ...step, enabled: true })),
    },
    trust: {
      eyebrow: "Client Trust / 04",
      title: "The work matters. So does the experience.",
      description:
        "From first concept to final delivery, I focus on clear communication, thoughtful execution, and results clients feel confident sharing.",
      support: "Feedback from real client projects.",
      enabled: true,
      reviewIds: ["r22", "r24", "r03", "r08", "r01", "r20", "r12", "r18"],
    },
    about: {
      eyebrow: "Behind the Work / 06",
      title: "One creative partner. From concept to delivery.",
      paragraph1:
        "I'm Zubair Ali, a 3D artist and interactive developer working across product visualization, animation, digital environments, and real-time experiences.",
      paragraph2:
        "I enjoy combining visual craftsmanship with technical problem-solving to create work that is not only beautiful but genuinely useful.",
      ctaLabel: "More About Me",
      ctaHref: "/about",
    },
    finalCta: {
      eyebrow: "Your Idea, Brought to Life / 05",
      title: "Have an idea? Let's make it real.",
      description:
        "Whether you need a standout product render, an engaging animation, or an interactive 3D experience, I'd love to hear what you're building.",
      closing: "Let's turn your next idea into something people remember.",
      primaryLabel: "Hire Me on Upwork",
      primaryHref: UPWORK_PROFILE_URL,
      secondaryLabel: "Explore All Work",
      secondaryHref: "/work",
    },
  };
}

export function buildDefaultGlobal(): GlobalSiteSettings {
  return {
    upworkUrl: UPWORK_PROFILE_URL,
    footerLabel: "Zubair Ali / Independent Creative",
    footerHeadline: "Ideas deserve dimension.",
    footerDescription:
      "I create 3D visuals, animation, and interactive experiences that turn ambitious ideas into something people can see, feel, and explore.",
    footerTagline: "Made with imagination. Built with precision.",
    siteTitle: "Zubair Ali | 3D Artist & Interactive Developer",
  };
}
