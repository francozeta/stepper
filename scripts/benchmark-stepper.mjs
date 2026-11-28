import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Pinned owner-approved Base UI + cn baseline; both revisions use this checkout's dependencies.
const baseline = "b77468db754496c79cc268315eb7bbc2a317dd6f";
const root = fileURLToPath(new URL("../", import.meta.url));
const source = "components/ui/stepper.tsx";
const previous = execFileSync("git", ["show", baseline + ":" + source], { cwd: root, encoding: "utf8" });
const current = readFileSync(join(root, source), "utf8");
console.log("STEPPER_SOURCE", JSON.stringify({
  baseline: { revision: baseline, bytes: Buffer.byteLength(previous), lines: previous.trimEnd().split("\n").length },
  candidate: { revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(), bytes: Buffer.byteLength(current), lines: current.trimEnd().split("\n").length },
  node: process.version,
}));
const dir = mkdtempSync(join(root, "test", "stepper-benchmark-"));
try {
  writeFileSync(join(dir, "baseline.tsx"), previous);
  writeFileSync(join(dir, "comparison.test.tsx"), readFileSync(join(root, "scripts", "benchmark-stepper.fixture.txt")));
  const result = spawnSync(process.execPath, [join(root, "node_modules", "vitest", "vitest.mjs"), "run", join(dir, "comparison.test.tsx"), "--reporter=verbose"], { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
