import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const checkMode = process.argv.includes("--check");

const registrySchema = "https://ui.shadcn.com/schema/registry.json";
const registryItemSchema = "https://ui.shadcn.com/schema/registry-item.json";
const stepperSourceFile = "components/ui/stepper.tsx";
const stepperLogoSourceFile = "components/stepper-logo.tsx";
const uiTarget = "@ui/stepper.tsx";
const componentTarget = "@components";

const stepperItem = {
  name: "stepper",
  type: "registry:ui",
  title: "Stepper",
  description:
    "A lightweight, composable stepper primitive for shadcn/ui-style multi-step flows.",
  dependencies: ["@radix-ui/react-slot"],
  files: [
    {
      path: "ui/stepper.tsx",
      type: "registry:ui",
      target: uiTarget,
    },
  ],
};

const stepperDependencyFile = {
  path: "ui/stepper.tsx",
  type: "registry:ui",
  target: uiTarget,
};

const stepperDemoItem = {
  name: "stepper-demo",
  type: "registry:block",
  title: "Stepper Demo",
  description:
    "A styled Stepper demo with a default export and the Stepper source primitive.",
  dependencies: ["@radix-ui/react-slot"],
  files: [
    stepperDependencyFile,
    {
      path: "examples/stepper-demo.tsx",
      type: "registry:component",
      target: `${componentTarget}/stepper-demo.tsx`,
    },
  ],
};

const stepperIntentOnboardingItem = {
  name: "stepper-intent-onboarding",
  type: "registry:block",
  title: "Stepper Intent Onboarding",
  description:
    "An intent-driven onboarding block with hidden Stepper state, intent routing, profile validation, interests, async setup, and a signed-in completion state.",
  dependencies: [
    "@radix-ui/react-slot",
    "lucide-react",
    "react-icons",
    "react-hook-form",
    "zod",
  ],
  registryDependencies: ["button", "checkbox", "field", "input", "separator"],
  files: [
    stepperDependencyFile,
    {
      path: "examples/stepper-intent-onboarding.tsx",
      type: "registry:component",
      target: `${componentTarget}/stepper-intent-onboarding.tsx`,
    },
    {
      path: "components/stepper-logo.tsx",
      type: "registry:component",
      target: `${componentTarget}/stepper-logo.tsx`,
    },
  ],
};

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, "\n");
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function buildStepperSource() {
  const source = normalizeLineEndings(
    await readFile(path.join(root, stepperSourceFile), "utf8")
  );

  return source.endsWith("\n") ? source : `${source}\n`;
}

async function buildStepperLogoSource() {
  const source = normalizeLineEndings(
    await readFile(path.join(root, stepperLogoSourceFile), "utf8")
  );

  return source.endsWith("\n") ? source : `${source}\n`;
}

function buildRootRegistry() {
  return formatJson({
    $schema: registrySchema,
    name: "stepper",
    homepage: "https://francozeta-stepper.vercel.app",
    include: ["registry/default/registry.json"],
  });
}

function buildDefaultRegistry() {
  return formatJson({
    $schema: registrySchema,
    items: [stepperItem, stepperDemoItem, stepperIntentOnboardingItem],
  });
}

function buildRegistryItem(item) {
  return formatJson({
    $schema: registryItemSchema,
    ...item,
  });
}

async function writeOrCheck(filePath, content) {
  const absolutePath = path.join(root, filePath);

  if (checkMode) {
    let currentContent;

    try {
      currentContent = await readFile(absolutePath, "utf8");
    } catch {
      throw new Error(`${filePath} is missing. Run pnpm registry:build.`);
    }

    if (normalizeLineEndings(currentContent) !== content) {
      throw new Error(`${filePath} is out of date. Run pnpm registry:build.`);
    }

    return;
  }

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content);
}

try {
  const registrySource = await buildStepperSource();
  const stepperLogoSource = await buildStepperLogoSource();
  const stepperIntentOnboardingSource = normalizeLineEndings(
    await readFile(
      path.join(root, "components/stepper-intent-onboarding.tsx"),
      "utf8"
    )
  );

  await writeOrCheck("registry.json", buildRootRegistry());
  await writeOrCheck("registry/default/registry.json", buildDefaultRegistry());
  await writeOrCheck("registry/default/ui/stepper.tsx", registrySource);
  await writeOrCheck(
    "registry/default/ui/stepper.json",
    buildRegistryItem(stepperItem)
  );
  await writeOrCheck(
    "registry/default/components/stepper-logo.tsx",
    stepperLogoSource
  );
  await writeOrCheck(
    "registry/default/examples/stepper-demo.json",
    buildRegistryItem(stepperDemoItem)
  );
  await writeOrCheck(
    "registry/default/examples/stepper-intent-onboarding.tsx",
    stepperIntentOnboardingSource
  );
  await writeOrCheck(
    "registry/default/examples/stepper-intent-onboarding.json",
    buildRegistryItem(stepperIntentOnboardingItem)
  );

  console.log(
    checkMode
      ? "Registry output is up to date."
      : "Generated registry Stepper artifacts."
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
