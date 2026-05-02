"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Menu,
  Mail,
  Route,
  Send,
  Server,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { z } from "zod/v3";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  StepperTrigger,
} from "@/components/ui/stepper";

const workspaceStepSchema = z.object({
  workspaceName: z.string().trim().min(2, "Enter a workspace name."),
  workspaceSlug: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens."
    ),
});

const preferencesStepSchema = z.object({
  region: z.enum(["iad1", "fra1", "sin1"]),
  visibility: z.enum(["private", "team"]),
});

const membersStepSchema = z.object({
  inviteEmail: z
    .string()
    .trim()
    .email("Enter a valid email.")
    .or(z.literal("")),
});

const workspaceWizardSchema = workspaceStepSchema
  .extend(preferencesStepSchema.shape)
  .extend(membersStepSchema.shape);

type WorkspaceWizardValues = z.infer<typeof workspaceWizardSchema>;

const wizardSteps = ["workspace", "preferences", "members", "review"] as const;
type WizardStep = (typeof wizardSteps)[number];

const wizardStepFields: Record<
  WizardStep,
  FieldPath<WorkspaceWizardValues>[]
> = {
  workspace: ["workspaceName", "workspaceSlug"],
  preferences: ["region", "visibility"],
  members: ["inviteEmail"],
  review: [],
};

function validateWizardStep(step: WizardStep, values: WorkspaceWizardValues) {
  if (step === "workspace") {
    return workspaceStepSchema.safeParse(values);
  }

  if (step === "preferences") {
    return preferencesStepSchema.safeParse(values);
  }

  if (step === "members") {
    return membersStepSchema.safeParse(values);
  }

  return workspaceWizardSchema.safeParse(values);
}

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

