import type { Metadata } from "next";

import { PageHeader } from "@/components/docs-content";
import { DocsExample } from "@/components/docs-example";
import {
  StepperCircleProgressRecipeExample,
  StepperControlsOnlyRecipeExample,
  StepperMobilePatternExample,
  StepperRoutePatternExample,
  StepperSegmentedRecipeExample,
} from "@/components/stepper-examples";
import {
  circleProgressRecipeSnippet,
  controlsOnlyRecipeSnippet,
  mobileDrawerPatternSnippet,
  routeBasedPatternSnippet,
  segmentedRecipeSnippet,
} from "@/lib/docs";

export const metadata: Metadata = {
  title: "Recipes",
};

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        eyebrow="guides"
        title="Recipes"
        description="Visual recipes show how far composition can go without adding variant props or extra responsibilities to the Stepper primitive."
      />

      <DocsExample
        title="Segmented line"
        description="A minimal product onboarding style with line segments instead of circles or icons."
        badge="Recipe"
        code={segmentedRecipeSnippet}
        filename="segmented-stepper.tsx"
        preview={<StepperSegmentedRecipeExample />}
      />

      <DocsExample
        title="Circle progress"
        description="A compact recipe for dense forms where the current step matters more than the full list."
        badge="Recipe"
        code={circleProgressRecipeSnippet}
        filename="circle-progress-stepper.tsx"
        preview={<StepperCircleProgressRecipeExample />}
      />

      <DocsExample
        title="Controls only"
        description="Hide the step list visually and keep the flow focused on the active panel and actions."
        badge="Recipe"
        code={controlsOnlyRecipeSnippet}
        filename="controls-only-stepper.tsx"
        preview={<StepperControlsOnlyRecipeExample />}
      />

      <DocsExample
        title="Route-based stepper"
        description="Use StepperTrigger asChild with Next.js Link when routes, layouts, or server data own the current step."
        badge="Pattern"
        code={routeBasedPatternSnippet}
        filename="route-based-stepper.tsx"
        preview={<StepperRoutePatternExample />}
      />

      <DocsExample
        title="Mobile drawer pattern"
        description="On small screens, keep the Stepper primitive unchanged and move the step list into Sheet or Drawer composition."
        badge="Pattern"
        code={mobileDrawerPatternSnippet}
        filename="mobile-drawer-pattern.tsx"
        preview={<StepperMobilePatternExample />}
      />
    </>
  );
}
