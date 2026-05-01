"use client";

import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
} from "@/components/ui/stepper";

const steps = [
  {
    value: "account",
    title: "Account",
    description: "Create your workspace account.",
  },
  {
    value: "profile",
    title: "Profile",
    description: "Add the details your team will see.",
  },
  {
    value: "review",
    title: "Review",
    description: "Confirm the setup before continuing.",
  },
];

export default function StepperDemo() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-xl border bg-background p-6 text-foreground shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Workspace setup
        </h2>
        <p className="text-sm text-muted-foreground">
          A compact Stepper demo that previews cleanly in v0 and installs the
          source primitive locally.
        </p>
      </div>

      <Stepper defaultValue="account">
        <StepperList>
          {steps.map((step, index) => (
            <StepperItem
              key={step.value}
              value={step.value}
              completed={index === 0}
              disabled={index === 2}
            >
              {step.title}
            </StepperItem>
          ))}
        </StepperList>

        {steps.map((step) => (
          <StepperContent key={step.value} value={step.value}>
            <div className="space-y-1">
              <h3 className="text-sm font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </StepperContent>
        ))}

        <div className="mt-6 flex justify-between">
          <StepperPrevious />
          <StepperNext />
        </div>
      </Stepper>
    </div>
  );
}