function WizardField({
  id,
  label,
  description,
  error,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const invalid = Boolean(error);

  return (
    <Field data-invalid={invalid ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {error ? (
        <FieldError>{error}</FieldError>
      ) : description ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}
    </Field>
  );
}

function StepperActions({
  note,
  nextDisabled,
  nextOnClick,
  nextAction,
  finalAction,
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
  nextOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  nextAction?: React.ReactNode;
  finalAction?: React.ReactNode;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      {note ? (
        <div className="min-w-0 text-sm text-muted-foreground">{note}</div>
      ) : (
        <span />
      )}
      <div className="flex gap-2 sm:justify-end">
        <StepperPrevious>{previousLabel}</StepperPrevious>
        {finalAction ??
          nextAction ?? (
          <StepperNext disabled={nextDisabled} onClick={nextOnClick}>
            {nextLabel}
          </StepperNext>
        )}
      </div>
    </div>
  );
}

function StepperExample() {
  const [value, setValue] = React.useState<WizardStep>("workspace");
  const valueRef = React.useRef<WizardStep>("workspace");
  const [completedSteps, setCompletedSteps] = React.useState<
    Partial<Record<WizardStep, boolean>>
  >({});
  const [attemptedSteps, setAttemptedSteps] = React.useState<
    Partial<Record<WizardStep, boolean>>
  >({});
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<FieldPath<WorkspaceWizardValues>, string>>
  >({});
  const [submitted, setSubmitted] = React.useState(false);
  const form = useForm<WorkspaceWizardValues>({
    resolver: zodResolver(workspaceWizardSchema),
    mode: "onChange",
    defaultValues: {
      workspaceName: "",
      workspaceSlug: "",
      region: "iad1",
      visibility: "private",
      inviteEmail: "",
    },
  });
  const watchedValues = useWatch({ control: form.control });
  const formValues = React.useMemo<WorkspaceWizardValues>(
    () => ({
      workspaceName: watchedValues.workspaceName ?? "",
      workspaceSlug: watchedValues.workspaceSlug ?? "",
      region: watchedValues.region ?? "iad1",
      visibility: watchedValues.visibility ?? "private",
      inviteEmail: watchedValues.inviteEmail ?? "",
    }),
    [
      watchedValues.inviteEmail,
      watchedValues.region,
      watchedValues.visibility,
      watchedValues.workspaceName,
      watchedValues.workspaceSlug,
    ]
  );
  const workspaceValid = workspaceStepSchema.safeParse(formValues).success;
  const preferencesValid = preferencesStepSchema.safeParse(formValues).success;
  const membersValid = membersStepSchema.safeParse(formValues).success;
  const workspaceCompleted = Boolean(completedSteps.workspace);
  const preferencesCompleted = Boolean(completedSteps.preferences);
  const membersCompleted = Boolean(completedSteps.members);
  const preferencesDisabled = !workspaceCompleted;
  const membersDisabled = !preferencesCompleted;
  const reviewDisabled = !membersCompleted;
  const currentFields = wizardStepFields[value];
  const currentStepHasErrors = currentFields.some((field) => fieldErrors[field]);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clearFieldError = React.useCallback(
    (field: FieldPath<WorkspaceWizardValues>) => {
      setFieldErrors((current) => {
        if (!current[field]) {
          return current;
        }

        const nextErrors = { ...current };

        delete nextErrors[field];

        return nextErrors;
      });
    },
    []
  );

  const handleNext = React.useCallback(async () => {
    const activeValue = valueRef.current;
    const activeFields = wizardStepFields[activeValue];
    const activeIndex = wizardSteps.indexOf(activeValue);
    const latestValues = { ...formValues, ...form.getValues() };

    setAttemptedSteps((current) => ({ ...current, [activeValue]: true }));

    setFieldErrors((current) => {
      const nextErrors = { ...current };

      activeFields.forEach((field) => {
        delete nextErrors[field];
      });

      return nextErrors;
    });

    const result = validateWizardStep(activeValue, latestValues);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const nextErrors: Partial<
        Record<FieldPath<WorkspaceWizardValues>, string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as FieldPath<WorkspaceWizardValues>;

        if (activeFields.includes(field) && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });

      setFieldErrors((current) => ({ ...current, ...nextErrors }));

      if (firstIssue) {
        const firstField =
          firstIssue.path[0] as FieldPath<WorkspaceWizardValues>;

        if (activeFields.includes(firstField)) {
          form.setFocus(firstField);
        }
      }

      return;
    }

    setCompletedSteps((current) => ({ ...current, [activeValue]: true }));

    const nextStep = wizardSteps[activeIndex + 1];

    if (nextStep) {
      setValue(nextStep);
    }
  }, [form, formValues]);

  const completeReview = React.useCallback(async () => {
    const latestValues = { ...formValues, ...form.getValues() };
    const result = workspaceWizardSchema.safeParse(latestValues);

    if (!result.success) {
      return;
    }

    setSubmitted(true);
  }, [form, formValues]);

  return (
    <Stepper
      value={value}
      onValueChange={(nextValue) => setValue(nextValue as WizardStep)}
      orientation="horizontal"
    >
      <StepperList>
        <DemoStep
          value="workspace"
          title="Workspace"
          description={workspaceCompleted ? "Ready" : "Required"}
          icon={Building2}
          completed={workspaceCompleted}
          error={Boolean(attemptedSteps.workspace && !workspaceValid)}
        />
        <DemoStep
          value="preferences"
          title="Preferences"
          description={preferencesDisabled ? "Locked" : "Defaults"}
          icon={Settings2}
          completed={preferencesCompleted}
          disabled={preferencesDisabled}
          error={Boolean(attemptedSteps.preferences && !preferencesValid)}
        />
        <DemoStep
          value="members"
          title="Members"
          description={membersDisabled ? "Locked" : "Optional"}
          icon={Users}
          completed={membersCompleted}
          disabled={membersDisabled}
          error={Boolean(attemptedSteps.members && !membersValid)}
        />
        <DemoStep
          value="review"
          title="Review"
          description={reviewDisabled ? "Locked" : "Summary"}
          icon={Send}
          disabled={reviewDisabled}
        />
      </StepperList>

      <StepperContent value="workspace">
        <ExampleContent
          eyebrow="Step 1"
          title="Create the workspace"
          description="Collect the two values the app needs before it can route a new workspace."
          icon={Building2}
        >
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <WizardField
              id="workspace-name"
              label="Workspace name"
              error={fieldErrors.workspaceName}
            >
              <Input
                id="workspace-name"
                placeholder="Acme Design Systems"
                autoComplete="organization"
                aria-invalid={Boolean(fieldErrors.workspaceName)}
                onInput={() => clearFieldError("workspaceName")}
                {...form.register("workspaceName")}
              />
            </WizardField>
            <WizardField
              id="workspace-slug"
              label="Workspace slug"
              description="Used in URLs, for example /acme-design."
              error={fieldErrors.workspaceSlug}
            >
              <Input
                id="workspace-slug"
                placeholder="acme-design"
                autoCapitalize="none"
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.workspaceSlug)}
                onInput={() => clearFieldError("workspaceSlug")}
                {...form.register("workspaceSlug")}
              />
            </WizardField>
          </FieldGroup>
        </ExampleContent>
      </StepperContent>

      <StepperContent value="preferences">
        <ExampleContent
          eyebrow="Step 2"
          title="Choose team defaults"
          description="These preferences are not Stepper state. They belong to the form."
          icon={Settings2}
        >
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <WizardField
              id="workspace-region"
              label="Region"
              description="Pick the closest default region for new projects."
              error={fieldErrors.region}
            >
              <Select
                value={formValues.region}
                onValueChange={(nextRegion) => {
                  clearFieldError("region");
                  form.setValue(
                    "region",
                    nextRegion as WorkspaceWizardValues["region"],
                    {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    }
                  );
                }}
              >
                <SelectTrigger
                  id="workspace-region"
                  aria-invalid={Boolean(fieldErrors.region)}
                  className="w-full"
                >
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="iad1">US East - iad1</SelectItem>
                    <SelectItem value="fra1">Europe - fra1</SelectItem>
                    <SelectItem value="sin1">Asia Pacific - sin1</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </WizardField>
            <WizardField
              id="workspace-visibility"
              label="Visibility"
              description="Control who can discover the workspace."
              error={fieldErrors.visibility}
            >
              <Select
                value={formValues.visibility}
                onValueChange={(nextVisibility) => {
                  clearFieldError("visibility");
                  form.setValue(
                    "visibility",
                    nextVisibility as WorkspaceWizardValues["visibility"],
                    {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    }
                  );
                }}
              >
                <SelectTrigger
                  id="workspace-visibility"
                  aria-invalid={Boolean(fieldErrors.visibility)}
                  className="w-full"
                >
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team visible</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </WizardField>
          </FieldGroup>
        </ExampleContent>
      </StepperContent>

      <StepperContent value="members">
        <ExampleContent
          eyebrow="Step 3"
          title="Invite teammates"
          description="Invites are optional, but invalid email input still blocks the next step."
          icon={Users}
        >
          <div className="max-w-md">
            <WizardField
              id="invite-email"
              label="Invite email"
              description="Leave blank if you want to invite members later."
              error={fieldErrors.inviteEmail}
            >
              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@company.com"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.inviteEmail)}
                onInput={() => clearFieldError("inviteEmail")}
                {...form.register("inviteEmail")}
              />
            </WizardField>
          </div>
        </ExampleContent>
      </StepperContent>

      <StepperContent value="review">
        <ExampleContent
          eyebrow="Step 4"
          title="Review setup"
          description="The final step shows the data collected by the form before the flow finishes."
          icon={Send}
        >
          <div className="divide-y divide-border/70">
            <WorkflowRow
              icon={Server}
              title="Workspace"
              description={`${formValues.workspaceName || "Untitled"} - ${
                formValues.workspaceSlug || "missing-slug"
              }`}
              status="required"
            />
            <WorkflowRow
              icon={Globe2}
              title="Preferences"
              description={`${formValues.region.toUpperCase()} region, ${
                formValues.visibility === "private" ? "private" : "team visible"
              }`}
              status="saved"
              tone="success"
            />
            <WorkflowRow
              icon={Mail}
              title="Members"
              description={formValues.inviteEmail || "No invite yet"}
              status={formValues.inviteEmail ? "queued" : "skipped"}
              tone={formValues.inviteEmail ? "success" : "default"}
            />
            <WorkflowRow
              icon={submitted ? ShieldCheck : Bell}
              title={submitted ? "Workspace created" : "Ready to create"}
              description={
                submitted
                  ? "The form is valid and the wizard is complete."
                  : "Submit stays local in this demo."
              }
              status={submitted ? "done" : "draft"}
              tone={submitted ? "success" : "default"}
            />
          </div>
        </ExampleContent>
      </StepperContent>

      <StepperActions
        note={
          currentStepHasErrors ? (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle />
              <AlertTitle>Step needs attention</AlertTitle>
              <AlertDescription>
                Fix the highlighted fields before continuing.
              </AlertDescription>
            </Alert>
          ) : (
            "This example uses react-hook-form and zod. The Stepper core does not depend on them."
          )
        }
        nextAction={
          value !== "review" ? (
            <Button type="button" onClick={() => void handleNext()}>
              Continue
              <ArrowRight data-icon="inline-end" />
            </Button>
          ) : undefined
        }
        finalAction={
          value === "review" ? (
            <Button type="button" onClick={() => void completeReview()}>
              Create workspace
              <Check data-icon="inline-end" />
            </Button>
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
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Shipping needs attention</AlertTitle>
            <AlertDescription>
              Add a postal code to unlock payment.
            </AlertDescription>
          </Alert>
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

function StepperRoutePatternExample() {
  const [value, setValue] = React.useState("workspace");
  const steps = [
    {
      value: "workspace",
      title: "Workspace",
      href: "#route-workspace",
    },
    {
      value: "members",
      title: "Members",
      href: "#route-members",
    },
    {
      value: "review",
      title: "Review",
      href: "#route-review",
    },
  ];
  const currentIndex = steps.findIndex((step) => step.value === value);

  return (
    <Stepper value={value} onValueChange={setValue}>
      <StepperList>
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;

          return (
            <StepperItem
              key={step.value}
              value={step.value}
              completed={isCompleted}
            >
              <StepperTrigger asChild>
                <a href={step.href}>
                  <StepperIndicator>
                    {isCompleted ? <Check /> : <Route />}
                  </StepperIndicator>
                  <StepperLabel>{step.title}</StepperLabel>
                </a>
              </StepperTrigger>
            </StepperItem>
          );
        })}
      </StepperList>

      <StepperContent value={value} forceMount>
        <ExampleContent
          eyebrow="Route pattern"
          title={`Current route: /setup/${value}`}
          description="The preview uses hash links; the code tab derives the active step from the URL so route state stays the source of truth."
          icon={Route}
        />
      </StepperContent>
    </Stepper>
  );
}

