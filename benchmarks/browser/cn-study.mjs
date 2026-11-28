import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { build as bundle } from "esbuild";
import { build as compile } from "cn/build";
import { cn } from "cn";

// Isolated synthetic consumer. Never rewrite registry code or ship fitted tables.
const here = dirname(fileURLToPath(import.meta.url));
const root = process.env.STEPPER_REPO ?? join(here, "../..");
const dir = mkdtempSync(join(here, "cn-study-"));
const read = name => readFileSync(join(here, name), "utf8");
const put = (name, source) => writeFileSync(join(dir, name), source);
const core = readFileSync(join(root, "components/ui/stepper.tsx"), "utf8");
const fixture = read("fixture.tsx.txt");
const sharedFixture = 'import { cn } from "./merge.js";\n' +
  fixture.replace("<h1>Set up your business</h1>",
    '<h1 className={cn("text-sm font-medium rounded-md px-2", "text-lg px-4")}>Set up your business</h1>');
if (sharedFixture.endsWith(fixture)) throw new Error("Fixture anchor missing");
const cases = [
  ["h-9 rounded-none", "h-12 rounded-full"],
  ["px-2 py-1", "px-6"],
  ["text-sm text-muted-foreground", "text-lg text-foreground"],
  ["start-1 end-2", "inset-x-4"],
  ["sm:gap-4", "sm:gap-2"],
  ["data-[state=active]:bg-primary", "data-[state=active]:bg-red-500"],
  ["focus-visible:outline-2", "focus-visible:outline-4"],
  ["size-8", "w-10 h-10"],
  ["bg-muted/25", "bg-transparent"],
  ["[--stepper-indicator-size:1.75rem]", "[--stepper-indicator-size:2rem]"],
];
const metrics = [];
try {
  put("core.tsx", core.replace('from "cn"', 'from "./merge.js"'));
  put("shared.tsx", sharedFixture);
  put("plain.tsx", fixture);
  put("consumer-overrides.ts", "export default " + JSON.stringify(cases) + ";\n");
  put("stepper-adapter.tsx", read("stepper.tsx.txt"));
  const compiled = await compile({
    cwd: dir,
    content: ["core.tsx", "shared.tsx", "plain.tsx", "stepper-adapter.tsx", "consumer-overrides.ts"],
    out: "tables.js",
  });
  put("compiled.js", 'import { createCn } from "cn/engine"; import tables from "./tables.js"; export const cn = createCn(tables);\n');
  const { cn: fitted } = await import(pathToFileURL(join(dir, "compiled.js")).href);
  const parity = cases.map(args => ({ args, full: cn(...args), fitted: fitted(...args) }));
  for (const item of parity) {
    if (item.full !== item.fitted) throw new Error("Scanned override mismatch: " + JSON.stringify(item));
  }
  for (const mode of ["plain", "shared-full", "shared-fitted"]) {
    put("merge.js", mode === "shared-fitted"
      ? 'export { cn } from "./compiled.js";\n'
      : 'export { cn } from "cn";\n');
    for (const adapter of ["native", "stepper"]) {
      put("adapter.tsx", read(adapter + ".tsx.txt"));
      const result = await bundle({
        entryPoints: [join(dir, mode === "plain" ? "plain.tsx" : "shared.tsx")],
        bundle: true, write: false, minify: true, jsx: "automatic",
        platform: "browser", target: "es2022",
        define: { "process.env.NODE_ENV": '"production"' },
      });
      const bytes = result.outputFiles[0].contents;
      metrics.push({ mode, adapter, minifiedBytes: bytes.length, gzipBytes: gzipSync(bytes, { level: 9 }).length });
    }
  }
  const incremental = ["plain", "shared-full", "shared-fitted"].map(mode => {
    const native = metrics.find(x => x.mode === mode && x.adapter === "native");
    const stepper = metrics.find(x => x.mode === mode && x.adapter === "stepper");
    return { mode, incrementalGzipBytes: stepper.gzipBytes - native.gzipBytes };
  });
  console.log(JSON.stringify({
    node: process.version,
    usedGroups: compiled.usedGroups, totalGroups: compiled.totalGroups,
    warnings: compiled.warnings, parity, metrics, incremental,
    caveat: "Synthetic consumer, same source and dependencies. No browser or real shadcn installation in this study. Only scanned override cases tested. Fitted tables are application-local and never distributed.",
  }, null, 2));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
