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
  it("declares the registry workspace and Turbo task graph", async () => {
    const vercelIgnore = await readText(".vercelignore");
    const workspace = await readText("pnpm-workspace.yaml");
    const turbo = await readJson("turbo.json");
    const packageJson = await readJson("package.json");

    expect(vercelIgnore).toContain("node_modules");
    expect(vercelIgnore).toContain(".next");
    expect(workspace).toContain('"."');
    expect(workspace).not.toContain('"packages/*"');
    expect(packageJson.devDependencies).toHaveProperty("turbo");
    expect(turbo.tasks.build.dependsOn).toContain("^build");
    expect(turbo.tasks.dev.persistent).toBe(true);
    expect(turbo.tasks["registry:build"].outputs).toContain("public/*.json");
    expect(turbo.tasks).not.toHaveProperty("package:build");
  });

  it("builds a public shadcn registry from the root registry manifest", async () => {
    const packageJson = await readJson("package.json");
    const registry = await readJson("registry.json");

    expect(packageJson.scripts["registry:build"]).toContain("shadcn build");
    expect(packageJson.scripts["registry:check"]).toContain("shadcn build");
    expect(packageJson.scripts).not.toHaveProperty("package:build");
    expect(packageJson.scripts.check).not.toContain("package:build");
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
        expect.objectContaining({
          name: "stepper-demo",
          type: "registry:block",
          files: expect.arrayContaining([
            expect.objectContaining({
              path: "registry/default/examples/stepper-demo.tsx",
              target: "components/stepper-demo.tsx",
            }),
          ]),
        }),
      ])
    );
  });

  it("preserves Stepper primitive markers in the flattened registry output", async () => {
    const registrySource = await readText("registry/default/ui/stepper.tsx");
    const publicItem = await readJson("public/stepper.json");
    const publicSource = publicItem.files.find(
      (file) => file.target === "components/ui/stepper.tsx"
    )?.content;

    expect(registrySource).toContain("__stepperPrimitive");
    expect(registrySource).toContain("function markStepperPrimitive");
    expect(registrySource).toContain(
      "markStepperPrimitive(StepperItem, STEPPER_PRIMITIVES.item)"
    );
    expect(registrySource).toContain(
      "markStepperPrimitive(StepperDescription, STEPPER_PRIMITIVES.description)"
    );
    expect(registrySource).toContain("getStepperPrimitiveName(primitive.type)");
    expect(registrySource).toContain("getStepperPrimitiveName(primitive.render)");
    expect(publicSource).toContain("__stepperPrimitive");
    expect(publicSource).toContain(
      "markStepperPrimitive(StepperSeparator, STEPPER_PRIMITIVES.separator)"
    );
  });

  it("automates registry version releases without npm publishing", async () => {
    const packageJson = await readJson("package.json");
    const releaseWorkflow = await readText(".github/workflows/release-please.yml");
    const verifyWorkflow = await readText(".github/workflows/verify.yml");
    const releaseConfig = await readJson("release-please-config.json");
    const releaseManifest = await readJson(".release-please-manifest.json");

    expect(releaseWorkflow).toContain("googleapis/release-please-action@v5");
    expect(releaseWorkflow).toContain("config-file: release-please-config.json");
    expect(releaseWorkflow).toContain(
      "manifest-file: .release-please-manifest.json"
    );
    expect(releaseWorkflow).not.toContain("NPM_TOKEN");
    expect(releaseWorkflow).not.toContain("npm publish");
    expect(verifyWorkflow).toContain("actions/checkout@v6");
    expect(verifyWorkflow).toContain("pnpm/action-setup@v6");
    expect(verifyWorkflow).toContain("actions/setup-node@v6");
    expect(verifyWorkflow).toContain("pnpm check");

    expect(releaseConfig).toMatchObject({
      "release-type": "node",
      "include-component-in-tag": false,
      "include-v-in-tag": true,
      packages: {
        ".": {
          "changelog-path": "CHANGELOG.md",
          "pull-request-title-pattern": "chore(release): v${version}",
        },
      },
    });
    expect(releaseConfig["changelog-sections"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "feat", section: "Features" }),
        expect.objectContaining({ type: "fix", section: "Bug Fixes" }),
        expect.objectContaining({ type: "docs", section: "Documentation" }),
      ])
    );
    expect(releaseManifest["."]).toBe(packageJson.version);
  });

  it("enforces Conventional Commits locally with commitlint and Husky", async () => {
    const packageJson = await readJson("package.json");
    const commitlintConfig = await readText("commitlint.config.mjs");
    const commitMessageHook = await readText(".husky/commit-msg");

    expect(packageJson.scripts.commitlint).toBe("commitlint");
    expect(packageJson.scripts.prepare).toBe("husky");
    expect(packageJson.devDependencies).toHaveProperty("@commitlint/cli");
    expect(packageJson.devDependencies).toHaveProperty(
      "@commitlint/config-conventional"
    );
    expect(packageJson.devDependencies).toHaveProperty("husky");
    expect(commitlintConfig).toContain("@commitlint/config-conventional");
    expect(commitMessageHook.trim()).toBe('pnpm commitlint --edit "$1"');
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
