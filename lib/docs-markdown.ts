import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  apiComponents,
  controlledSnippet,
  gettingStartedSnippet,
  packageStylesImportSnippet,
  packageUsageSnippet,
  registryInstallSnippet,
  useStepperRows,
  worksWith,
} from "@/lib/docs";
import { releases } from "@/lib/releases";
import { absoluteUrl, siteConfig } from "@/lib/site";

type MarkdownDoc = {
  slug: string;
  href: string;
  title: string;
  description: string;
  file: string;
  body?: () => string;
};

const markdownDocs: MarkdownDoc[] = [
  {
    slug: "index",
    href: "/",
    title: "Stepper",
    description:
      "Overview, install paths, preview, and positioning for the Stepper primitive.",
    file: "index.mdx",
    body: getOverviewMarkdown,
  },
  {
    slug: "getting-started",
    href: "/getting-started",
    title: "Getting Started",
    description:
      "Install Stepper through the shadcn registry or as an npm package.",
    file: "getting-started.mdx",
    body: getGettingStartedMarkdown,
  },
  {
    slug: "api",
    href: "/api",
    title: "Stepper API",
    description: "Component API, props, hook shape, and composition notes.",
    file: "api.mdx",
    body: getApiMarkdown,
  },
  {
    slug: "examples",
    href: "/examples",
    title: "Examples",
    description: "Product examples for checkout, onboarding, and status flows.",
    file: "examples.mdx",
  },
  {
    slug: "forms",
    href: "/forms",
    title: "Form Wizard",
    description: "Compose Stepper with form validation and staged submission.",
    file: "forms.mdx",
  },
  {
    slug: "patterns",
    href: "/patterns",
    title: "Recipes",
    description: "Route-based, mobile, segmented, and compact patterns.",
    file: "patterns.mdx",
  },
  {
    slug: "styling",
    href: "/styling",
    title: "Styling",
    description: "State selectors, semantic tokens, and styling strategy.",
    file: "styling.mdx",
  },
  {
    slug: "changelog",
    href: "/changelog",
    title: "Changelog",
    description: "Editorial release notes and public release feed.",
    file: "changelog.mdx",
    body: getChangelogMarkdown,
  },
];

function getMarkdownDoc(slug: string[]) {
  const normalizedSlug = normalizeSlug(slug);

  return markdownDocs.find((doc) => doc.slug === normalizedSlug);
}

async function getMarkdownDocContent(doc: MarkdownDoc) {
  const body = doc.body ? doc.body() : await getCleanSourceMarkdown(doc);

  return [
    `# ${doc.title}`,
    "",
    `> ${doc.description}`,
    "",
    `Canonical: ${absoluteUrl(doc.href)}`,
    "",
    body,
  ]
    .join("\n")
    .trimEnd()
    .concat("\n");
}

async function getFullMarkdownDocs() {
  const docs = await Promise.all(
    markdownDocs.map(async (doc) => getMarkdownDocContent(doc))
  );

  return docs.join("\n---\n\n");
}

function getLlmsTxt() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    siteConfig.description,
    "",
    "## Docs",
    ...markdownDocs.map(
      (doc) => `- [${doc.title}](${absoluteUrl(`/markdown/${doc.slug}.md`)}): ${doc.description}`
    ),
    "",
    "## Registry",
    `- [Registry index](${absoluteUrl("/registry.json")}): Root shadcn registry index.`,
    `- [Stepper item](${absoluteUrl(siteConfig.registryItem)}): Installable shadcn registry item.`,
    `- [Stepper v0 demo](${absoluteUrl(siteConfig.registryDemoItem)}): v0-friendly demo registry item.`,
    "",
    "## Feeds",
    `- [RSS](${absoluteUrl("/rss.xml")}): Release notes feed.`,
  ];

  return lines.join("\n").concat("\n");
}

function getMarkdownPathForHref(href: string) {
  const doc = markdownDocs.find((item) => item.href === href);

  return doc ? `/markdown/${doc.slug}.md` : "/markdown/index.md";
}

