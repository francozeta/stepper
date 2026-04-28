import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CodeBlock, InfoGrid, PageHeader, Section } from "@/components/docs-content";
import { StepperExample } from "@/components/stepper-examples";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { packageNotes, quickFacts, v2Roadmap } from "@/lib/docs";

export default function Home() {
  return (
    <>
      <PageHeader
        eyebrow="components/ui"
        title="Stepper"
        description="A lightweight primitive for guided multi-step flows in React, Next.js, Tailwind CSS, and shadcn/ui-style projects."
        badge="v0.1.0"
      />

      <InfoGrid items={packageNotes} />

      <Section
        title="Preview"
        description="The first screen is now the component experience, with docs navigation wrapped around it."
      >
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Checkout flow</CardTitle>
            <CardDescription className="max-w-xl text-pretty leading-6">
              A realistic horizontal Stepper with completed, active, and disabled states.
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">Horizontal</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <StepperExample />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Install shape"
        description="The reusable primitive lives in one shadcn-style file. Demo code stays outside the core."
      >
        <CodeBlock>{`components/
  stepper-examples.tsx
  ui/
    stepper.tsx`}</CodeBlock>
      </Section>

      <Section title="V1 scope">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickFacts.map((fact) => (
            <div
              key={fact}
              className="rounded-lg border border-border bg-muted/25 p-4 text-sm font-medium text-foreground"
            >
              {fact}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Next direction"
        description="The primitive is ready for docs. The next version can become more composable without making V1 heavier."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {v2Roadmap.map((item) => (
            <Card key={item.title} size="sm">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Link
        href="/getting-started"
        className="inline-flex min-h-10 w-fit items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,box-shadow,transform] hover:bg-primary/90 active:scale-[0.96] focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
      >
        Getting Started
        <ArrowRight className="size-4" />
      </Link>
    </>
  );
}
