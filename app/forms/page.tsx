import type { Metadata } from "next";

import { CodeBlock, InfoGrid, PageHeader, Section } from "@/components/docs-content";
import { formWizardGuideSnippet } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Form Wizard",
};

const boundaries = [
  {
    label: "Stepper",
    value: "UI state",
    help: "Owns active step, disabled steps, completed states, and content panels.",
  },
  {
    label: "react-hook-form",
    value: "Field state",
    help: "Owns values, focus, touched state, and validation triggers.",
  },
  {
    label: "zod",
    value: "Rules",
    help: "Defines schema constraints without becoming a Stepper dependency.",
  },
];

const validationFlow = [
  {
    label: "Validate",
    value: "trigger(fields)",
    help: "Validate only the fields that belong to the active step.",
  },
  {
    label: "Reflect",
    value: "error/completed",
    help: "Map validation result onto StepperItem state props.",
  },
  {
    label: "Advance",
    value: "setValue",
    help: "Move to the next step only after the app layer accepts the data.",
  },
];

export default function FormsPage() {
  return (
    <>
      <PageHeader
        eyebrow="guides"
        title="Using Stepper with react-hook-form"
        description="The Stepper primitive does not depend on react-hook-form or zod. It coordinates the UI around form state owned by your app."
      />

      <Section
        title="Primitive boundary"
        description="Stepper does not own your form state. It coordinates the UI around it."
      >
        <InfoGrid items={boundaries} />
      </Section>

      <Section
        title="Validation flow"
        description="Keep validation decisions in the form layer, then pass the result back to Stepper props."
      >
        <InfoGrid items={validationFlow} />
      </Section>

      <Section
        title="Full example"
        description="This is the shape used by the product demo: validate the active step, mark it completed, then unlock the next step."
      >
        <CodeBlock
          code={formWizardGuideSnippet}
          filename="form-wizard.tsx"
        />
      </Section>
    </>
  );
}
