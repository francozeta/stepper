import type { Metadata } from "next";

import { PageHeader } from "@/components/docs-content";
import {
  StepperControlledExample,
  StepperExample,
  StepperStatusExample,
  StepperVerticalExample,
} from "@/components/stepper-examples";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Examples",
};

const examples = [
  {
    title: "Checkout flow",
    description:
      "Guide customers through cart review, shipping details, and payment.",
    badge: "Horizontal",
    component: <StepperExample />,
  },
  {
    title: "Workspace onboarding",
    description:
      "Use a vertical layout when each step needs more context and scanning.",
    badge: "Vertical",
    component: <StepperVerticalExample />,
  },
  {
    title: "Blocked checkout",
    description:
      "Show validation problems, completed progress, and steps that are not available yet.",
    badge: "States",
    component: <StepperStatusExample />,
  },
  {
    title: "Controlled review",
    description:
      "Drive the active step from React state when the flow depends on app logic.",
    badge: "Controlled",
    component: <StepperControlledExample />,
  },
];

export default function ExamplesPage() {
  return (
    <>
      <PageHeader
        eyebrow="api"
        title="Examples"
        description="Realistic Stepper demos for checkout, onboarding, validation states, and controlled React state."
      />

      <div className="flex flex-col gap-6">
        {examples.map((example) => (
          <Card key={example.title} className="shadow-sm">
            <CardHeader>
              <CardTitle>{example.title}</CardTitle>
              <CardDescription className="max-w-xl text-pretty leading-6">
                {example.description}
              </CardDescription>
              <CardAction>
                <Badge variant="secondary" className="w-fit">
                  {example.badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>{example.component}</CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
