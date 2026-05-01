import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");

async function readText(filePath) {
  return readFile(path.join(root, filePath), "utf8");
}

describe("release and AI documentation surfaces", () => {
  it("renders the changelog from editorial release data", async () => {
    const changelog = await readText("content/docs/changelog.mdx");
    const releases = await readText("lib/releases.ts");

    expect(changelog).toContain("<ChangelogList />");
    expect(changelog).not.toContain("releaseItems");
    expect(releases).toContain("Flat registry URLs");
    expect(releases).toContain("MDX docs and shadcn registry infrastructure");
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

  it("points Open in v0 at a demo item with a default export", async () => {
    const actions = await readText("components/docs-page-actions.tsx");
    const demo = await readText("registry/default/examples/stepper-demo.tsx");

    expect(actions).toContain("registryDemoItem");
    expect(actions).toContain("Open in v0");
    expect(demo).toContain("export default function StepperDemo");
  });

  it("keeps recipes focused on stepper patterns instead of segmented tab-like lines", async () => {
    const patterns = await readText("content/docs/patterns.mdx");
    const examples = await readText("components/stepper-examples.tsx");
    const toc = await readText("lib/docs-toc.ts");

    expect(patterns).not.toContain("Segmented line");
    expect(examples).not.toContain("StepperSegmentedRecipeExample");
    expect(toc).not.toContain("Segmented line");
  });
});
