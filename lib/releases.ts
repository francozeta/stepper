import { registryVersion } from "@/lib/docs";
import { absoluteUrl, siteConfig } from "@/lib/site";

type ReleaseLink = {
  label: string;
  href: string;
};

type ReleaseSection = {
  title: "Added" | "Changed" | "Fixed" | "Docs" | "Registry" | "Infra";
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
    version: registryVersion,
    date: "2026-05-02",
    title: "Current registry release",
    summary:
      "The current Stepper registry release tracks the latest release-please bump while keeping the docs focused on copied-source ownership, composition, and production verification.",
    sections: [
      {
        title: "Added",
        items: [
          "Promoted the release-candidate hardening work into the current registry version.",
          "Kept the public docs focused on the shadcn registry component instead of package-style distribution.",
        ],
      },
      {
        title: "Docs",
        items: [
          "Derived the current changelog entry from the registry version so release-please bumps do not require a manual feed edit.",
          "Clarified the path toward final production QA: install from /stepper.json, verify copied source, then publish usage guidance.",
        ],
      },
      {
        title: "Registry",
        items: [
          "Validated that generated public registry artifacts remain up to date after the release bump.",
          "Preserved flat registry URLs for shadcn CLI installs and compatibility rewrites.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: `${siteConfig.repository}/releases/tag/v${registryVersion}`,
      },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-05-02",
    title: "Registry release candidate",
    summary:
      "The hardened Stepper registry component became the release candidate, with clearer docs around composition, fallback behavior, and copied-source ownership.",
    sections: [
      {
        title: "Added",
        items: [
          "Promoted the release-candidate hardening work into the registry version.",
          "Kept the public docs focused on the shadcn registry component instead of package-style distribution.",
        ],
      },
      {
        title: "Docs",
        items: [
          "Aligned the changelog with the release-please version bump.",
          "Clarified the path toward final production QA: install from /stepper.json, verify copied source, then publish usage guidance.",
        ],
      },
      {
        title: "Registry",
        items: [
          "Validated that generated public registry artifacts remain up to date after the release bump.",
          "Preserved flat registry URLs for shadcn CLI installs and compatibility rewrites.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: `${siteConfig.repository}/releases/tag/v0.7.0`,
      },
      {
        label: "Compare",
        href: `${siteConfig.repository}/compare/v0.6.2...v0.7.0`,
      },
    ],
  },
  {
    version: "0.6.2",
    date: "2026-05-02",
    title: "Release candidate hardening",
    summary:
      "Stepper now catches the common composition mistakes that used to fail silently, while the docs explain the registry-first workflow more directly.",
    sections: [
      {
        title: "Added",
        items: [
          "Added development warnings for duplicate StepperItem values.",
          "Added development warnings when StepperContent points at a missing StepperItem value.",
          "Added development warnings when StepperItem is rendered outside StepperList.",
        ],
      },
      {
        title: "Fixed",
        items: [
          "Prevented accidental StepperItem nodes inside StepperContent from changing the real step order.",
          "Preserved the StepperContent primitive marker in the generated single-file registry output.",
        ],
      },
      {
        title: "Docs",
        items: [
          "Documented controlled fallback behavior for missing or disabled values.",
          "Documented asChild requirements for custom triggers and navigation controls.",
          "Clarified that Stepper represents UI state while the app owns validation, routing, and persistence.",
          "Reframed recipes with copy-this-when guidance for faster pattern selection.",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: `${siteConfig.repository}/releases/tag/v0.6.2`,
      },
      {
        label: "Compare",
        href: `${siteConfig.repository}/compare/v0.6.1...v0.6.2`,
      },
    ],
  },
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
          "Connected the docs version badge to the registry component version.",
          "Documented the registry flow as the primary source-ownership install path.",
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
    title: "Styling guidance",
    summary:
      "The styling docs clarified how Stepper uses shadcn/ui semantic tokens and data attributes.",
    sections: [
      {
        title: "Docs",
        items: [
          "Documented the theme tokens that Stepper reads from the host app.",
          "Added examples for state selectors and indicator composition.",
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
  return releases.find((release) => release.version === registryVersion);
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
