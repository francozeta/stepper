import type { Metadata } from "next";

import { CodeBlock, PageHeader, Section } from "@/components/docs-content";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Styling",
};

const tokens = [
  "background",
  "foreground",
  "border",
  "muted",
  "muted-foreground",
  "primary",
  "primary-foreground",
  "destructive",
  "destructive-foreground",
  "ring",
];

export default function StylingPage() {
  return (
    <>
      <PageHeader
        eyebrow="guides"
        title="Styling"
        description="The Stepper uses shadcn/ui theme tokens and data attributes so users can restyle it without changing the logic."
      />

      <Section
        title="Theme tokens"
        description="The core avoids one-off color values and leans on semantic Tailwind tokens."
      >
        <div className="flex flex-wrap gap-2">
          {tokens.map((token) => (
            <Badge key={token} variant="outline" className="font-mono">
              {token}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="State selectors">
        <CodeBlock>{`[data-slot="stepper-item"][data-state="active"]
[data-slot="stepper-item"][data-state="completed"]
[data-slot="stepper-item"][data-state="disabled"]
[data-slot="stepper-item"][data-state="error"]

[data-slot="stepper-content"][data-state="active"]
[data-slot="stepper-content"][data-state="inactive"]`}</CodeBlock>
      </Section>

      <Section
        title="Customize by composition"
        description="For V1, icons, labels, and descriptions are composed inside the trigger instead of being encoded as variants."
      >
        <Card>
          <CardHeader>
            <CardTitle>Indicator slot</CardTitle>
            <CardDescription>
              Pass custom children to StepperIndicator for lucide icons, numbers, or status marks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock className="border-0 bg-transparent p-0 shadow-none">{`<StepperIndicator>
  <Check />
</StepperIndicator>`}</CodeBlock>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
