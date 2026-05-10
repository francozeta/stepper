import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");

async function readText(filePath) {
  return readFile(path.join(root, filePath), "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readText(filePath));
}

describe("release and AI documentation surfaces", () => {
  it("renders the changelog from editorial release data", async () => {
    const changelog = await readText("content/docs/changelog.mdx");
    const releases = await readText("lib/releases.ts");

    expect(changelog).toContain("<ChangelogList />");
    expect(changelog).toContain("Release automation");
    expect(changelog).toContain("/pulls");
    expect(changelog).not.toContain("releaseItems");
    expect(changelog).not.toContain("npm publishes");
    expect(changelog).not.toContain("package changes");
    expect(releases).toContain("Flat registry URLs");
    expect(releases).toContain("MDX docs and shadcn registry infrastructure");
  });

  it("keeps the editorial changelog aligned with the registry version", async () => {
    const packageJson = await readJson("package.json");
    const changelogList = await readText("components/changelog-list.tsx");
    const releases = await readText("lib/releases.ts");

    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(releases).toContain("version: registryVersion");
    expect(releases).toContain("/releases/tag/v${registryVersion}");
    expect(changelogList).toContain("current");
  });

  it("keeps public docs registry-only", async () => {
    const docs = await Promise.all(
      [
        "README.md",
        "content/docs/index.mdx",
        "content/docs/getting-started.mdx",
        "content/docs/styling.mdx",
        "lib/docs-markdown.ts",
      ].map((filePath) => readText(filePath))
    );
    const combinedDocs = docs.join("\n");

    expect(combinedDocs).toContain("shadcn registry");
    expect(combinedDocs).not.toContain("@francozeta/stepper");
    expect(combinedDocs).not.toContain("pnpm add @francozeta/stepper");
    expect(combinedDocs).not.toContain("@import \"@francozeta/stepper/styles.css\"");
  });

  it("exposes RSS and Markdown route handlers", async () => {
    const rssRoute = await readText("app/rss.xml/route.ts");
    const markdownRoute = await readText("app/markdown/[...slug]/route.ts");
    const llmsRoute = await readText("app/llms.txt/route.ts");

    expect(rssRoute).toContain("application/rss+xml");
    expect(rssRoute).toContain("getReleaseUrl");
    expect(markdownRoute).toContain("text/markdown");
    expect(llmsRoute).toContain("getLlmsTxt");
  });

  it("points Open in v0 at the single-file Stepper primitive", async () => {
    const actions = await readText("components/docs-page-actions.tsx");
    const primitive = await readText("public/stepper.json");

    expect(actions).toContain("registryItem");
    expect(actions).not.toContain("registryDemoItem");
    expect(actions).toContain("title:");
    expect(actions).toContain("prompt:");
    expect(actions).toContain("Open in v0");
    expect(actions).toContain("single installable component");
    expect(primitive).toContain('"target": "components/ui/stepper.tsx"');
    expect(primitive).toContain("StepperIndicator");
    expect(primitive).toContain("StepperDescription");
    expect(primitive).not.toContain("@francozeta/stepper");
  });

  it("keeps the demo registry block local-source based", async () => {
    const demo = await readText("registry/default/examples/stepper-demo.tsx");
    const publicDemo = await readText("public/stepper-demo.json");

    expect(demo).toContain("export default function StepperDemo");
    expect(demo).toContain('from "@/components/ui/stepper"');
    expect(demo).toContain("StepperIndicator");
    expect(demo).toContain("StepperDescription");
    expect(demo).not.toContain("@francozeta/stepper");
    expect(demo).not.toContain("space-y-");
    expect(publicDemo).toContain('\\"@/components/ui/stepper\\"');
    expect(publicDemo).not.toContain("@francozeta/stepper");
  });

  it("publishes the Intent onboarding flow registry block as local source", async () => {
    const block = await readText(
      "registry/default/examples/stepper-intent-onboarding.tsx"
    );
    const publicBlock = await readText("public/stepper-intent-onboarding.json");

    expect(block).toContain("export { StepperIntentOnboardingExample }");
    expect(block).toContain('from "@/components/ui/stepper"');
    expect(block).toContain("HiddenStepList");
    expect(block).toContain("Preparing your setup");
    expect(block).not.toContain("@francozeta/stepper");
    expect(publicBlock).toContain('"name": "stepper-intent-onboarding"');
    expect(publicBlock).toContain('"react-icons"');
    expect(publicBlock).toContain('"react-hook-form"');
    expect(publicBlock).toContain('"registryDependencies"');
    expect(publicBlock).toContain('\\"@/components/ui/stepper\\"');
  });

  it("keeps recipes focused on stepper patterns instead of segmented tab-like lines", async () => {
    const patterns = await readText("content/docs/patterns.mdx");
    const examples = await readText("components/stepper-examples.tsx");
    const toc = await readText("components/docs-toc.tsx");

    expect(patterns).not.toContain("Segmented line");
    expect(examples).not.toContain("StepperSegmentedRecipeExample");
    expect(toc).not.toContain("Segmented line");
    expect(toc).toContain("fumadocs-core/toc");
  });

  it("keeps docs navigation markdown-first and visually quiet", async () => {
    const actions = await readText("components/docs-page-actions.tsx");
    const sidebar = await readText("components/docs-sidebar-client.tsx");
    const navigation = await readText("lib/docs-navigation.ts");
    const toc = await readText("components/docs-toc.tsx");

    expect(actions).toContain("fetch(markdownPath)");
    expect(actions).not.toContain("window.location.href");
    expect(navigation).toContain("source.getPageTree()");
    expect(sidebar).toContain("shouldScaleBackground={false}");
    expect(sidebar).toContain("bg-gradient-to-r");
    expect(sidebar).not.toContain("border-dashed");
    expect(toc).toContain("MutationObserver");
    expect(toc).toContain("border-l border-border");
    expect(toc).not.toContain("bg-gradient-to-b");
    expect(toc).not.toContain("border-dashed");
  });
});