function MobilePatternList() {
  return (
    <StepperList>
      <DemoStep
        value="workspace"
        title="Workspace"
        description="Ready"
        icon={Building2}
        completed
      />
      <DemoStep
        value="members"
        title="Members"
        description="Active"
        icon={Users}
      />
      <DemoStep
        value="review"
        title="Review"
        description="Locked"
        icon={Send}
        disabled
      />
    </StepperList>
  );
}

function StepperMobilePatternExample() {
  const [value, setValue] = React.useState("members");
  const stepNumber =
    value === "workspace" ? "1" : value === "members" ? "2" : "3";
  const contentIcon =
    value === "workspace" ? Building2 : value === "review" ? Send : Users;

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            Step {stepNumber} of 3: {value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep the step list in a Sheet without changing the primitive.
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Menu data-icon="inline-start" />
              Steps
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Setup steps</SheetTitle>
              <SheetDescription>
                Select a step from the compact mobile navigation.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
              <Stepper
                value={value}
                onValueChange={setValue}
                orientation="vertical"
              >
                <MobilePatternList />
              </Stepper>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-muted/25 p-4">
        <ExampleContent
          eyebrow="Mobile"
          title={
            value === "workspace"
              ? "Create workspace"
              : value === "review"
                ? "Review setup"
                : "Invite teammates"
          }
          description="The page owns the content while Stepper remains a reusable navigation primitive inside the drawer."
          icon={contentIcon}
        />
      </div>
    </div>
  );
}

