"use client";

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

const steps = [
  {
    value: "account",
    title: "Account",
    description: "Create the customer profile.",
    content:
      "Capture identity, contact, and workspace preferences before the order can move forward.",
    details: [
      "Email verified",
      "Company profile saved",
      "Default currency selected",
    ],
  },
  {
    value: "shipping",
    title: "Shipping",
    description: "Confirm destination and delivery.",
    content:
      "Validate the delivery address and choose a shipment window that matches the customer's plan.",
    details: [
      "Address confirmed",
      "Delivery window selected",
      "Recipient phone added",
    ],
  },
  {
    value: "payment",
    title: "Payment",
    description: "Review billing details.",
    content:
      "Check the payment method, invoice contact, and order summary before confirmation.",
    details: ["Card ready", "Tax details reviewed", "Receipt email queued"],
  },
];

export default function StepperDemo() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Checkout flow
            </p>
            <h2 className="text-xl font-semibold">Guided checkout</h2>
          </div>
          <div className="w-fit rounded-md border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            3 steps
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          A styled Stepper block that installs the source primitive locally and
          stays ready for product flows.
        </p>
      </div>

      <Stepper defaultValue="account" className="gap-5">
        <StepperList aria-label="Checkout steps" className="gap-3">
          {steps.map((step, index) => (
            <StepperItem
              key={step.value}
              value={step.value}
              completed={index < 1}
              className="min-w-40 flex-1 sm:min-w-0"
            >
              <StepperTrigger className="w-full flex-row items-start gap-3 rounded-lg border border-transparent p-2 text-left data-[state=active]:border-border data-[state=active]:bg-muted/60">
                <StepperIndicator />
                <span className="flex min-w-0 flex-col gap-1">
                  <StepperLabel className="max-w-none">
                    {step.title}
                  </StepperLabel>
                  <StepperDescription className="hidden sm:block">
                    {step.description}
                  </StepperDescription>
                </span>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
          ))}
        </StepperList>

        {steps.map((step) => (
          <StepperContent
            key={step.value}
            value={step.value}
            className="overflow-hidden p-0"
          >
            <div className="grid md:grid-cols-[minmax(0,1fr)_15rem]">
              <div className="flex flex-col gap-3 p-4 sm:p-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.content}
                  </p>
                </div>
                <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
                  Use the step labels or the navigation controls to move through
                  the flow.
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t bg-muted/40 p-4 md:border-l md:border-t-0">
                <p className="text-sm font-medium">Readiness</p>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StepperContent>
        ))}

        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-sm text-muted-foreground sm:block">
            Source is copied to your app, so the demo imports from
            <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
              @/components/ui/stepper
            </code>
            .
          </p>
          <div className="flex gap-2">
            <StepperPrevious>Back</StepperPrevious>
            <StepperNext>Continue</StepperNext>
          </div>
        </div>
      </Stepper>
    </div>
  );
}
