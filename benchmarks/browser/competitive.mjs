import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { TraceMap, originalPositionFor } from "@jridgewell/trace-mapping";
import { build } from "esbuild";
import { chromium } from "playwright";
import { adapters, adapterHeader, stepperGuard } from "./competitive-adapters.mjs";
import { runRound, summarizeRounds, timingScript } from "./competitive-browser.mjs";
import { rotatedOrder } from "./interaction-study.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = process.env.STEPPER_REPO ?? join(here, "../..");
const out = join(here, "results", "competitive");
const historical = "5cd44a9512fa92c979dddaa30beefdd74fcd218c";
const diceRevision = "391f1ef1a015e34666b25aa00c07de4a80feeea1";
const smoke = process.argv.includes("--smoke");
const react = process.argv.includes("--react");
const cpu = process.argv.includes("--cpu");
const guard = process.argv.includes("--guard");
assert(Number(smoke) + Number(react) + Number(cpu) + Number(guard) <= 1, "Select at most one measurement mode");
const mode = smoke ? "smoke" : react ? "react" : cpu ? "cpu" : guard ? "guard" : "timing";
const captureCpu = cpu || guard;
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trimEnd();
const hash = content => createHash("sha256").update(content).digest("hex");
const put = (name, content) => writeFile(join(out, name), content);
const sourcePath = "components/ui/stepper.tsx";
const current = await readFile(join(root, sourcePath), "utf8");
const fixture = await readFile(join(here, "competitive-fixture.tsx.txt"), "utf8");
const lock = await readFile(join(here, "package-lock.json"));
const versions = Object.fromEntries(Object.entries(JSON.parse(lock).packages)
  .filter(([path]) => path.startsWith("node_modules/") && !path.slice(13).includes("/node_modules/"))
  .map(([path, pkg]) => [path.slice(13), pkg.version]));
const names = captureCpu ? ["stepper-before", "stepper"] : Object.keys(adapters);
await mkdir(out, { recursive: true });
await put("fixture.tsx", react ? fixture.replace('"react-dom/client"', '"react-dom/profiling"') : fixture);

async function diceSource() {
  const origin = "https://raw.githubusercontent.com/sadmann7/diceui/" + diceRevision + "/docs/registry/";
  const sources = {};
  await Promise.all(Object.entries({
    "dice.tsx": "bases/base/ui/stepper.tsx",
    "dice-direction.tsx": "bases/base/ui/direction.tsx",
  }).map(async ([file, path]) => {
    const cache = file + "." + diceRevision + ".upstream";
    let source;
    try {
      source = await readFile(join(out, cache), "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      const response = await fetch(origin + path, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw Error("Dice UI source unavailable: " + response.status);
      source = await response.text();
      await put(cache, source);
    }
    sources[file] = hash(source);
    if (file === "dice.tsx") {
      source = source.replace('"@/registry/bases/base/ui/direction"', '"./dice-direction"')
        .replace('import { IconPlaceholder } from "@/registry/icons/icon-placeholder";', 'import { Check } from "lucide-react";')
        .replace(/<IconPlaceholder\s+lucide="Check"[^>]*\/>/, '<Check className="cn-stepper-indicator-2" />');
      assert(!source.includes("IconPlaceholder"), "Unresolved Dice UI icon");
    }
    await put(file, source);
  }));
  return sources;
}

const diceHashes = names.includes("dice") && await diceSource();
const css = `*{box-sizing:border-box}body{margin:16px;font:16px system-ui}main{max-width:540px;margin:auto}
button,input{font:inherit}button{padding:8px 10px}button:focus-visible{outline:2px solid #555;outline-offset:2px}
[data-bench-list]{display:flex;list-style:none;gap:4px;padding:0;margin:16px 0}
[data-bench-list]>*{flex:1;min-width:0;position:relative}
[data-bench-step]{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;font-size:14px}
[data-bench-step]>*{margin:0} [data-bench-separator]{display:block;width:100%;height:1px;background:#666}
[data-bench-panel]{min-height:172px;border:1px solid #888;padding:12px}h2{font-size:18px;margin:0 0 12px}
label{display:block;margin:10px 0}input:not([type=checkbox]){display:block;width:100%;padding:8px}
footer,[data-bench-footer]{display:flex;gap:8px;margin-top:12px}[hidden]{display:none!important}`;

function attribute(profile, map, bundle) {
  const frames = new Map(profile.nodes.map(node => [node.id, node.callFrame]));
  const groups = {};
  for (const [i, id] of profile.samples.entries()) {
    const frame = frames.get(id);
    if (frame.functionName === "(idle)") continue;
    const position = frame.url.endsWith("/" + bundle) && frame.lineNumber >= 0
      ? originalPositionFor(map, { line: frame.lineNumber + 1, column: frame.columnNumber }) : null;
    const source = position?.source;
    const pkg = source?.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1];
    const group = pkg ?? source?.split("/").at(-1) ?? (frame.functionName.startsWith("(") ? frame.functionName : "browser/automation");
    groups[group] = (groups[group] ?? 0) + (profile.timeDeltas[i] ?? 0) / 1000;
  }
  return groups;
}

