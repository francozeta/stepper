import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const checkMode = process.argv.includes("--check");

const stepperSourceFile = "components/ui/stepper.tsx";

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, "\n");
}

async function buildStepperSource() {
  const source = normalizeLineEndings(
    await readFile(path.join(root, stepperSourceFile), "utf8")
  );

  return source.endsWith("\n") ? source : `${source}\n`;
}

function buildRegistryItem() {
  return `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "stepper",
      type: "registry:ui",
      title: "Stepper",
      description:
        "A lightweight, composable stepper primitive for shadcn/ui-style multi-step flows.",
      dependencies: ["@radix-ui/react-slot"],
      files: [
        {
          path: "registry/default/ui/stepper.tsx",
          type: "registry:ui",
          target: "components/ui/stepper.tsx",
        },
      ],
    },
    null,
    2
  )}\n`;
}

function buildStepperDemoItem() {
  return `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "stepper-demo",
      type: "registry:block",
      title: "Stepper Demo",
      description:
        "A styled Stepper demo with a default export and the Stepper source primitive.",
      dependencies: ["@radix-ui/react-slot"],
      files: [
        {
          path: "registry/default/ui/stepper.tsx",
          type: "registry:ui",
          target: "components/ui/stepper.tsx",
        },
        {
          path: "registry/default/examples/stepper-demo.tsx",
          type: "registry:component",
          target: "components/stepper-demo.tsx",
        },
      ],
    },
    null,
    2
  )}\n`;
}

function buildStepperIntentOnboardingItem() {
  return `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
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
      registryDependencies: [
        "button",
        "checkbox",
        "field",
        "input",
        "separator",
      ],
      files: [
        {
          path: "registry/default/ui/stepper.tsx",
          type: "registry:ui",
          target: "components/ui/stepper.tsx",
        },
        {
          path: "registry/default/examples/stepper-intent-onboarding.tsx",
          type: "registry:component",
          target: "components/stepper-intent-onboarding.tsx",
        },
        {
          path: "components/stepper-logo.tsx",
          type: "registry:component",
          target: "components/stepper-logo.tsx",
        },
      ],
    },
    null,
    2
  )}\n`;
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
  const registryItem = buildRegistryItem();
  const stepperDemoItem = buildStepperDemoItem();
  const stepperIntentOnboardingSource = normalizeLineEndings(
    await readFile(
      path.join(root, "components/stepper-intent-onboarding.tsx"),
      "utf8"
    )
  );
  const stepperIntentOnboardingItem = buildStepperIntentOnboardingItem();

  await writeOrCheck("registry/default/ui/stepper.tsx", registrySource);
  await writeOrCheck("registry/default/ui/stepper.json", registryItem);
  await writeOrCheck(
    "registry/default/examples/stepper-demo.json",
    stepperDemoItem
  );
  await writeOrCheck(
    "registry/default/examples/stepper-intent-onboarding.tsx",
    stepperIntentOnboardingSource
  );
  await writeOrCheck(
    "registry/default/examples/stepper-intent-onboarding.json",
    stepperIntentOnboardingItem
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
