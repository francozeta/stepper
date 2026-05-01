import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(path.join(root, filePath), "utf8"));
}

try {
  const packageJson = await readJson("packages/stepper/package.json");

  assert(
    packageJson.exports?.["./styles.css"] === "./dist/styles.css",
    'packages/stepper/package.json must export "./styles.css".'
  );
  assert(
    Array.isArray(packageJson.sideEffects) &&
      packageJson.sideEffects.includes("**/*.css"),
    'packages/stepper/package.json must mark CSS as a side effect.'
  );

  const styles = await readFile(
    path.join(root, "packages/stepper/dist/styles.css"),
    "utf8"
  );

  assert(styles.length > 1000, "dist/styles.css looks unexpectedly small.");
  assert(
    styles.length < 30000,
    "dist/styles.css looks too large; Tailwind may be scanning more than the Stepper package source."
  );
  assert(
    !styles.includes("@source"),
    "dist/styles.css must be compiled and must not contain @source."
  );
  assert(
    !styles.includes("@import"),
    "dist/styles.css must be compiled and must not contain @import."
  );
  assert(
    styles.includes("data-slot") || styles.includes("data-position"),
    "dist/styles.css should include Stepper selectors or variants."
  );
  assert(
    !styles.includes("recharts") &&
      !styles.includes("tabs-list") &&
      !styles.includes("sidebar"),
    "dist/styles.css includes docs/app utilities; package CSS should only include Stepper styles."
  );

  console.log("Stepper package CSS export looks valid.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
