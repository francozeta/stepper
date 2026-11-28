import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");

const docs = [
  "content/docs/index.mdx",
  "content/docs/installation.mdx",
  "content/docs/stepper.mdx",
  "content/docs/api.mdx",
  "content/docs/adapters.mdx",
  "content/docs/adapters/react-hook-form.mdx",
  "content/docs/blocks.mdx",
  "content/docs/forms.mdx",
  "content/docs/patterns.mdx",
  "content/docs/styling.mdx",
  "content/docs/changelog.mdx",
];

async function readText(filePath) {
  return readFile(path.join(root, filePath), "utf8");
}

describe("MDX docs content", () => {
  it.each(docs)("%s has required frontmatter", async (contentPath) => {
    const content = await readText(contentPath);

    expect(content).toContain("---");
    expect(content).toContain("title:");
  });

  it("renders all docs through the Fumadocs catch-all route", async () => {
    const route = await readText("app/(docs)/docs/[[...slug]]/page.tsx");

    expect(route).toContain("source.generateParams()");
    expect(route).toContain("MdxDocPage");
    expect(route).toContain("createDocMetadata");
  });

  it("exposes Fumadocs search through the docs sidebar", async () => {
    const route = await readText("app/api/search/route.ts");
    const search = await readText("components/docs-search.tsx");
    const sidebar = await readText("components/docs-sidebar-client.tsx");

    expect(route).toContain("createFromSource(source)");
    expect(search).toContain("useDocsSearch");
    expect(search).toContain("Ctrl K");
    expect(sidebar).toContain("DocsSearchDialog");
    expect(sidebar).toContain("DocsSearchTrigger");
  });

  it("documents a complete first flow and the silent controlled fallback", async () => {
    const install = await readText("content/docs/installation.mdx");
    const docsData = await readText("lib/docs.ts");
    expect(install).toContain("Node.js 22");
    expect(install).toContain("Tailwind CSS v4");
    expect(install).toContain("components.json");
    expect(install).toContain("without calling onValueChange");
    expect(docsData).toContain('export function SetupStepper()');
    expect(docsData).toContain("without emitting onValueChange");
    expect(docsData).not.toContain("including controlled fallbacks");
  });

  it("only advertises registry items that exist", async () => {
    const blocks = await readText("content/docs/blocks.mdx");
    const markdown = await readText("lib/docs-markdown.ts");
    const registry = JSON.parse(await readText("public/registry.json"));
    for (const source of [blocks, markdown]) {
      for (const [, name] of source.matchAll(/add @stepper\/([a-z-]+)/g)) {
        expect(registry.items.some((item) => item.name === name)).toBe(true);
      }
    }
    expect(blocks).toContain("not a published registry item");
    expect(markdown).toContain("without emitting onValueChange");
    expect(markdown).toContain("Base Nova is not required");
  });

  it("documents Stepper ownership, controlled fallback, and composition boundaries", async () => {
    const index = await readText("content/docs/index.mdx");
    const stepper = await readText("content/docs/stepper.mdx");
    const api = await readText("content/docs/api.mdx");
    const adapters = await readText("content/docs/adapters.mdx");
    const reactHookFormAdapter = await readText(
      "content/docs/adapters/react-hook-form.mdx"
    );
    const forms = await readText("content/docs/forms.mdx");
    const patterns = await readText("content/docs/patterns.mdx");
    const docsData = await readText("lib/docs.ts");

    expect(index).toContain('title="Flow architecture"');
    expect(index).toContain('title="Composition patterns"');
    expect(stepper).toContain('title="Composition"');
    expect(stepper).toContain('title="API Reference"');
    expect(api).toContain("Controlled fallback");
    expect(api).toContain("asChild requirements");
    expect(adapters).toContain('title="Pick your adapter"');
    expect(reactHookFormAdapter).toContain('title="Preview"');
    expect(reactHookFormAdapter).toContain("StepperReactHookFormAdapterPreview");
    expect(reactHookFormAdapter).toContain('title="Validation boundary"');
    expect(reactHookFormAdapter).toContain("keepMounted");
    expect(forms).toContain("Stepper represents UI state");
    expect(forms).not.toContain("Owns active step");
    expect(patterns).toContain("Copy this when");
    expect(docsData).toContain("asChildRequirements");
    expect(docsData).toContain("controlledBehaviorNotes");
  });
});
