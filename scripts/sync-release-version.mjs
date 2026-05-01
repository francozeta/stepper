import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const defaultPackagePaths = ["package.json", "packages/stepper/package.json"];

async function updatePackageVersion(root, packagePath, version) {
  const absolutePath = path.join(root, packagePath);
  const packageJson = JSON.parse(await readFile(absolutePath, "utf8"));

  if (packageJson.version === version) {
    return false;
  }

  packageJson.version = version;
  await writeFile(absolutePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  return true;
}

async function syncReleaseVersion({
  cwd = process.cwd(),
  version,
  packagePaths = defaultPackagePaths,
  logger,
}) {
  if (!version) {
    throw new Error("sync-release-version requires nextRelease.version.");
  }

  const updatedPaths = [];

  for (const packagePath of packagePaths) {
    const didUpdate = await updatePackageVersion(cwd, packagePath, version);

    if (didUpdate) {
      updatedPaths.push(packagePath);
    }
  }

  if (updatedPaths.length > 0) {
    logger?.log?.(
      `Synced release version ${version} in ${updatedPaths.join(", ")}.`
    );
  }
}

async function prepare(pluginConfig = {}, context = {}) {
  await syncReleaseVersion({
    cwd: context.cwd,
    version: context.nextRelease?.version,
    packagePaths: pluginConfig.packagePaths,
    logger: context.logger,
  });
}

export { prepare, syncReleaseVersion };
