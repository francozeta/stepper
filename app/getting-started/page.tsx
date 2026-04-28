import type { Metadata } from "next";

import { CopyButton } from "@/components/copy-button";
import { CodeBlock, PageHeader, Section } from "@/components/docs-content";
import { controlledSnippet, gettingStartedSnippet } from "@/lib/docs";

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

      <Section title="Add the component">
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