function normalizeSlug(slug: string[]) {
  const value = slug.join("/").replace(/\.mdx?$/, "");

  return value === "" ? "index" : value;
}

function cleanMdxSource(source: string) {
  return stripImports(stripFrontmatter(source))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getCleanSourceMarkdown(doc: MarkdownDoc) {
  const source = await readFile(
    path.join(process.cwd(), "content", "docs", doc.file),
    "utf8"
  );

  return cleanMdxSource(source);
}

function getOverviewMarkdown() {
  return [
    "## Install paths",
    "",
    "Use the shadcn registry when you want Stepper copied into your app as source code:",
    "",
    codeBlock("bash", registryInstallSnippet),
    "",
    "Use the npm package when you want normal semver dependency updates:",
    "",
    codeBlock("bash", "pnpm add @francozeta/stepper"),
    "",
    "Import the package stylesheet once:",
    "",
    codeBlock("css", packageStylesImportSnippet),
    "",
    "Package usage:",
    "",
    codeBlock("tsx", packageUsageSnippet),
    "",
    "## Recommendation",
    "",
    "- Choose the registry for shadcn/ui apps, design systems, and teams that want to edit the component source directly.",
    "- Choose the package for product apps that prefer dependency updates and a compiled stylesheet.",
  ].join("\n");
}

function getGettingStartedMarkdown() {
  return [
    "## shadcn registry",
    "",
    "Recommended for shadcn/ui-style projects. The CLI copies Stepper into `components/ui/stepper.tsx`, so your app owns the source.",
    "",
    codeBlock("bash", registryInstallSnippet),
    "",
    "Updates are deliberate: rerun the command, inspect the diff, and keep your local changes.",
    "",
    "## npm package",
    "",
    "Recommended when you want `@francozeta/stepper` as a versioned dependency with package updates.",
    "",
    codeBlock("bash", "pnpm add @francozeta/stepper"),
    "",
    "Import the stylesheet once:",
    "",
    codeBlock("css", packageStylesImportSnippet),
    "",
    "## Uncontrolled usage",
    "",
    codeBlock("tsx", gettingStartedSnippet),
    "",
    "## Controlled usage",
    "",
    codeBlock("tsx", controlledSnippet),
  ].join("\n");
}

function getApiMarkdown() {
  return [
    "## Components",
    "",
    ...apiComponents.map(
      (component) =>
        `- \`${component.name}\` (${component.element}): ${component.description}`
    ),
    "",
    "## useStepper",
    "",
    ...useStepperRows.map(
      (row) => `- \`${row.name}\` - ${row.type}: ${row.description}`
    ),
    "",
    "## Integrations",
    "",
    ...worksWith.map((item) => `- ${item.label}: ${item.help}`),
  ].join("\n");
}

function getChangelogMarkdown() {
  return releases
    .map((release) =>
      [
        `## ${release.date} - v${release.version} - ${release.title}`,
        "",
        release.summary,
        "",
        ...release.sections.flatMap((section) => [
          `### ${section.title}`,
          "",
          ...section.items.map((item) => `- ${item}`),
          "",
        ]),
        ...release.links.map((link) => `- [${link.label}](${link.href})`),
      ].join("\n")
    )
    .join("\n\n");
}

function codeBlock(lang: string, code: string) {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

function stripFrontmatter(source: string) {
  return source.replace(/^---[\s\S]*?---\r?\n?/, "");
}

function stripImports(source: string) {
  const lines = source.split(/\r?\n/);
  const output: string[] = [];
  let skipping = false;

  for (const line of lines) {
    if (!skipping && /^import\s/.test(line)) {
      skipping = !line.trimEnd().endsWith(";");
      continue;
    }

    if (skipping) {
      if (line.trimEnd().endsWith(";")) {
        skipping = false;
      }

      continue;
    }

    output.push(line);
  }

  return output.join("\n");
}

export {
  getFullMarkdownDocs,
  getLlmsTxt,
  getMarkdownDoc,
  getMarkdownDocContent,
  getMarkdownPathForHref,
  markdownDocs,
};
export type { MarkdownDoc };
