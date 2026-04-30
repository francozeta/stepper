import type { Metadata } from "next";

import { PageHeader } from "@/components/docs-content";
import { DocsExample } from "@/components/docs-example";
import {
  StepperMobilePatternExample,
  StepperRoutePatternExample,
} from "@/components/stepper-examples";
import {
  mobileDrawerPatternSnippet,
  routeBasedPatternSnippet,
} from "@/lib/docs";

export const metadata: Metadata = {
  title: "Patterns",
};

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        eyebrow="guides"
        title="Patterns"
        description="Patterns show how to compose Stepper with routing and responsive UI without adding more responsibilities to the core primitive."
      />

      <DocsExample
        title="Route-based stepper"
        description="Use StepperTrigger asChild with Next.js Link when routes, layouts, or server data own the current step."
        code={routeBasedPatternSnippet}
        filename="route-based-stepper.tsx"
        preview={<StepperRoutePatternExample />}
      />

      <DocsExample
        title="Mobile drawer pattern"
        description="On small screens, keep the Stepper primitive unchanged and move the step list into Sheet or Drawer composition."
        code={mobileDrawerPatternSnippet}
        filename="mobile-drawer-pattern.tsx"
        preview={<StepperMobilePatternExample />}
      />
    </>
  );
}