const recipeSteps = [
  { value: "business", title: "Business", description: "Who you sell as" },
  { value: "product", title: "Product", description: "What you sell" },
  { value: "review", title: "Review", description: "Confirm setup" },
] as const;

type RecipeStep = (typeof recipeSteps)[number]["value"];

function StepperCircleProgressRecipeExample() {
  const [value, setValue] = React.useState<RecipeStep>("product");
  const currentIndex = recipeSteps.findIndex((step) => step.value === value);
  const progress = ((currentIndex + 1) / recipeSteps.length) * 100;
  const currentStep = recipeSteps[currentIndex] ?? recipeSteps[0];

  return (
    <Stepper
      value={value}
      onValueChange={(nextValue) => setValue(nextValue as RecipeStep)}
      className="mx-auto max-w-md gap-5"
    >
      <RecipeHiddenStepList currentIndex={currentIndex} />

      <div className="flex items-center gap-3">
        <AnimatedProgressRing
          value={progress}
          label={`${currentIndex + 1}`}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {currentStep.title}
          </p>
          <p className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {recipeSteps.length}
          </p>
        </div>
      </div>

      {recipeSteps.map((step) => (
        <StepperContent
          key={step.value}
          value={step.value}
          className="border-border/70 bg-background p-4 shadow-none"
        >
          <RecipePanel title={step.title} description={step.description} />
        </StepperContent>
      ))}

      <StepperActions note="Use this compact recipe when the full step list would take too much space." />
    </Stepper>
  );
}

