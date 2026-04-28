import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DocsExample } from "@/components/docs-example";
import { CodeBlock, InfoGrid, PageHeader, Section } from "@/components/docs-content";
import { StepperExample } from "@/components/stepper-examples";
import { Button } from "@/components/ui/button";
import {
  packageNotes,
  quickFacts,
  usageSnippet,
  worksWith,
  workspaceExampleCode,
} from "@/lib/docs";

export default function Home() {
  return (
    <>
      <PageHeader
        eyebrow="components/ui"
        title="Stepper"
        description="A lightweight primitive for guided multi-step flows in React, Next.js, Tailwind CSS, and shadcn/ui-style projects."
        badge="v0.1.0"
      />

      <Section
        title="Preview"
        description="A real workspace setup flow where the Stepper blocks progress, marks errors, and unlocks later steps as requirements are completed."
      >
        <DocsExample
          title="Create workspace"
          description="The active step has a missing slug, preferences are locked, and invites only unlock after defaults are saved."
          badge="Product flow"
          code={workspaceExampleCode}
          filename="workspace-setup.tsx"
          preview={<StepperExample />}
        />
      </Section>

      <Section
        title="Usage"
        description="Copy the primitive, import the pieces you need, then connect validation in your app layer."
      >
        <CodeBlock code={usageSnippet} filename="import.tsx" />
        <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
          The main demo uses react-hook-form and zod for validation. The
          Stepper primitive does not depend on either library.
        </p>
      </Section>

      <Section
        title="Works with"
        description="The core stays agnostic while examples show common production integrations."
      >
        <InfoGrid items={worksWith} />
      </Section>

      <InfoGrid items={packageNotes} />

      <Section
        title="Install shape"
        description="The primitive stays copy-paste friendly. Product examples live outside the core component."
      >
        <CodeBlock filename="project tree" lang="text">{`components/
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

      <Button asChild size="lg" className="w-fit">
        <Link href="/getting-started">
          Getting Started
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </>
  );
}
