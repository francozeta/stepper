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
import { InstallCommand } from "@/components/install-command";
import { Button } from "@/components/ui/button";
import {
  packageStylesImportSnippet,
  packageUsageSnippet,
  packageVersion,
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
        badge={`v${packageVersion}`}
      />

      <Section
        title="Install"
        description="Install the package, import its stylesheet once, then compose the primitive with your own UI."
      >
        <InstallCommand />
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock
            code={packageStylesImportSnippet}
            filename="app/globals.css"
            lang="css"
            showLineNumbers={false}
            compact
          />
          <CodeBlock
            code={packageUsageSnippet}
            filename="app/page.tsx"
            lang="tsx"
            showLineNumbers={false}
            compact
          />
        </div>
      </Section>

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
        title="Why another Stepper?"
        description="Most stepper libraries focus on workflow state. This primitive focuses on shadcn-style composition, UI states, and copy-paste ownership."
      >
        <InfoGrid items={whyStepper} />
      </Section>

      <Button asChild size="lg" className="w-fit">
        <Link href="/patterns">
          View recipes
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </>
  );
}
