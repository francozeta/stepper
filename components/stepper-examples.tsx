"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  FileCheck,
  Lock,
  ShoppingCart,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

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

type ExampleContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
};

function ExampleContent({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: ExampleContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0">
            <Icon />
          </span>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
          <h3 className="text-balance text-sm font-medium text-foreground">
            {title}
          </h3>
          <p className="text-pretty text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

type DemoStepProps = {
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
};

function DemoStep({
  value,
  title,
  description,
  icon: Icon,
  completed,
  disabled,
  error,
}: DemoStepProps) {
  return (
    <StepperItem
      value={value}
      completed={completed}
      disabled={disabled}
      error={error}
    >
      <StepperTrigger>
        <StepperIndicator>
          {error ? (
            <AlertCircle />
          ) : disabled ? (
            <Lock />
          ) : completed ? (
            <Check />
          ) : (
            <Icon />
          )}
        </StepperIndicator>
        <span className="flex min-w-0 flex-col gap-1">
          <StepperLabel>{title}</StepperLabel>
          <StepperDescription className="hidden max-w-32 sm:block">
            {description}
          </StepperDescription>
        </span>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>
  );
}

type SummaryItem = {
  label: string;
  value: string;
  help?: string;
};

function SummaryGrid({ items }: { items: SummaryItem[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md border border-border bg-background p-3"
        >
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {item.value}
          </dd>
          {item.help ? (
            <dd className="mt-1 text-xs text-muted-foreground">{item.help}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

function StepperActions({
  note,
  previousLabel = (
    <>
      <ArrowLeft data-icon="inline-start" />
      Back
    </>
  ),
  nextLabel = (
    <>
      Continue
      <ArrowRight data-icon="inline-end" />
    </>
  ),
}: {
  note?: React.ReactNode;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      {note ? (
        <p className="text-sm text-muted-foreground">{note}</p>
      ) : (
        <span />
      )}
      <div className="flex gap-2 sm:justify-end">
        <StepperPrevious>{previousLabel}</StepperPrevious>
        <StepperNext>{nextLabel}</StepperNext>
      </div>
    </div>
  );
}

function StepperExample() {
  return (
    <Stepper defaultValue="shipping" orientation="horizontal">
      <StepperList>
        <DemoStep
          value="cart"
          title="Cart"
          description="Review items"
          icon={ShoppingCart}
          completed
        />
        <DemoStep
          value="shipping"
          title="Shipping"
          description="Delivery details"
          icon={Truck}
        />
        <DemoStep
          value="payment"
          title="Payment"
          description="Locked"
          icon={CreditCard}
          disabled
        />
      </StepperList>

      <StepperContent value="cart">
        <ExampleContent
          eyebrow="Cart"
          title="Review selected products"
          description="Confirm the items in the order before choosing how they should be delivered."
          icon={ShoppingCart}
        >
          <SummaryGrid
            items={[
              { label: "Items", value: "3 products", help: "Ready to ship" },
              { label: "Subtotal", value: "$128.00", help: "Before tax" },
              { label: "Discount", value: "-$12.00", help: "Spring offer" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="shipping">
        <ExampleContent
          eyebrow="Shipping"
          title="Confirm delivery details"
          description="A horizontal stepper works well when users move through a short linear checkout."
          icon={Truck}
        >
          <SummaryGrid
            items={[
              { label: "Recipient", value: "Avery Stone", help: "Primary" },
              { label: "Method", value: "Express", help: "2 business days" },
              { label: "Address", value: "Missing ZIP", help: "Required" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="payment">
        <ExampleContent
          eyebrow="Payment"
          title="Choose a payment method"
          description="This step stays disabled until the required shipping details are complete."
          icon={CreditCard}
        />
      </StepperContent>

      <StepperActions note="Payment unlocks after the shipping address is complete." />
    </Stepper>
  );
}

function StepperVerticalExample() {
  return (
    <Stepper defaultValue="workspace" orientation="vertical">
      <StepperList>
        <DemoStep
          value="profile"
          title="Profile"
          description="Identity"
          icon={UserRound}
          completed
        />
        <DemoStep
          value="workspace"
          title="Workspace"
          description="Team defaults"
          icon={Building2}
        />
        <DemoStep
          value="invite"
          title="Invite team"
          description="Locked"
          icon={Users}
          disabled
        />
      </StepperList>

      <StepperContent value="profile">
        <ExampleContent
          eyebrow="Profile"
          title="Personal details are ready"
          description="The user has already added their name, role, and notification preferences."
          icon={UserRound}
        />
      </StepperContent>
      <StepperContent value="workspace">
        <ExampleContent
          eyebrow="Workspace"
          title="Set team defaults"
          description="Vertical orientation gives each step room to carry extra explanation without compressing the labels."
          icon={Building2}
        >
          <SummaryGrid
            items={[
              { label: "Plan", value: "Team", help: "14-day trial" },
              { label: "Region", value: "US East", help: "Lowest latency" },
              { label: "Seats", value: "8 seats", help: "2 unused" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="invite">
        <ExampleContent
          eyebrow="Invites"
          title="Invite teammates"
          description="Invitations become available once the workspace defaults have been saved."
          icon={Users}
        />
      </StepperContent>

      <StepperActions note="Invite controls stay disabled until the workspace setup is complete." />
    </Stepper>
  );
}

function StepperStatusExample() {
  return (
    <Stepper defaultValue="shipping" orientation="horizontal">
      <StepperList>
        <DemoStep
          value="account"
          title="Account"
          description="Complete"
          icon={UserRound}
          completed
        />
        <DemoStep
          value="shipping"
          title="Shipping"
          description="Needs ZIP"
          icon={Truck}
          error
        />
        <DemoStep
          value="payment"
          title="Payment"
          description="Locked"
          icon={CreditCard}
          disabled
        />
      </StepperList>

      <StepperContent value="account" forceMount>
        <ExampleContent
          eyebrow="Account"
          title="Account details are complete"
          description="Completed steps keep their primary color so users can see how far they got."
          icon={Check}
        />
      </StepperContent>
      <StepperContent value="shipping" forceMount>
        <ExampleContent
          eyebrow="Needs attention"
          title="Shipping address is missing a postal code"
          description="Error state highlights the current blocker while keeping the next step disabled."
          icon={AlertCircle}
        >
          <div className="rounded-md border border-destructive/30 bg-background p-3 text-sm text-destructive">
            Add a postal code to unlock payment.
          </div>
        </ExampleContent>
      </StepperContent>
      <StepperContent value="payment" forceMount>
        <ExampleContent
          eyebrow="Payment"
          title="Payment is locked"
          description="Disabled steps use a real disabled button and cannot be selected."
          icon={Lock}
        />
      </StepperContent>

      <StepperActions note="The next action is unavailable until the error is resolved." />
    </Stepper>
  );
}

function StepperControlledExample() {
  const steps = ["details", "review", "confirm"];
  const [value, setValue] = React.useState("details");
  const currentIndex = steps.indexOf(value);

  return (
    <Stepper value={value} onValueChange={setValue} orientation="horizontal">
      <StepperList>
        <DemoStep
          value="details"
          title="Details"
          description="Collect"
          icon={FileCheck}
          completed={currentIndex > 0}
        />
        <DemoStep
          value="review"
          title="Review"
          description="Check"
          icon={AlertCircle}
          completed={currentIndex > 1}
        />
        <DemoStep
          value="confirm"
          title="Confirm"
          description="Submit"
          icon={Check}
        />
      </StepperList>

      <StepperContent value="details">
        <ExampleContent
          eyebrow="Details"
          title="Collect request details"
          description="Controlled steppers let the application decide when a user can move to the next step."
          icon={FileCheck}
        >
          <SummaryGrid
            items={[
              { label: "Owner", value: "Finance", help: "Assigned" },
              { label: "Budget", value: "$4,800", help: "Estimated" },
              { label: "Due date", value: "May 12", help: "Flexible" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="review">
        <ExampleContent
          eyebrow="Review"
          title="Check the request"
          description="The active value is stored in React state and passed back through onValueChange."
          icon={AlertCircle}
        />
      </StepperContent>
      <StepperContent value="confirm">
        <ExampleContent
          eyebrow="Confirm"
          title="Submit the request"
          description="Use a controlled Stepper when validation, routing, or persistence lives outside the component."
          icon={Check}
        />
      </StepperContent>

      <StepperActions
        note={
          <span>
            Step{" "}
            <span className="tabular-nums">
              {currentIndex + 1} of {steps.length}
            </span>
            : {value}
          </span>
        }
        nextLabel={
          value === "confirm" ? (
            <>
              Finish
              <Check data-icon="inline-end" />
            </>
          ) : undefined
        }
      />
    </Stepper>
  );
}

export {
  StepperControlledExample,
  StepperExample,
  StepperStatusExample,
  StepperVerticalExample,
};