function AnimatedProgressRing({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const size = 40;
  const strokeWidth = 2;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset =
    circumference - (normalizedValue / 100) * circumference;

  return (
    <span className="relative grid size-10 shrink-0 place-items-center rounded-full text-foreground">
      <svg
        role="progressbar"
        aria-label="Recipe progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(normalizedValue)}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 size-10 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted-foreground/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.24, ease: [0.2, 0, 0, 1] }
          }
        />
      </svg>
      <span className="grid size-8 place-items-center rounded-full bg-card text-xs font-semibold text-foreground ring-1 ring-border/70">
        {label}
      </span>
    </span>
  );
}

function StepperControlsOnlyRecipeExample() {
  const [value, setValue] = React.useState<RecipeStep>("business");
  const currentIndex = recipeSteps.findIndex((step) => step.value === value);
  const currentStep = recipeSteps[currentIndex] ?? recipeSteps[0];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < recipeSteps.length - 1;

  function goToIndex(nextIndex: number) {
    const nextStep = recipeSteps[nextIndex];

    if (nextStep) {
      setValue(nextStep.value);
    }
  }

  return (
    <Stepper
      value={value}
      onValueChange={(nextValue) => setValue(nextValue as RecipeStep)}
      className="mx-auto max-w-md gap-5 rounded-xl bg-background p-5 ring-1 ring-border/80"
    >
      <RecipeHiddenStepList currentIndex={currentIndex} />

      <StepperContent
        value={value}
        forceMount
        className="border-0 bg-transparent p-0 shadow-none"
      >
        <RecipePanel
          title={currentStep.title}
          description="The user only sees the active panel and actions. The list still exists for step registration and accessibility."
        />
      </StepperContent>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!canGoPrevious}
          onClick={() => goToIndex(currentIndex - 1)}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <Button
          type="button"
          disabled={!canGoNext}
          onClick={() => goToIndex(currentIndex + 1)}
        >
          {canGoNext ? "Next" : "Done"}
          {canGoNext ? <ArrowRight data-icon="inline-end" /> : <Check />}
        </Button>
      </div>
    </Stepper>
  );
}

function RecipeHiddenStepList({ currentIndex }: { currentIndex: number }) {
  return (
    <StepperList
      aria-label="Hidden recipe steps"
      className="sr-only !w-px !gap-0 !overflow-hidden !pb-0 data-[orientation=horizontal]:!w-px data-[orientation=horizontal]:!gap-0 data-[orientation=horizontal]:!overflow-hidden data-[orientation=horizontal]:!pb-0"
    >
      {recipeSteps.map((step, index) => (
        <StepperItem
          key={step.value}
          value={step.value}
          completed={index < currentIndex}
        >
          {step.title}
        </StepperItem>
      ))}
    </StepperList>
  );
}

function RecipePanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h3 className="text-balance text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-pretty text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" className="justify-start">
          Software / SaaS
        </Button>
        <Button type="button" variant="outline" className="justify-start">
          Digital product
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
        Keep the flow focused. Persist form state outside the primitive.
      </div>
    </div>
  );
}

export {
  StepperCheckoutExample,
  StepperControlledExample,
  StepperCircleProgressRecipeExample,
  StepperControlsOnlyRecipeExample,
  StepperExample,
  StepperMobilePatternExample,
  StepperRoutePatternExample,
  StepperStatusExample,
  StepperVerticalExample,
};
