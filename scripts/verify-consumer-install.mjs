import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = mkdtempSync(join(tmpdir(), "stepper-consumer-"));
const env = { ...process.env, npm_config_ignore_scripts: "true", npm_config_audit: "false", npm_config_fund: "false", CI: "true" };
const put = (path, source) => writeFileSync(join(dir, path), source);
const json = (path, data) => put(path, JSON.stringify(data, null, 2) + "\n");
const run = (command, args) => execFileSync(command, args, { cwd: dir, env, stdio: "inherit", timeout: 180000 });
const bin = name => join(dir, "node_modules", ".bin", name);

// This is an opt-in isolated npm fixture, not a mutation of an existing consumer.
// It deliberately checks installed output, not merely the source registry.
try {
  mkdirSync(join(dir, "src/lib"), { recursive: true });
  json("package.json", { name: "stepper-consumer", version: "1.0.0", private: true });
  put("src/index.css", '@import "tailwindcss";\n@theme { --color-primary: #111; }\n');
  put("src/lib/utils.ts", 'export { cn } from "cn";\n');
  put("vite.config.ts", "export default {};\n");
  put("index.html", '<html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n');
  json("tsconfig.json", {
    compilerOptions: {
      target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"], module: "ESNext",
      moduleResolution: "bundler", jsx: "react-jsx", strict: true, skipLibCheck: true,
      noEmit: true, baseUrl: ".", paths: { "@/*": ["./src/*"] },
    }, include: ["src"],
  });
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund",
    "shadcn@4.8.2", "react@19.2.5", "react-dom@19.2.5",
    "typescript@5.9.3", "@types/react@19", "@types/react-dom@19",
    "tailwindcss@4.2.4", "esbuild@0.28.1"]);
  const docs = readFileSync(join(root, "lib/docs.ts"), "utf8");
  const quickstart = docs.match(/const controlledSnippet = `([\s\S]*?)`;/)?.[1];
  assert.ok(quickstart, "Missing controlled quickstart");
  for (const [style, alias, target] of [
    ["base-nova", "@/components/ui", "src/components/ui/stepper.tsx"],
    ["radix-nova", "@/ui", "src/ui/stepper.tsx"],
  ]) {
    json("components.json", {
      $schema: "https://ui.shadcn.com/schema.json", style, rsc: false, tsx: true,
      tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true, prefix: "" },
      iconLibrary: "lucide",
      aliases: { components: "@/components", ui: alias, utils: "@/lib/utils", lib: "@/lib", hooks: "@/hooks" },
    });
    run(bin("shadcn"), ["add", join(root, "public/stepper.json"), "-y"]);
    assert.ok(existsSync(join(dir, target)), "Registry ignored UI alias");
    const installed = readFileSync(join(dir, target), "utf8");
    assert.equal((installed.match(/legacyAsChild=\{asChild\}/g) || []).length, 3, "CLI transformed internal props");
    put("src/main.tsx", quickstart.replace("@/components/ui/stepper", alias + "/stepper"));
    put("src/smoke.tsx", `
import { renderToStaticMarkup } from "react-dom/server";
import { SetupStepper } from "./main";
import { Stepper, StepperContent, StepperItem, StepperList, StepperTrigger, StepperNext } from "${alias}/stepper";
const initial = renderToStaticMarkup(<SetupStepper />);
if (!initial.includes('aria-current="step"') || !initial.includes("Enter your details.") || initial.includes("Review your details.")) {
  throw Error("Invalid initial panel");
}
const legacy = renderToStaticMarkup(
  <Stepper steps={[{ value: "a" }, { value: "b" }]} value="a">
    <StepperList><StepperItem value="a" defaultTrigger={false}><StepperTrigger asChild><a href="#a">Legacy trigger</a></StepperTrigger></StepperItem><StepperItem value="b">B</StepperItem></StepperList>
    <StepperContent value="a" asChild><section>Legacy content</section></StepperContent>
    <StepperNext asChild><a href="#b">Legacy next</a></StepperNext>
  </Stepper>
);
for (const pattern of [/<a[^>]*data-slot="stepper-trigger"/, /<section[^>]*data-slot="stepper-content"/, /<a[^>]*data-slot="stepper-next"/]) {
  if (!pattern.test(legacy)) throw Error("Legacy host lost: " + pattern);
}
`);
    run(bin("tsc"), ["--noEmit"]);
    run(bin("esbuild"), ["src/main.tsx", "--bundle", "--minify", "--platform=browser", "--outfile=client.js"]);
    run(bin("esbuild"), ["src/smoke.tsx", "--bundle", "--platform=node", "--format=cjs", "--outfile=smoke.cjs"]);
    run(process.execPath, ["smoke.cjs"]);
    console.log("CONSUMER_PASS", style, target);
  }
  run("npm", ["ls", "@base-ui/react", "cn", "shadcn", "--depth=0"]);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
