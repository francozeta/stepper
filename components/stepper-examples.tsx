"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  Check,
  CreditCard,
  FileCheck,
  Globe2,
  Lock,
  Send,
  Server,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

function WorkflowRow({
  icon: Icon,
  title,
  description,
  status,
  tone = "default",
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  status: string;
  tone?: "default" | "success" | "warning";
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border [&>svg]:size-4 [&>svg]:shrink-0">
          <Icon />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-11 sm:pl-0">
        <Badge
          variant={
            tone === "warning"
              ? "destructive"
              : tone === "success"
                ? "secondary"
                : "outline"
          }
          className="font-mono"
        >
          {status}
        </Badge>
        {action}
      </div>
    </div>
  );
}

function StepperActions({
  note,
  nextDisabled,
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
  nextDisabled?: boolean;
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
        <StepperNext disabled={nextDisabled}>{nextLabel}</StepperNext>
      </div>
    </div>
  );
}

function StepperExample() {
  const [value, setValue] = React.useState("workspace");
  const [workspaceReady, setWorkspaceReady] = React.useState(false);
  const [preferencesReady, setPreferencesReady] = React.useState(false);
  const preferencesDisabled = !workspaceReady;
  const preferencesComplete = workspaceReady && preferencesReady;
  const inviteDisabled = !preferencesComplete;
  const currentStepHasBlocker =
    (value === "workspace" && !workspaceReady) ||
    (value === "preferences" && !preferencesReady);

  return (
    <Stepper value={value} onValueChange={setValue} orientation="horizontal">
      <StepperList>
        <DemoStep
          value="profile"
          title="Profile"
          description="Complete"
          icon={UserRound}
          completed
        />
        <DemoStep
          value="workspace"
          title="Workspace"
          description={workspaceReady ? "Ready" : "Needs slug"}
          icon={Building2}
          completed={workspaceReady}
          error={!workspaceReady}
        />
        <DemoStep
          value="preferences"
          title="Preferences"
          description={preferencesDisabled ? "Locked" : "Defaults"}
          icon={Settings2}
          completed={preferencesComplete}
          disabled={preferencesDisabled}
        />
        <DemoStep
          value="invite"
          title="Invite"
          description={inviteDisabled ? "Locked" : "Ready"}
          icon={Send}
          disabled={inviteDisabled}
        />
      </StepperList>

      <StepperContent value="profile">
        <ExampleContent
          eyebrow="Step 1"
          title="Profile details are already verified"
          description="The flow starts after the user has confirmed their identity, role, and recovery email."
          icon={UserRound}
        >
          <div className="divide-y divide-border/70">
            <WorkflowRow
              icon={ShieldCheck}
              title="Identity"
              description="Personal account verified with a recovery email."
              status="complete"
              tone="success"
            />
            <WorkflowRow
              icon={Bell}
              title="Notifications"
              description="Security and product updates are enabled."
              status="ready"
              tone="success"
            />
          </div>
        </ExampleContent>
      </StepperContent>

      <StepperContent value="workspace">
        <ExampleContent
          eyebrow="Step 2"
          title="Create the workspace"
          description="The next step stays locked until the workspace has a URL-safe slug."
          icon={Building2}
        >
          <div className="divide-y divide-border/70">
            <WorkflowRow
              icon={Server}
              title="Workspace name"
              description="Acme Design Systems"
              status="saved"
              tone="success"
            />
            <WorkflowRow
              icon={Globe2}
              title="Workspace slug"
              description={
                workspaceReady
                  ? "acme-design is available."
                  : "Missing slug. This blocks preferences and invites."
              }
              status={workspaceReady ? "available" : "required"}
              tone={workspaceReady ? "success" : "warning"}
              action={
                workspaceReady ? null : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setWorkspaceReady(true)}
                  >
                    <Sparkles data-icon="inline-start" />
                    Generate
                  </Button>
                )
              }
            />
          </div>
        </ExampleContent>
      </StepperContent>

      <StepperContent value="preferences">
        <ExampleContent
          eyebrow="Step 3"
          title="Set team defaults"
          description="Preferences become available only after the workspace can be routed."
          icon={Settings2}
        >
          <div className="divide-y divide-border/70">
            <WorkflowRow
              icon={ShieldCheck}
              title="Access policy"
              description="Require verified domains before joining."
              status={preferencesReady ? "saved" : "draft"}
              tone={preferencesReady ? "success" : "default"}
            />
            <WorkflowRow
              icon={Bell}
              title="Product updates"
              description="Send release notes to workspace admins."
              status={preferencesReady ? "saved" : "draft"}
              tone={preferencesReady ? "success" : "default"}
              action={
                preferencesReady ? null : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setPreferencesReady(true)}
                  >
                    <Check data-icon="inline-start" />
                    Save
                  </Button>
                )
              }
            />
          </div>
        </ExampleContent>
      </StepperContent>

      <StepperContent value="invite">
        <ExampleContent
          eyebrow="Step 4"
          title="Invite the first teammates"
          description="The final step summarizes what is ready before sending invitations."
          icon={Send}
        >
          <div className="divide-y divide-border/70">
            <WorkflowRow
              icon={Building2}
              title="Workspace"
              description="Acme Design Systems - acme-design"
              status="ready"
              tone="success"
            />
            <WorkflowRow
              icon={Users}
              title="Pending invites"
              description="3 teammates can be invited with admin defaults."
              status="queued"
            />
          </div>
        </ExampleContent>
      </StepperContent>

      <StepperActions
        note={
          currentStepHasBlocker
            ? "Fix the blocker in this step before continuing."
            : "The next step is available."
        }
        nextDisabled={currentStepHasBlocker}
        nextLabel={
          value === "invite" ? (
            <>
              Send invites
              <Send data-icon="inline-end" />
            </>
          ) : undefined
        }
      />
    </Stepper>
  );
}

function StepperCheckoutExample() {
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
  StepperCheckoutExample,
  StepperControlledExample,
  StepperExample,
  StepperStatusExample,
  StepperVerticalExample,
};
