import type { Metadata } from "next";

import { CopyButton } from "@/components/copy-button";
import { CodeBlock, PageHeader, Section } from "@/components/docs-content";
import {
  controlledSnippet,
  gettingStartedSnippet,
  npmInstallSnippet,
  pnpmInstallSnippet,
  tailwindV4SourceSnippet,
} from "@/lib/docs";

export const metadata: Metadata = {
  title: "Getting Started",
};

export default function GettingStartedPage() {
  return (
    <>
      <PageHeader
        eyebrow="basics"
        title="Getting Started"
        description="Copy the Stepper primitive into a shadcn/ui-style project and compose it with your own labels, icons, and content."
        action={
          <CopyButton
            value='import { Stepper } from "@/components/ui/stepper";'
            label="Copy import"
            toastMessage="Import copied"
          />
        }
      />

      <Section
        title="Install package"
        description="Use this path when you want Stepper as a normal npm dependency."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock code={pnpmInstallSnippet} filename="pnpm" lang="bash" />
          <CodeBlock code={npmInstallSnippet} filename="npm" lang="bash" />
        </div>
        <CodeBlock
          code={tailwindV4SourceSnippet}
          filename="app/globals.css"
          lang="css"
        />
      </Section>

      <Section
        title="Copy the component"
        description="Use the registry or copy-paste source path when you want to own the component file."
      >
        <CodeBlock filename="project tree" lang="text">{`components/
  ui/
    stepper.tsx`}</CodeBlock>
      </Section>

      <Section
        title="Use it uncontrolled"
        description="Use defaultValue when the Stepper can own its active step."
      >
        <CodeBlock code={gettingStartedSnippet} filename="checkout-stepper.tsx" />
      </Section>

      <Section
        title="Use it controlled"
        description="Pass value and onValueChange when app state, validation, or routing decides the current step."
      >
        <CodeBlock code={controlledSnippet} filename="controlled-usage.tsx" />
      </Section>
    </>
  );
}
