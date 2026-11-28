import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { cpus, availableParallelism, release, totalmem } from "node:os";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";
import { chromium } from "playwright";
import { rotatedOrder } from "../interaction-study.mjs";
import { runRound, summarizeRounds } from "./browser.mjs";
import { instrumentation } from "./page.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "../../..");
const source = join(repo, "components/ui/stepper.tsx");
const hash = content => createHash("sha256").update(content).digest("hex");

const baseline = {
  impl: "stepper", count: 3, react: "19.2.5", baseUi: "1.4.1",
  host: "default", callbacks: "stable", fieldScope: "app", childrenMode: "stable", motion: false,
};
const variant = (name, overrides = {}) => ({ name, ...baseline, ...overrides });
const native = (count, react = baseline.react) => variant(`native-${count}${react === baseline.react ? "" : "-react-19.3"}`, {
  impl: "native", count, react, baseUi: null,
});
const stepper = (count, overrides) => variant("stepper-" + count, { count, ...overrides });
const composed = variant("render-3", { host: "render" });
const suites = {
  pilot: [native(3), stepper(3), composed],
  deps: [
    native(3), native(3, "19.3.1"), stepper(3), variant("stepper-3-base-1.9", { baseUi: "1.9.0" }),
    composed, variant("render-3-base-1.9", { host: "render", baseUi: "1.9.0" }),
    variant("render-3-react-19.3", { host: "render", baseUi: "1.9.0", react: "19.3.1" }),
  ],
  scale: [native(3), native(10), native(30), stepper(3), stepper(10), stepper(30)],
  consumer: [
    native(30), stepper(3), variant("changing-3", { callbacks: "changing" }),
    stepper(30), variant("changing-30", { count: 30, callbacks: "changing" }),
    variant("rebuilt-30", { count: 30, childrenMode: "rebuilt" }),
    variant("field-local-30", { count: 30, fieldScope: "field" }),
  ],
  motion: [
    native(30), stepper(3), variant("motion-3", { motion: true }),
    stepper(30), variant("motion-30", { count: 30, motion: true }),
  ],
  cursor: [
    native(30), stepper(30), variant("frozen-cursor-30", { count: 30, cursor: "frozen" }),
    variant("motion-30", { count: 30, motion: true }),
    variant("instant-cursor-30", { count: 30, cursor: "instant", motion: true }),
  ],
  "forms-30": [
    native(30), stepper(30), variant("changing-30", { count: 30, callbacks: "changing" }),
    variant("field-local-30", { count: 30, fieldScope: "field" }),
  ],
};
const { values } = parseArgs({
  options: {
    suite: { type: "string", default: "pilot" },
    mode: { type: "string", default: "timing" },
    rounds: { type: "string" },
    cycles: { type: "string" },
    cpu: { type: "string", default: "4" },
  },
});
const cases = suites[values.suite];
assert(cases, "Suite must be one of " + Object.keys(suites).join(", "));
assert(["timing", "react", "cpu"].includes(values.mode), "Mode must be timing, react or cpu");
const profile = values.mode === "react";
const cpuProfile = values.mode === "cpu";
const defaultRounds = values.suite === "pilot" ? 1 : profile ? Math.min(4, cases.length) : cases.length;
const count = Number(values.rounds ?? defaultRounds);
const cycles = Number(values.cycles ?? (profile ? 1 : 2));
const cpuRate = Number(values.cpu);
assert([count, cycles].every(value => Number.isInteger(value) && value > 0), "Use positive integer rounds and cycles");
assert([1, 4].includes(cpuRate), "Use 1 or 4 for CPU rate");
const viewport = { width: 1280, height: 900 };
const executablePath = process.env.STEPPER_CHROMIUM_EXECUTABLE;
const startedAt = new Date().toISOString();

