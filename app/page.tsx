import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DocsExample } from "@/components/docs-example";
import {
  CodeBlock,
  InfoGrid,
  PageHeader,
  Section,
} from "@/components/docs-content";
import { StepperExample } from "@/components/stepper-examples";
import { Button } from "@/components/ui/button";
import {
  npmInstallSnippet,
  packageStylesImportSnippet,
  packageUsageSnippet,
  pnpmInstallSnippet,
  workspaceExampleCode,
  whyStepper,
} from "@/lib/docs";

export default function Home() {
  return (
    <>
      <PageHeader
        eyebrow="components/ui"
        title="Stepper"
        description="A lightweight primitive for guided multi-step flows in React, Next.js, Tailwind CSS, and shadcn/ui-style projects."
        badge="v0.1.5"
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
        title="Install"
        description="Use the npm package for normal dependency management, or copy the registry file when you want full source ownership."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock code={pnpmInstallSnippet} filename="pnpm" lang="bash" />
          <CodeBlock code={npmInstallSnippet} filename="npm" lang="bash" />
        </div>
        <CodeBlock
          code={packageStylesImportSnippet}
          filename="app/globals.css"
          lang="css"
        />
      </Section>

      <Section
        title="Usage"
        description="Import the pieces you need, then connect validation and routing in your app layer."
      >
        <CodeBlock code={packageUsageSnippet} filename="import.tsx" />
        <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
          Direct npm usage works with the package stylesheet. The registry path
          is still available when you want full source ownership.
        </p>
      </Section>

      <Section
        title="Why another Stepper?"
        description="Most stepper libraries focus on workflow state. This primitive focuses on shadcn-style composition, UI states, and copy-paste ownership."
      >
        <InfoGrid items={whyStepper} />
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
