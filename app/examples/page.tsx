import type { Metadata } from "next";

import { DocsExample } from "@/components/docs-example";
import { PageHeader } from "@/components/docs-content";
import {
  StepperCheckoutExample,
  StepperControlledExample,
  StepperExample,
  StepperVerticalExample,
} from "@/components/stepper-examples";
import {
  checkoutExampleCode,
  controlledExampleCode,
  verticalExampleCode,
  workspaceExampleCode,
} from "@/lib/docs";

export const metadata: Metadata = {
  title: "Examples",
};

const examples = [
  {
    title: "Create workspace",
    description:
      "Show a product setup flow with blockers, completion, and disabled future steps.",
    badge: "Product flow",
    code: workspaceExampleCode,
    filename: "workspace-setup.tsx",
    component: <StepperExample />,
  },
  {
    title: "Checkout flow",
    description:
      "Guide customers through cart review, shipping details, and payment.",
    badge: "Horizontal",
    code: checkoutExampleCode,
    filename: "checkout-flow.tsx",
    component: <StepperCheckoutExample />,
  },
  {
    title: "Workspace onboarding",
    description:
      "Use a vertical layout when each step needs more context and scanning.",
    badge: "Vertical",
    code: verticalExampleCode,
    filename: "workspace-onboarding.tsx",
    component: <StepperVerticalExample />,
  },
  {
    title: "Controlled review",
    description:
      "Drive the active step from React state when the flow depends on app logic.",
    badge: "Controlled",
    code: controlledExampleCode,
    filename: "controlled-stepper.tsx",
    component: <StepperControlledExample />,
  },
];

export default function ExamplesPage() {
  return (
    <>
      <PageHeader
        eyebrow="api"
        title="Examples"
        description="Focused Stepper demos for product setup, checkout, vertical onboarding, and controlled React state."
      />

      <div className="flex flex-col gap-6">
        {examples.map((example) => (
          <DocsExample
            key={example.title}
            title={example.title}
            description={example.description}
            badge={example.badge}
            code={example.code}
            filename={example.filename}
            preview={example.component}
          />
        ))}
      </div>
    </>
  );
}
