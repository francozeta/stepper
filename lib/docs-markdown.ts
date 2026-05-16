import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  accessibilityNotes,
  apiComponents,
  checkoutExampleCode,
  controlledSnippet,
  flowArchitecture,
  gettingStartedSnippet,
  reactHookFormAdapterPreviewCode,
  registryInstallSnippet,
  stepperCompositionTree,
  stepperUsageSnippet,
  usageSnippet,
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
    href: "/docs",
    title: "Introduction",
    description:
      "Mental model, composition boundaries, preview, and positioning for the Stepper primitive.",
    file: "index.mdx",
    body: getOverviewMarkdown,
  },
  {
    slug: "installation",
    href: "/docs/installation",
    title: "Installation",
    description:
      "Install Stepper through the shadcn registry and copy the source into your app.",
    file: "installation.mdx",
    body: getGettingStartedMarkdown,
  },
  {
    slug: "stepper",
    href: "/docs/stepper",
    title: "Stepper",
    description:
      "Component reference for the Stepper primitive, including install, usage, composition, examples, and API.",
    file: "stepper.mdx",
    body: getStepperMarkdown,
  },
  {
    slug: "api",
    href: "/docs/api",
    title: "Stepper API",
    description: "Component API, props, hook shape, and composition notes.",
    file: "api.mdx",
    body: getApiMarkdown,
  },
  {
    slug: "adapters",
    href: "/docs/adapters",
    title: "Adapters",
    description:
      "Pick the integration layer that should own form state, validation, animation, or external workflow state around Stepper.",
    file: "adapters.mdx",
    body: getAdaptersMarkdown,
  },
  {
    slug: "adapters/react-hook-form",
    href: "/docs/adapters/react-hook-form",
    title: "React Hook Form",
    description:
      "Use React Hook Form as the state layer for persistent multi-step inputs while Stepper owns progress and navigation.",
    file: "adapters/react-hook-form.mdx",
    body: getReactHookFormAdapterMarkdown,
  },
  {
    slug: "examples",
    href: "/docs/examples",
    title: "Examples",
    description:
      "Product examples for intent onboarding, checkout, onboarding, and status flows.",
    file: "examples.mdx",
  },
  {
    slug: "forms",
    href: "/docs/forms",
    title: "Form Wizard",
    description: "Compose Stepper with form validation and staged submission.",
    file: "forms.mdx",
  },
  {
    slug: "patterns",
    href: "/docs/patterns",
    title: "Recipes",
    description: "Route-based, mobile, controls-only, and compact patterns.",
    file: "patterns.mdx",
  },
  {
    slug: "styling",
    href: "/docs/styling",
    title: "Styling",
    description: "State selectors, semantic tokens, and styling strategy.",
    file: "styling.mdx",
  },
  {
    slug: "changelog",
    href: "/docs/changelog",
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
    `- [Stepper item](${absoluteUrl(siteConfig.registryItem)}): Single-file installable shadcn registry item for the Stepper primitive.`,
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
    "## Flow architecture",
    "",
    "Stepper is the progress layer. Your app keeps the business rules, validation, routing, persistence, and async work.",
    "",
    ...flowArchitecture.map(
      (item) => `- **${item.label}** (${item.value}): ${item.help}`
    ),
    "",
    "## Composition patterns",
    "",
    codeBlock("text", stepperCompositionTree),
    "",
    "## Integration boundary",
    "",
    ...worksWith.map((item) => `- **${item.label}**: ${item.help}`),
  ].join("\n");
}

function getStepperMarkdown() {
  return [
    "## Installation",
    "",
    codeBlock("bash", registryInstallSnippet),
    "",
    "## Usage",
    "",
    codeBlock("tsx", stepperUsageSnippet),
    "",
    "## Examples",
    "",
    "### Checkout flow",
    "",
    codeBlock("tsx", checkoutExampleCode),
    "",
    "## Composition",
    "",
    codeBlock("text", stepperCompositionTree),
    "",
    "## Order model",
    "",
    "Composed mode registers `StepperItem` primitives in mount order for simple JSX flows. Pass `steps` when a flow is dynamic, conditional, routed, or rendered from data so the order stays explicit.",
    "",
    "## API Reference",
    "",
    ...apiComponents.map(
      (component) =>
        `- \`${component.name}\` (${component.element}): ${component.description}`
    ),
  ].join("\n");
}

function getAdaptersMarkdown() {
  return [
    "## Pick your adapter",
    "",
    "Stepper stays focused on progress, state, and accessibility. Adapters connect that primitive to the workflow layer your app already uses.",
    "",
    "- React Hook Form: ready first, for persistent field state across steps.",
    "- Zod: coming soon, for schema gates before order submission.",
    "- Zustand: coming soon, for external flow state.",
    "- Framer Motion: coming soon, for transitions and presence.",
    "- TanStack: coming soon, for server-backed form, query, and mutation flows.",
    "",
    "## Adapter boundary",
    "",
    "- Stepper: active step, item state, navigation helpers, ARIA, and composition.",
    "- Adapter: maps form state, validation, animation, or store state onto the Stepper API.",
    "- App: persistence, routing, order submission, and product decisions.",
    "",
    "## First adapter",
    "",
    "React Hook Form is the first real adapter because multi-step flows usually need persistent field values before they need extra visual effects.",
  ].join("\n");
}

function getReactHookFormAdapterMarkdown() {
  return [
    "## Adapter role",
    "",
    "React Hook Form owns field values and form lifecycle. Stepper receives the active step and exposes next/previous controls.",
    "",
    "- Form: keeps values mounted across steps and prepares the order details.",
    "- Stepper: reflects where the user is and moves only when the adapter allows it.",
    "- Checkout: submits one validated order instead of scattered step-local state.",
    "",
    "## Preview",
    "",
    "The live docs render a checkout adapter with real form state, step validation, and an order summary that survives step changes.",
    "",
    codeBlock("tsx", reactHookFormAdapterPreviewCode),
    "",
    "## State model",
    "",
    "Keep Stepper controlled by local flow state, and keep the form provider above the step content so values are not lost when panels unmount.",
    "",
    codeBlock("tsx", reactHookFormAdapterPreviewCode),
    "",
    "## Validation boundary",
    "",
    "Use `onBeforeNext` for step-level validation. The guard can be async, so it works with React Hook Form `trigger`, remote checks, and save-before-continue flows.",
    "",
    codeBlock(
      "ts",
      `async function canContinue() {
  const fields = fieldsByStep[step];
  const isValid = await form.trigger(fields);

  return isValid;
}`
    ),
    "",
    "## Production note",
    "",
    "Use `keepMounted` for fields that must preserve local state, or keep field state in React Hook Form with stable `defaultValues`. Place the order from the form, not from each `StepperContent` panel.",
  ].join("\n");
}

function getGettingStartedMarkdown() {
  return [
    "## Install",
    "",
    "Stepper is installed through the shadcn registry. The CLI copies the component source into your project, so you can customize it directly.",
    "",
    codeBlock("bash", registryInstallSnippet),
    "",
    "## What gets added",
    "",
    "The registry installs the Stepper source into your app:",
    "",
    "- `components/ui/stepper.tsx`",
    "",
    "Import it from your local app code:",
    "",
    codeBlock("tsx", usageSnippet),
    "",
    "Stepper does not install as a runtime package. After installation, the source belongs to your project.",
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
    "## Accessibility model",
    "",
    ...accessibilityNotes.map(
      (item) => `- ${item.label}: ${item.value}. ${item.help}`
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
        `## ${release.date} - ${release.title}`,
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