const variants = {};
const browser = await chromium.launch({ headless: true, executablePath: process.env.STEPPER_CHROMIUM_EXECUTABLE });
try {
  for (const name of names) {
    await put("core.tsx", name === "stepper-before" ? git("show", historical + ":" + sourcePath) : current);
    const adapter = guard ? stepperGuard : adapters[name];
    await put("adapter.tsx", adapterHeader + adapter);
    const bytes = {};
    for (const shared of react || captureCpu ? [true] : [false, true]) {
      const bundle = name + "-" + (shared ? "shared" : "plain") + ".js";
      await build({
        entryPoints: [join(out, "fixture.tsx")], outfile: join(out, bundle), platform: "browser",
        bundle: true, minify: true, jsx: "automatic", target: "es2022", sourcemap: captureCpu ? "external" : false,
        define: { "process.env.NODE_ENV": '"production"', SHARED_CN: String(shared), PROFILE_REACT: String(react) },
      });
      const content = await readFile(join(out, bundle));
      bytes[shared ? "shared" : "plain"] = { minified: content.length, gzip: gzipSync(content, { level: 9 }).length };
      if (shared) {
        await put(name + ".html", '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Workspace setup benchmark</title><style>' + css + '</style><div id="root"></div><script>' + timingScript + '</script><script src="./' + bundle + '"></script></html>');
      }
    }
    variants[name] = { bytes, adapterLines: adapter.trim().split("\n").length, rounds: [] };
  }

  const count = smoke ? 1 : names.length * (react ? 1 : captureCpu ? 3 : 2);
  for (const mobile of react || captureCpu ? [true] : [false, true]) {
    for (let round = 0; round < count; round++) {
      const order = (mobile ? [...names].reverse() : names).slice();
      if (round >= names.length) order.reverse();
      for (const [position, name] of rotatedOrder(order, round).entries()) {
        const record = { mobile, round, position };
        variants[name].rounds.push(record);
        try {
          const { cpu: profile, ...measured } = await runRound(browser, pathToFileURL(join(out, name + ".html")).href, {
            mobile, audit: !react && !captureCpu && !mobile && round === 0, captureCpu,
          });
          Object.assign(record, measured);
          if (profile) {
            const bundle = name + "-shared.js";
            const map = new TraceMap(await readFile(join(out, bundle + ".map"), "utf8"));
            record.cpuLeafMs = attribute(profile, map, bundle);
            await put(mode + "-" + name + "-" + round + ".cpuprofile", JSON.stringify(profile));
          }
        } catch (error) {
          record.error = String(error).replaceAll(out, "[fixture]").slice(0, 1500);
          console.error(name, mobile, round, record.error);
        }
      }
      console.log(mode, mobile ? "mobile4x" : "desktop", "round", round + 1, "/", count);
    }
  }

  for (const variant of Object.values(variants)) {
    for (const [kind, value] of Object.entries(variant.bytes)) {
      if (variants.native) value.aboveNativeGzip = value.gzip - variants.native.bytes[kind].gzip;
    }
    variant.summary = summarizeRounds(variant.rounds);
  }
  await put(mode + ".json", JSON.stringify({
    revision: git("rev-parse", "HEAD"), currentCoreSha256: hash(current.replaceAll("\r\n", "\n")),
    historical, diceRevision, diceHashes, lockSha256: hash(lock.toString().replaceAll("\r\n", "\n")), mode,
    node: process.version, platform: process.platform, browser: browser.version(),
    versions: Object.fromEntries(["react", "react-dom", "@stepperize/react", "@ark-ui/react", "@base-ui/react",
      "@base-ui/utils", "cn", "lucide-react", "axe-core", "esbuild", "playwright"].map(name => [name, versions[name]])),
    variants,
  }) + "\n");
  if (Object.values(variants).some(variant => variant.rounds.some(round => round.error))) process.exitCode = 1;
} finally {
  await browser.close();
}
