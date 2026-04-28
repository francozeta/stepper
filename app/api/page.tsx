import type { Metadata } from "next";

import { CodeBlock, PageHeader, Section } from "@/components/docs-content";
import { PropsTable } from "@/components/props-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  apiComponents,
  compositionCode,
  contentProps,
  itemProps,
  rootProps,
  triggerProps,
} from "@/lib/docs";

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
        <PropsTable rows={rootProps} />
      </Section>

      <Section title="Item props">
        <PropsTable rows={itemProps} />
      </Section>

      <Section title="Trigger props">
        <PropsTable rows={triggerProps} />
      </Section>

      <Section title="Content props">
        <PropsTable rows={contentProps} />
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
        <CodeBlock
          code={compositionCode}
          filename="composable-trigger.tsx"
        />
      </Section>
    </>
  );
}
