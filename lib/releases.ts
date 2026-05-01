import { packageVersion } from "@/lib/docs";
import { absoluteUrl, siteConfig } from "@/lib/site";

type ReleaseLink = {
  label: string;
  href: string;
};

type ReleaseSection = {
  title: "Added" | "Changed" | "Fixed" | "Docs" | "Registry" | "Package";
  items: string[];
};

type StepperRelease = {
  version: string;
  date: string;
  title: string;
  summary: string;
  sections: ReleaseSection[];
  links: ReleaseLink[];
};

const releases: StepperRelease[] = [
  {
    version: "0.3.2",
    date: "2026-05-01",
    title: "Flat registry URLs",
    summary:
      "Stepper now serves the shadcn registry from root-level JSON files, which matches the public registry index requirements and keeps the old /r links working.",
    sections: [
      {
        title: "Fixed",
        items: [
          "Published the registry index at /registry.json and the component item at /stepper.json.",
          "Kept /r/registry.json and /r/stepper.json as compatibility rewrites for older links.",
        ],
      },
      {
        title: "Registry",
        items: [
          "Updated the public homepage metadata to the francozeta-stepper.vercel.app domain.",
          "Verified the production registry with the shadcn CLI dry run before documenting the URL.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: `${siteConfig.repository}/releases/tag/v0.3.2`,
      },
      {
        label: "Compare",
        href: `${siteConfig.repository}/compare/v0.3.1...v0.3.2`,
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-05-01",
    title: "MDX docs and shadcn registry infrastructure",
    summary:
      "This release moved the project into a real documentation and distribution shape: MDX pages, generated registry artifacts, and release automation now live together.",
    sections: [
      {
        title: "Added",
        items: [
          "Added the MDX documentation site with pages for install, API, examples, forms, patterns, styling, and changelog.",
          "Added shadcn registry build output so Stepper can be installed as source code with the shadcn CLI.",
        ],
      },
      {
        title: "Changed",
        items: [
          "Connected release automation to the package metadata and docs version badge.",
          "Documented the registry flow next to the npm package flow instead of treating them as separate experiments.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: `${siteConfig.repository}/releases/tag/v0.3.0`,
      },
      {
        label: "Compare",
        href: `${siteConfig.repository}/compare/v0.2.1...v0.3.0`,
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-05-01",
    title: "Docs examples and recipe patterns",
    summary:
      "The docs gained stronger install guidance, product-style examples, and recipes for route-based, mobile, segmented, and compact stepper compositions.",
    sections: [
      {
        title: "Docs",
        items: [
          "Expanded examples around checkout, onboarding, controlled state, status states, and form wizard flows.",
          "Added recipe patterns that keep Stepper focused while the application owns validation, routing, and persistence.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: `${siteConfig.repository}/releases/tag/v0.2.0`,
      },
      {
        label: "Compare",
        href: `${siteConfig.repository}/compare/v0.1.6...v0.2.0`,
      },
    ],
  },
  {
    version: "0.1.5",
    date: "2026-05-01",
    title: "Package CSS export",
    summary:
      "Direct npm usage became cleaner by shipping compiled CSS from the package and exposing it through the package exports map.",
    sections: [
      {
        title: "Package",
        items: [
          "Added a package CSS build output at packages/stepper/dist/styles.css.",
          "Documented @import \"@francozeta/stepper/styles.css\" as the direct package styling path.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub tag",
        href: `${siteConfig.repository}/tree/v0.1.5`,
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-05-01",
    title: "Initial Stepper primitive",
    summary:
      "The first public release established the composable Stepper primitive, source-generation flow, demos, and docs strategy.",
    sections: [
      {
        title: "Added",
        items: [
          "Added controlled and uncontrolled state, horizontal and vertical layouts, content panels, navigation helpers, and asChild composition.",
          "Added public useStepper helpers plus data attributes for active, completed, disabled, error, and positional styling.",
          "Added modular source files with a generated single-file registry artifact for shadcn-style distribution.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub tag",
        href: `${siteConfig.repository}/tree/v0.1.0`,
      },
    ],
  },
];

function getCurrentRelease() {
  return releases.find((release) => release.version === packageVersion);
}

function getReleaseUrl(release: StepperRelease) {
  return absoluteUrl(`/changelog#${getReleaseAnchor(release)}`);
}

function getReleaseAnchor(release: StepperRelease) {
  return `release-${release.version.replace(/\./g, "-")}`;
}

export {
  getCurrentRelease,
  getReleaseAnchor,
  getReleaseUrl,
  releases,
};
export type { ReleaseLink, ReleaseSection, StepperRelease };
