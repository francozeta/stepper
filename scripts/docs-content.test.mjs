import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");

const docs = [
  ["content/docs/index.mdx", "app/page.tsx"],
  ["content/docs/getting-started.mdx", "app/getting-started/page.tsx"],
  ["content/docs/api.mdx", "app/api/page.tsx"],
  ["content/docs/examples.mdx", "app/examples/page.tsx"],
  ["content/docs/forms.mdx", "app/forms/page.tsx"],
  ["content/docs/patterns.mdx", "app/patterns/page.tsx"],
  ["content/docs/styling.mdx", "app/styling/page.tsx"],
  ["content/docs/changelog.mdx", "app/changelog/page.tsx"],
];

async function readText(filePath) {
  return readFile(path.join(root, filePath), "utf8");
}

describe("MDX docs content", () => {
  it.each(docs)("%s backs %s", async (contentPath, routePath) => {
    const content = await readText(contentPath);
    const route = await readText(routePath);

    expect(content).toContain("---");
    expect(content).toContain("title:");
    expect(route).toContain("MdxDocPage");
    expect(route).toContain("createDocMetadata");
  });

  it("documents Stepper ownership, controlled fallback, and composition boundaries", async () => {
    const api = await readText("content/docs/api.mdx");
    const forms = await readText("content/docs/forms.mdx");
    const patterns = await readText("content/docs/patterns.mdx");
    const docsData = await readText("lib/docs.ts");

    expect(api).toContain("Controlled fallback");
    expect(api).toContain("asChild requirements");
    expect(forms).toContain("Stepper represents UI state");
    expect(forms).not.toContain("Owns active step");
    expect(patterns).toContain("Copy this when");
    expect(docsData).toContain("asChildRequirements");
    expect(docsData).toContain("controlledBehaviorNotes");
  });
});
