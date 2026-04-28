import type { Metadata } from "next";

import { CodeBlock, PageHeader, Section } from "@/components/docs-content";

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
      />

      <Section title="Add the component">
        <CodeBlock>{`components/
  ui/
    stepper.tsx`}</CodeBlock>
      </Section>

      <Section
        title="Use it uncontrolled"
        description="Use defaultValue when the Stepper can own its active step."
      >
        <CodeBlock>{`import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
} from "@/components/ui/stepper";

export function CheckoutStepper() {
  return (
    <Stepper defaultValue="account">
      <StepperList>
        <StepperItem value="account" completed>
          Account
        </StepperItem>
        <StepperItem value="profile">Profile</StepperItem>
        <StepperItem value="payment" disabled>
          Payment
        </StepperItem>
      </StepperList>

      <StepperContent value="account">Account content</StepperContent>
      <StepperContent value="profile">Profile content</StepperContent>
      <StepperContent value="payment">Payment content</StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        <StepperNext />
      </div>
    </Stepper>
  );
}`}</CodeBlock>
      </Section>

      <Section
        title="Use it controlled"
        description="Pass value and onValueChange when app state, validation, or routing decides the current step."
      >
        <CodeBlock>{`const [step, setStep] = React.useState("details");

<Stepper value={step} onValueChange={setStep}>
  <StepperList>
    <StepperItem value="details">Details</StepperItem>
    <StepperItem value="review">Review</StepperItem>
    <StepperItem value="confirm">Confirm</StepperItem>
  </StepperList>

  <StepperContent value="details">Collect details.</StepperContent>
  <StepperContent value="review">Review the request.</StepperContent>
  <StepperContent value="confirm">Confirm the flow.</StepperContent>
</Stepper>;`}</CodeBlock>
      </Section>
    </>
  );
}