const optional = async path => {
  try {
    return (await readFile(path, "utf8")).trim();
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};
const cgroup = name => optional("/sys/fs/cgroup/" + name);
const environment = {
  model: cpus()[0]?.model ?? null,
  visibleLogicalCpus: cpus().length,
  availableParallelism: availableParallelism(),
  cpuSet: await cgroup("cpuset.cpus.effective"),
  cpuMax: await cgroup("cpu.max"),
  memoryLimitBytes: await cgroup("memory.max"),
  visibleMemoryBytes: totalmem(),
  os: { platform: process.platform, arch: process.arch, release: release(), description: await optional("/etc/os-release") },
  node: process.version,
  npm: execFileSync("npm", ["--version"], { encoding: "utf8" }).trim(),
  executablePath: executablePath ?? chromium.executablePath(),
  cgroupBefore: { cpu: await cgroup("cpu.stat"), memory: await cgroup("memory.current") },
};
const lock = await readFile(join(here, "package-lock.json"));
environment.lockSha256 = hash(lock);
const locked = JSON.parse(lock).packages;
const packagePaths = Object.keys(locked).filter(Boolean).sort((a, b) => b.length - a.length);
const work = await mkdtemp(join(here, ".work-"));
const out = join(here, "results");
const variants = Object.fromEntries(cases.map(options => [options.name, { options, rounds: [] }]));
const bundles = {};
const sourceMaps = new Map();
const put = (name, contents) => writeFile(join(work, name), contents);

function countRenders(source, names) {
  if (!profile) return source;
  for (const name of names) {
    // Match the implementation header, skipping any TypeScript overload signatures.
    const header = new RegExp("(^\\s*(?:export )?function " + name + "(?=<|\\()[\\s\\S]*?\\) \\{\\n)", "m");
    assert(header.test(source), "Missing render function " + name);
    source = source.replace(header, '$1  window.__bench.countRender("' + name + '");\n');
  }
  return source;
}

async function serveFixtures() {
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css" };
  const files = (await readdir(work)).filter(name => types[extname(name)]);
  const assets = new Map(await Promise.all(files.map(async name => ["/" + name, await readFile(join(work, name))])));
  const server = createServer((request, response) => {
    const content = assets.get(request.url);
    if (!content) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[extname(request.url)], "Cache-Control": "no-store",
    }).end(content);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return server;
}

try {
  const core = await readFile(source);
  const [fixture, nativeAdapter, stepperAdapter, globals] = await Promise.all([
    readFile(join(here, "fixture.tsx.txt"), "utf8"),
    readFile(join(here, "native.tsx.txt")),
    readFile(join(here, "stepper.tsx.txt")),
    readFile(join(repo, "app/globals.css"), "utf8"),
  ]);
  const startTokens = globals.indexOf("@custom-variant dark");
  const endTokens = globals.indexOf("@keyframes");
  assert(startTokens >= 0 && endTokens > startTokens, "Expected the product's color and theme tokens");
  await Promise.all([
    put("fixture.tsx", countRenders(fixture, ["App", "DraftField"])),
    put("native.tsx", countRenders(nativeAdapter.toString(), ["Flow", "NativeProgress"])),
    put("stepper.tsx", countRenders(stepperAdapter.toString(), ["Flow"])),
    put("core.tsx", countRenders(core.toString(), [
      "Stepper", "StepperList", "StepperItem", "StepperTrigger", "StepperElement",
      "StepperIndicator", "StepperLabel", "StepperSeparator", "StepperContent",
      "StepperPrevious", "StepperNext", "StepperNavigationButton",
    ])),
    put("input.css", `@import "tailwindcss" source(none);
@source "./fixture.tsx";
@source "./native.tsx";
@source "./stepper.tsx";
@source "./core.tsx";
${globals.slice(startTokens, endTokens)}`),
  ]);
  execFileSync(join(here, "node_modules/.bin/tailwindcss"), ["-i", "input.css", "-o", "styles.css", "--minify"], {
    cwd: work, stdio: ["ignore", "ignore", "inherit"],
  });
  const styles = await readFile(join(work, "styles.css"));
  environment.css = { bytes: styles.length, sha256: hash(styles), tailwind: locked["node_modules/tailwindcss"].version };

  for (const item of cases) {
    const key = [item.impl, item.react, item.baseUi].filter(Boolean).join("-");
    if (!bundles[key]) {
      const olderReact = item.react === baseline.react;
      const react = olderReact ? "react-19-2" : "react";
      const dom = olderReact ? "react-dom-19-2" : "react-dom";
      const base = item.baseUi === "1.9.0" ? "base-ui-1-9" : "@base-ui/react";
      const { metafile } = await build({
        absWorkingDir: here,
        entryPoints: [join(work, "fixture.tsx")], outfile: join(work, key + ".js"),
        platform: "browser", bundle: true, minify: true, jsx: "automatic", target: "es2022",
        keepNames: profile, metafile: true, logLevel: "error",
        sourcemap: cpuProfile ? "external" : false,
        define: { "process.env.NODE_ENV": '"production"', PROFILE_REACT: String(profile) },
        alias: {
          "bench-adapter": join(work, item.impl + ".tsx"),
          ...(olderReact && { react, "react-dom": dom }),
          "react-dom/client": dom + (profile ? "/profiling" : "/client"),
          ...(base !== "@base-ui/react" && { "@base-ui/react": base }),
        },
      });
      const packages = Object.fromEntries([...new Set(Object.keys(metafile.inputs)
        .map(path => packagePaths.find(pkg => path.startsWith(pkg + "/")))
        .filter(Boolean))].sort().map(path => [path, locked[path].version]));
      for (const [pkg, version] of Object.entries(packages)) {
        assert.equal(JSON.parse(await readFile(join(here, pkg, "package.json"))).version, version);
      }
      const runtimeKeys = Object.keys(packages).filter(path => /^node_modules\/react(-dom)?(-19-2)?$/.test(path));
      assert.deepEqual(runtimeKeys.sort(), ["node_modules/" + react, "node_modules/" + dom].sort());
      assert.equal(packages["node_modules/" + base], item.baseUi ?? undefined);
      const js = await readFile(join(work, key + ".js"));
      bundles[key] = { bytes: js.length, gzipBytes: gzipSync(js, { level: 9 }).length, packages };
      if (cpuProfile) sourceMaps.set(key, await readFile(join(work, key + ".js.map"), "utf8"));
    }
    variants[item.name].bundle = key;
    const diagnosticCss = {
      frozen: '[data-slot="stepper"]{--stepper-progress:0!important}',
      instant: '[data-slot="stepper"]{transition-property:none!important}',
    }[item.cursor];
    await put(item.name + ".html", `<!doctype html><html lang="en">
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stepper attribution</title><link rel="stylesheet" href="styles.css">
${diagnosticCss ? "<style>" + diagnosticCss + "</style>" : ""}
<div id="root"></div><script>window.__benchConfig = ${JSON.stringify({ ...item, profile })};${instrumentation}</script>
<script src="${key}.js"></script></html>`);
  }

  const server = await serveFixtures();
  let browser;
  try {
    browser = await chromium.launch({ executablePath, headless: true });
    environment.browser = browser.version();
    environment.playwright = locked["node_modules/playwright"].version;
    environment.cgroupBefore = { cpu: await cgroup("cpu.stat"), memory: await cgroup("memory.current") };
    const origin = "http://127.0.0.1:" + server.address().port;
    for (let round = 0; round < count; round++) {
      const order = Math.floor(round / cases.length) % 2 ? [...cases].reverse() : cases;
      for (const [position, item] of rotatedOrder(order, round).entries()) {
        const record = { round, position };
        variants[item.name].rounds.push(record);
        try {
          const bundle = variants[item.name].bundle;
          Object.assign(record, await runRound(browser, origin + "/" + item.name + ".html", {
            ...item, editFirst: round % 2 === 1,
          }, {
            mode: values.mode, cpuRate, cycles, viewport,
            sourceMap: sourceMaps.get(bundle), bundleUrl: origin + "/" + bundle + ".js",
          }));
        } catch (error) {
          record.error = String(error.stack ?? error);
          console.error(item.name, round + 1, error.message);
        }
      }
      console.log(values.suite, values.mode, "round", round + 1, "/", count);
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
  environment.cgroupAfter = { cpu: await cgroup("cpu.stat"), memory: await cgroup("memory.current") };
  for (const result of Object.values(variants)) {
    result.summary = summarizeRounds(result.rounds, values.mode);
  }
  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    sourceRevision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim(),
    coreSha256: hash(core),
    suite: values.suite,
    mode: values.mode,
    cpuRate,
    viewport,
    rounds: count,
    cycles,
    environment,
    bundles,
    variants,
  };
  await mkdir(out, { recursive: true });
  const file = join(out, `${values.suite}-${values.mode}-${cpuRate}x.json`);
  await writeFile(file, JSON.stringify(report, null, 2) + "\n");
  console.log(file);
  if (Object.values(variants).some(item => item.rounds.some(round => round.error))) process.exitCode = 1;
} finally {
  await rm(work, { recursive: true, force: true });
}
