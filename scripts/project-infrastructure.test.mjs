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

describe("project infrastructure", () => {
  it("declares the package workspace and Turbo task graph", async () => {
    const vercelIgnore = await readText(".vercelignore");
    const workspace = await readText("pnpm-workspace.yaml");
    const turbo = await readJson("turbo.json");
    const packageJson = await readJson("package.json");

    expect(vercelIgnore).toContain("node_modules");
    expect(vercelIgnore).toContain(".next");
    expect(workspace).toContain('"."');
    expect(workspace).toContain('"packages/*"');
    expect(packageJson.devDependencies).toHaveProperty("turbo");
    expect(turbo.tasks.build.dependsOn).toContain("^build");
    expect(turbo.tasks.dev.persistent).toBe(true);
    expect(turbo.tasks["registry:build"].outputs).toContain("public/*.json");
  });

  it("builds a public shadcn registry from the root registry manifest", async () => {
    const packageJson = await readJson("package.json");
    const registry = await readJson("registry.json");

    expect(packageJson.scripts["registry:build"]).toContain("shadcn build");
    expect(packageJson.scripts["registry:check"]).toContain("shadcn build");
    expect(registry).toMatchObject({
      name: "stepper",
      homepage: "https://francozeta-stepper.vercel.app",
    });
    expect(registry.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "stepper",
          type: "registry:ui",
          files: expect.arrayContaining([
            expect.objectContaining({
              path: "registry/default/ui/stepper.tsx",
              target: "components/ui/stepper.tsx",
            }),
          ]),
        }),
      ])
    );
  });

  it("declares MDX docs as a generated content source", async () => {
    const packageJson = await readJson("package.json");
    const tsconfig = await readJson("tsconfig.json");
    const eslintConfig = await readText("eslint.config.mjs");
    const sourceConfig = await readText("source.config.ts");
    const nextConfig = await readText("next.config.mjs");

    expect(packageJson.scripts["docs:source"]).toBe("fumadocs-mdx");
    expect(packageJson.dependencies).toHaveProperty("fumadocs-core");
    expect(packageJson.dependencies).toHaveProperty("fumadocs-mdx");
    expect(tsconfig.compilerOptions.paths["collections/*"]).toEqual([
      "./.source/*",
    ]);
    expect(sourceConfig).toContain('dir: "content/docs"');
    expect(nextConfig).toContain('from "fumadocs-mdx/next"');
    expect(nextConfig).toContain('destination: "/stepper.json"');
    expect(nextConfig).toContain('source: "/r/:path*"');
    expect(eslintConfig).toContain('".source/**"');
  });
});
