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
import { apiComponents } from "@/lib/docs";

export const metadata: Metadata = {
  title: "API",
};

export default function ApiPage() {
  return (
    <>
      <PageHeader
        eyebrow="api"
        title="Stepper API"
        description="The V1 API keeps the surface small: one root, one ordered list, item primitives, content panels, and previous/next helpers."
      />

      <Section title="Root props">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Prop</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["value", "string", "Controlled active step value."],
                ["defaultValue", "string", "Initial active step for uncontrolled usage."],
                ["onValueChange", "(value: string) => void", "Called when a step changes."],
                ["orientation", '"horizontal" | "vertical"', 'Layout direction. Defaults to "horizontal".'],
              ].map(([prop, type, description]) => (
                <tr key={prop}>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {prop}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {type}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Primitive parts"
        description="Each part exposes data-slot and data-state attributes for predictable styling."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {apiComponents.map((component) => (
            <Card key={component.name} size="sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle>{component.name}</CardTitle>
                    <CardDescription>{component.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {component.element}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Composable trigger">
        <Card>
          <CardContent>
            <CodeBlock className="border-0 bg-transparent p-0 shadow-none">{`<StepperItem value="shipping">
  <StepperTrigger>
    <StepperIndicator />
    <span className="flex flex-col gap-1">
      <StepperLabel>Shipping</StepperLabel>
      <StepperDescription>Delivery address</StepperDescription>
    </span>
  </StepperTrigger>
  <StepperSeparator />
</StepperItem>`}</CodeBlock>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
