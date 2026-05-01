import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const tempDirs = [];

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

describe("release version sync", () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))
    );
  });

  it("commits root package metadata with the package release", async () => {
    const { default: releaseConfig } = await import(
      pathToFileURL(path.join(root, "release.config.mjs")).href
    );

    const gitPlugin = releaseConfig.plugins.find(
      (plugin) => Array.isArray(plugin) && plugin[0] === "@semantic-release/git"
    );

    expect(releaseConfig.plugins).toContain(
      "./scripts/sync-release-version.mjs"
    );
    expect(gitPlugin?.[1].assets).toContain("package.json");
  });

  it("syncs package.json versions to the semantic-release next version", async () => {
    const releasePlugin = await import(
      pathToFileURL(path.join(root, "scripts/sync-release-version.mjs")).href
    );
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "stepper-release-"));
    tempDirs.push(tempDir);

    await writeJson(path.join(tempDir, "package.json"), {
      name: "stepper",
      version: "0.1.0",
      private: true,
    });
    await writeJson(path.join(tempDir, "packages/stepper/package.json"), {
      name: "@francozeta/stepper",
      version: "0.1.0",
    });

    await releasePlugin.prepare(
      {},
      {
        cwd: tempDir,
        nextRelease: { version: "1.2.3" },
        logger: { log() {} },
      }
    );

    await expect(readJson(path.join(tempDir, "package.json"))).resolves.toMatchObject(
      { version: "1.2.3" }
    );
    await expect(
      readJson(path.join(tempDir, "packages/stepper/package.json"))
    ).resolves.toMatchObject({ version: "1.2.3" });
  });
});
