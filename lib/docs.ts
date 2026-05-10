import packageJson from "@/package.json";

const registryVersion = packageJson.version;

const quickFacts = [
  "Controlled and uncontrolled",
  "Horizontal and vertical",
  "Composed primitives",
  "Radix Slot for asChild",
  "Public useStepper hook",
  "No Motion in core",
  "shadcn/ui tokens",
];

const releaseItems = [
  "The registry output is generated from components/ui/stepper/*.",
  "GitHub Actions verifies the registry, docs, tests, and production build.",
  "The public install command copies @stepper/stepper from the official shadcn registry namespace.",
  "The component is copied into the user's app instead of installed as a runtime dependency.",
];

const gettingStartedSnippet = `import {
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
}`;

const controlledSnippet = `const [step, setStep] = React.useState("details");

<Stepper value={step} onValueChange={setStep}>
  <StepperList>
    <StepperItem value="details">Details</StepperItem>
    <StepperItem value="review">Review</StepperItem>
    <StepperItem value="confirm">Confirm</StepperItem>
  </StepperList>

  <StepperContent value="details">Collect details.</StepperContent>
  <StepperContent value="review">Review the request.</StepperContent>
  <StepperContent value="confirm">Confirm the flow.</StepperContent>
</Stepper>;`;

const usageSnippet = `import {
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
  useStepper,
} from "@/components/ui/stepper";`;

const registryInstallSnippet = `pnpm dlx shadcn@latest add @stepper/stepper`;

const whyStepper = [
  {
    label: "Compose first",
    value: "JSX-native",
    help: "Define the flow where the UI is rendered, not in a separate workflow factory.",
  },
  {
    label: "Own the code",
    value: "shadcn registry",
    help: "Install the generated single-file primitive into your app and keep full source ownership.",
  },
  {
    label: "Style the states",
    value: "data attributes",
    help: "Use data-slot, data-state, and semantic Tailwind tokens for product-ready styling.",
  },
];

const useStepperSnippet = `function WizardFooter() {
  const {
    canGoPrevious,
    canGoNext,
    currentIndex,
    totalSteps,
    goPrevious,
    goNext,
  } = useStepper();

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Step {currentIndex + 1} of {totalSteps}
      </span>
      <div className="flex gap-2">
        <Button type="button" variant="outline" disabled={!canGoPrevious} onClick={goPrevious}>
          Back
        </Button>
        <Button type="button" disabled={!canGoNext} onClick={goNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}`;

const worksWith = [
  {
    label: "react-hook-form",
    value: "Validation",
    help: "Owns field state and step validation in examples.",
  },
  {
    label: "zod",
    value: "Schema",
    help: "Defines form rules without coupling to the primitive.",
  },
  {
    label: "Next.js",
    value: "Routes",
    help: "Use StepperTrigger asChild with Link for route-based flows.",
  },
  {
    label: "shadcn/ui Form",
    value: "Fields",
    help: "Compose Field, Input, Select, Alert, and Button around the primitive.",
  },
  {
    label: "Server Actions",
    value: "Submit",
    help: "Keep persistence outside the Stepper while the UI reflects progress.",
  },
  {
    label: "Radix Slot",
    value: "asChild",
    help: "Used only for custom trigger/content composition.",
  },
];

const controlledBehaviorNotes = [
  {
    label: "Missing value",
    value: "First enabled step",
    help: "When value points to a step that does not exist, Stepper renders the first enabled step and calls onValueChange with that fallback.",
  },
  {
    label: "Disabled value",
    value: "Skipped",
    help: "When the selected step becomes disabled, Stepper moves to the first enabled step so controls and content stay coherent.",
  },
  {
    label: "Real flows",
    value: "App derived",
    help: "For routes, forms, and server data, derive value from the app state instead of treating Stepper as the workflow owner.",
  },
];

const asChildRequirements = [
  {
    label: "Focusable child",
    value: "button or link",
    help: "StepperTrigger asChild should render a focusable element that can receive keyboard focus.",
  },
  {
    label: "Prop forwarding",
    value: "className and aria-*",
    help: "Custom components must spread props so state attributes, classes, events, and ARIA props reach the real element.",
  },
  {
    label: "Refs and events",
    value: "forwardRef",
    help: "Forward refs for custom components and avoid preventDefault unless you intentionally block navigation.",
  },
];

const themeTokensSnippet = `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
}`;

const formWizardGuideSnippet = `"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
} from "@/components/ui/stepper";

const schema = z.object({
  workspaceName: z.string().min(2, "Enter a workspace name."),
  workspaceSlug: z.string().min(3, "Enter a workspace slug."),
});

type Values = z.infer<typeof schema>;
type Step = "workspace" | "review";

export function FormWizard() {
  const [step, setStep] = React.useState<Step>("workspace");
  const [completed, setCompleted] = React.useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspaceName: "",
      workspaceSlug: "",
    },
  });

  async function continueToReview() {
    const isValid = await form.trigger(["workspaceName", "workspaceSlug"], {
      shouldFocus: true,
    });

    if (!isValid) return;

    setCompleted(true);
    setStep("review");
  }

  return (
    <Stepper value={step} onValueChange={(value) => setStep(value as Step)}>
      <StepperList>
        <StepperItem value="workspace" completed={completed}>
          Workspace
        </StepperItem>
        <StepperItem value="review" disabled={!completed}>
          Review
        </StepperItem>
      </StepperList>

      <StepperContent value="workspace">
        <Field data-invalid={Boolean(form.formState.errors.workspaceName)}>
          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
          <Input
            id="workspace-name"
            aria-invalid={Boolean(form.formState.errors.workspaceName)}
            {...form.register("workspaceName")}
          />
          <FieldError>{form.formState.errors.workspaceName?.message}</FieldError>
        </Field>
      </StepperContent>

      <StepperContent value="review">
        Review the workspace before creating it.
      </StepperContent>

      <Button type="button" onClick={() => void continueToReview()}>
        Continue
      </Button>
    </Stepper>
  );
}`;

const routeBasedPatternSnippet = `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperTrigger,
} from "@/components/ui/stepper";

const setupSteps = [
  { value: "workspace", label: "Workspace", href: "/setup/workspace" },
  { value: "members", label: "Members", href: "/setup/members" },
  { value: "review", label: "Review", href: "/setup/review" },
] as const;

type SetupStepValue = (typeof setupSteps)[number]["value"];

export function SetupRoutes({
  completedSteps,
}: {
  completedSteps: SetupStepValue[];
}) {
  const pathname = usePathname();
  const currentStep = getStepFromPathname(pathname);

  return (
    <Stepper value={currentStep}>
      <StepperList>
        {setupSteps.map((step) => {
          const completed = completedSteps.includes(step.value);
          const disabled = !canVisitStep(step.value, completedSteps);

          return (
            <StepperItem
              key={step.value}
              value={step.value}
              completed={completed}
              disabled={disabled}
            >
              <StepperTrigger asChild>
                <Link
                  href={step.href}
                  prefetch={false}
                  onNavigate={(event) => {
                    if (disabled) {
                      event.preventDefault();
                    }
                  }}
                >
                  <StepperIndicator />
                  <StepperLabel>{step.label}</StepperLabel>
                </Link>
              </StepperTrigger>
            </StepperItem>
          );
        })}
      </StepperList>
    </Stepper>
  );
}

function getStepFromPathname(pathname: string): SetupStepValue {
  const normalizedPath = pathname.replace(/\\/$/, "");
  const match = setupSteps.find((step) => step.href === normalizedPath);

  return match?.value ?? "workspace";
}

function canVisitStep(
  value: SetupStepValue,
  completedSteps: SetupStepValue[]
) {
  if (value === "workspace") return true;
  if (value === "members") return completedSteps.includes("workspace");

  return completedSteps.includes("workspace") && completedSteps.includes("members");
}`;

const mobileDrawerPatternSnippet = `"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  StepperItem,
  StepperList,
} from "@/components/ui/stepper";

type Step = "workspace" | "members" | "review";

function SetupStepList() {
  return (
    <StepperList>
      <StepperItem value="workspace" completed>
        Workspace
      </StepperItem>
      <StepperItem value="members">Members</StepperItem>
      <StepperItem value="review" disabled>
        Review
      </StepperItem>
    </StepperList>
  );
}

export function MobileStepperPattern() {
  const [step, setStep] = React.useState<Step>("members");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <p className="text-sm font-medium">Current step: {step}</p>
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
                value={step}
                onValueChange={(value) => setStep(value as Step)}
                orientation="vertical"
              >
                <SetupStepList />
              </Stepper>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Stepper
        value={step}
        onValueChange={(value) => setStep(value as Step)}
        className="hidden md:flex"
      >
        <SetupStepList />
      </Stepper>

      <div className="rounded-lg border p-4">
        Content for {step}.
      </div>
    </div>
  );
}`;

const circleProgressRecipeSnippet = `"use client";

import * as React from "react";

import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
} from "@/components/ui/stepper";

const steps = ["business", "product", "review"] as const;
type Step = (typeof steps)[number];

export function CircleProgressStepper() {
  const [value, setValue] = React.useState<Step>("product");
  const currentIndex = steps.indexOf(value);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <Stepper value={value} onValueChange={(next) => setValue(next as Step)}>
      <StepperList className="sr-only">
        {steps.map((step, index) => (
          <StepperItem key={step} value={step} completed={index < currentIndex}>
            {step}
          </StepperItem>
        ))}
      </StepperList>

      <div className="flex items-center gap-3">
        <span
          className="grid size-10 place-items-center rounded-full"
          style={{
            background: \`conic-gradient(var(--foreground) \${progress}%, var(--muted) 0)\`,
          }}
        >
          <span className="grid size-8 place-items-center rounded-full bg-background text-xs font-semibold">
            {currentIndex + 1}
          </span>
        </span>
        <p className="text-sm font-medium">Step {currentIndex + 1} of {steps.length}</p>
      </div>

      <StepperContent value={value} forceMount>
        Content for {value}.
      </StepperContent>
    </Stepper>
  );
}`;

const controlsOnlyRecipeSnippet = `"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
} from "@/components/ui/stepper";

const steps = ["username", "details", "done"] as const;
type Step = (typeof steps)[number];

export function ControlsOnlyStepper() {
  const [value, setValue] = React.useState<Step>("username");
  const currentIndex = steps.indexOf(value);

  return (
    <Stepper value={value} onValueChange={(next) => setValue(next as Step)}>
      <StepperList className="sr-only">
        {steps.map((step, index) => (
          <StepperItem key={step} value={step} completed={index < currentIndex}>
            {step}
          </StepperItem>
        ))}
      </StepperList>

      <StepperContent value={value} forceMount>
        Content for {value}.
      </StepperContent>

      <Button
        type="button"
        onClick={() => setValue(steps[currentIndex + 1] ?? value)}
        disabled={currentIndex === steps.length - 1}
      >
        Next
      </Button>
    </Stepper>
  );
}`;

const workspaceExampleCode = `"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Check, Lock, Send, Settings2, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";

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
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperPrevious,
  StepperTrigger,
} from "@/components/ui/stepper";

const schema = z.object({
  workspaceName: z.string().min(2, "Enter a workspace name."),
  workspaceSlug: z
    .string()
    .min(3, "Use at least 3 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe slug."),
  region: z.enum(["iad1", "fra1", "sin1"]),
  visibility: z.enum(["private", "team"]),
  inviteEmail: z.string().email("Enter a valid email.").or(z.literal("")),
});

type Values = z.infer<typeof schema>;
type Step = "workspace" | "preferences" | "members" | "review";

const steps: Step[] = ["workspace", "preferences", "members", "review"];
const fields = {
  workspace: ["workspaceName", "workspaceSlug"],
  preferences: ["region", "visibility"],
  members: ["inviteEmail"],
  review: [],
} satisfies Record<Step, Array<keyof Values>>;

export function WorkspaceSetup() {
  const [step, setStep] = React.useState<Step>("workspace");
  const [completed, setCompleted] = React.useState<Partial<Record<Step, boolean>>>({});
  const [attempted, setAttempted] = React.useState<Partial<Record<Step, boolean>>>({});
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspaceName: "",
      workspaceSlug: "",
      region: "iad1",
      visibility: "private",
      inviteEmail: "",
    },
  });

  async function next() {
    setAttempted((current) => ({ ...current, [step]: true }));

    const isValid = await form.trigger(fields[step], { shouldFocus: true });

    if (!isValid) return;

    setCompleted((current) => ({ ...current, [step]: true }));
    setStep(steps[steps.indexOf(step) + 1] ?? step);
  }

  return (
    <Stepper value={step} onValueChange={(value) => setStep(value as Step)}>
      <StepperList>
        <StepperItem
          value="workspace"
          completed={completed.workspace}
          error={attempted.workspace && !completed.workspace}
        >
          <StepperTrigger>
            <StepperIndicator><Building2 /></StepperIndicator>
            <StepperLabel>Workspace</StepperLabel>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="preferences" completed={completed.preferences} disabled={!completed.workspace}>
          <StepperTrigger>
            <StepperIndicator>{completed.workspace ? <Settings2 /> : <Lock />}</StepperIndicator>
            <StepperLabel>Preferences</StepperLabel>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="members" completed={completed.members} disabled={!completed.preferences}>
          <StepperTrigger>
            <StepperIndicator>{completed.preferences ? <Users /> : <Lock />}</StepperIndicator>
            <StepperLabel>Members</StepperLabel>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="review" disabled={!completed.members}>
          <StepperTrigger>
            <StepperIndicator><Send /></StepperIndicator>
            <StepperLabel>Review</StepperLabel>
          </StepperTrigger>
        </StepperItem>
      </StepperList>

      <StepperContent value="workspace">
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
            <Input
              id="workspace-name"
              placeholder="Acme Design Systems"
              aria-invalid={Boolean(form.formState.errors.workspaceName)}
              {...form.register("workspaceName")}
            />
            <FieldError>
              {form.formState.errors.workspaceName?.message}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="workspace-slug">Workspace slug</FieldLabel>
            <Input
              id="workspace-slug"
              placeholder="acme-design"
              aria-invalid={Boolean(form.formState.errors.workspaceSlug)}
              {...form.register("workspaceSlug")}
            />
            <FieldDescription>Used in URLs, for example /acme-design.</FieldDescription>
            <FieldError>{form.formState.errors.workspaceSlug?.message}</FieldError>
          </Field>
        </FieldGroup>
      </StepperContent>

      <StepperContent value="preferences">
        <Field>
          <FieldLabel htmlFor="workspace-region">Region</FieldLabel>
          <Select
            defaultValue={form.getValues("region")}
            onValueChange={(region) =>
              form.setValue("region", region as Values["region"], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="workspace-region" className="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="iad1">US East</SelectItem>
                <SelectItem value="fra1">Europe</SelectItem>
                <SelectItem value="sin1">Asia Pacific</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </StepperContent>

      <StepperContent value="members">
        <Field>
          <FieldLabel htmlFor="invite-email">Invite email</FieldLabel>
          <Input
            id="invite-email"
            type="email"
            placeholder="teammate@company.com"
            aria-invalid={Boolean(form.formState.errors.inviteEmail)}
            {...form.register("inviteEmail")}
          />
          <FieldDescription>Leave blank to invite members later.</FieldDescription>
          <FieldError>{form.formState.errors.inviteEmail?.message}</FieldError>
        </Field>
      </StepperContent>

      <StepperContent value="review">
        Review the workspace and create it.
      </StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        {step === "review" ? (
          <Button type="button">
            Create workspace
            <Check data-icon="inline-end" />
          </Button>
        ) : (
          <Button type="button" onClick={() => void next()}>
            Continue
          </Button>
        )}
      </div>
    </Stepper>
  );
}`;

const checkoutExampleCode = `import { Check, CreditCard, Truck } from "lucide-react";

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperTrigger,
} from "@/components/ui/stepper";

export function CheckoutFlow() {
  return (
    <Stepper defaultValue="shipping">
      <StepperList>
        <StepperItem value="cart" completed>
          <StepperTrigger>
            <StepperIndicator>
              <Check />
            </StepperIndicator>
            <StepperLabel>Cart</StepperLabel>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="shipping">
          <StepperTrigger>
            <StepperIndicator>
              <Truck />
            </StepperIndicator>
            <StepperLabel>Shipping</StepperLabel>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="payment" disabled>
          <StepperTrigger>
            <StepperIndicator>
              <CreditCard />
            </StepperIndicator>
            <StepperLabel>Payment</StepperLabel>
          </StepperTrigger>
        </StepperItem>
      </StepperList>

      <StepperContent value="cart">Review selected products.</StepperContent>
      <StepperContent value="shipping">Confirm delivery details.</StepperContent>
      <StepperContent value="payment">Choose a payment method.</StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        <StepperNext />
      </div>
    </Stepper>
  );
}`;

const verticalExampleCode = `import { Building2, Check, Users } from "lucide-react";

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperTrigger,
} from "@/components/ui/stepper";

export function WorkspaceOnboarding() {
  return (
    <Stepper defaultValue="workspace" orientation="vertical">
      <StepperList>
        <StepperItem value="profile" completed>
          <StepperTrigger>
            <StepperIndicator>
              <Check />
            </StepperIndicator>
            <span className="flex flex-col gap-1">
              <StepperLabel>Profile</StepperLabel>
              <StepperDescription>Identity</StepperDescription>
            </span>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="workspace">
          <StepperTrigger>
            <StepperIndicator>
              <Building2 />
            </StepperIndicator>
            <span className="flex flex-col gap-1">
              <StepperLabel>Workspace</StepperLabel>
              <StepperDescription>Team defaults</StepperDescription>
            </span>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="invite" disabled>
          <StepperTrigger>
            <StepperIndicator>
              <Users />
            </StepperIndicator>
            <span className="flex flex-col gap-1">
              <StepperLabel>Invite team</StepperLabel>
              <StepperDescription>Locked</StepperDescription>
            </span>
          </StepperTrigger>
        </StepperItem>
      </StepperList>

      <StepperContent value="workspace">
        Set plan, region, and seats.
      </StepperContent>
    </Stepper>
  );
}`;

const statusExampleCode = `import { AlertCircle, Check, Lock } from "lucide-react";

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperTrigger,
} from "@/components/ui/stepper";

export function StepperWithStates() {
  return (
    <Stepper defaultValue="shipping">
      <StepperList>
        <StepperItem value="account" completed>
          <StepperTrigger>
            <StepperIndicator>
              <Check />
            </StepperIndicator>
            <StepperLabel>Account</StepperLabel>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="shipping" error>
          <StepperTrigger>
            <StepperIndicator>
              <AlertCircle />
            </StepperIndicator>
            <StepperLabel>Shipping</StepperLabel>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="payment" disabled>
          <StepperTrigger>
            <StepperIndicator>
              <Lock />
            </StepperIndicator>
            <StepperLabel>Payment</StepperLabel>
          </StepperTrigger>
        </StepperItem>
      </StepperList>

      <StepperContent value="shipping">
        Add a postal code to unlock payment.
      </StepperContent>
    </Stepper>
  );
}`;

const controlledExampleCode = `"use client";

import * as React from "react";

import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
} from "@/components/ui/stepper";

export function ControlledStepper() {
  const [value, setValue] = React.useState("details");

  return (
    <Stepper value={value} onValueChange={setValue}>
      <StepperList>
        <StepperItem value="details">Details</StepperItem>
        <StepperItem value="review">Review</StepperItem>
        <StepperItem value="confirm">Confirm</StepperItem>
      </StepperList>

      <StepperContent value="details">Collect request details.</StepperContent>
      <StepperContent value="review">Review the request.</StepperContent>
      <StepperContent value="confirm">Submit the request.</StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        <StepperNext>{value === "confirm" ? "Finish" : "Next"}</StepperNext>
      </div>
    </Stepper>
  );
}`;

const stateSelectorsCode = `[data-slot="stepper-item"][data-state="active"]
[data-slot="stepper-item"][data-state="completed"]
[data-slot="stepper-item"][data-state="disabled"]
[data-slot="stepper-item"][data-state="error"]

[data-slot="stepper-item"][data-position="previous"]
[data-slot="stepper-item"][data-position="current"]
[data-slot="stepper-item"][data-position="next"]

[data-slot="stepper-content"][data-state="active"]
[data-slot="stepper-content"][data-state="inactive"]`;

const compositionCode = `<StepperItem value="shipping">
  <StepperTrigger>
    <StepperIndicator />
    <span className="flex flex-col gap-1">
      <StepperLabel>Shipping</StepperLabel>
      <StepperDescription>Delivery address</StepperDescription>
    </span>
  </StepperTrigger>
</StepperItem>`;

const sidebarCompositionTree = `SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   ├── SidebarGroup
│   │   │   ├── SidebarGroupLabel
│   │   │   ├── SidebarGroupAction
│   │   │   ├── SidebarGroupContent
│   │   │   └── SidebarMenu
│   │   │       ├── SidebarMenuItem
│   │   │       │   ├── SidebarMenuButton
│   │   │       │   ├── SidebarMenuAction
│   │   │       │   └── SidebarMenuBadge
│   │   │       └── SidebarMenuItem
│   │   │           ├── SidebarMenuButton
│   │   │           └── SidebarMenuSub
│   │   │               ├── SidebarMenuSubItem
│   │   │               └── SidebarMenuSubItem
│   │   └── SidebarGroup
│   │       └── SidebarMenu
│   │           ├── SidebarMenuItem
│   │           └── SidebarMenuItem
│   ├── SidebarFooter
│   └── SidebarRail
├── SidebarInset
└── SidebarTrigger`;

const indicatorCode = `<StepperIndicator>
  <Check />
</StepperIndicator>`;

const rootProps = [
  {
    name: "value",
    type: "string",
    description: "Controlled active step value.",
  },
  {
    name: "defaultValue",
    type: "string",
    description: "Initial active step for uncontrolled usage.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Called when the selected step changes, including controlled fallbacks to the first enabled step.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Controls list layout and connector direction.",
  },
];

const listProps = [
  {
    name: "aria-label",
    type: "string",
    defaultValue: '"Progress steps"',
    description: "Accessible name for the ordered list. Use aria-labelledby when the list has an external heading.",
  },
];

const itemProps = [
  {
    name: "value",
    type: "string",
    description: "Unique step id used to connect trigger and content.",
  },
  {
    name: "completed",
    type: "boolean",
    defaultValue: "false",
    description: "Marks a step as completed and updates data-state.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the trigger and skips the step in next/previous navigation.",
  },
  {
    name: "error",
    type: "boolean",
    defaultValue: "false",
    description: "Marks a step as needing attention and exposes data-state=\"error\".",
  },
];

const contentProps = [
  {
    name: "value",
    type: "string",
    description: "Step value this content panel belongs to.",
  },
  {
    name: "forceMount",
    type: "boolean",
    defaultValue: "false",
    description: "Keeps inactive content mounted and hidden for advanced composition.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Render the content props onto a child element with Radix Slot.",
  },
];

const triggerProps = [
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Render the trigger props onto a custom button or link with Radix Slot.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the trigger in addition to the parent StepperItem disabled state. With asChild, aria-disabled and tabIndex are applied instead of a native disabled attribute.",
  },
];

const navigationProps = [
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Render StepperPrevious or StepperNext onto a custom button primitive with Radix Slot.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the navigation button in addition to canGoPrevious or canGoNext.",
  },
  {
    name: "onBeforePrevious",
    type: "() => boolean | Promise<boolean>",
    description: "Runs before StepperPrevious changes the value. Return false to cancel navigation.",
  },
  {
    name: "onBeforeNext",
    type: "() => boolean | Promise<boolean>",
    description: "Runs before StepperNext changes the value. Return false to cancel navigation.",
  },
];

const useStepperRows = [
  {
    name: "value",
    type: "string | undefined",
    description: "Current active step after fallback resolution.",
  },
  {
    name: "steps",
    type: "{ value: string; disabled: boolean }[]",
    description: "Registered step order used by navigation helpers.",
  },
  {
    name: "currentIndex",
    type: "number",
    description: "Zero-based index for the current active step, or -1 when no enabled step is active.",
  },
  {
    name: "totalSteps",
    type: "number",
    description: "Total number of registered steps, including disabled steps.",
  },
  {
    name: "setValue",
    type: "(value: string) => void",
    description: "Selects an enabled step by value.",
  },
  {
    name: "canGoPrevious / canGoNext",
    type: "boolean",
    description: "Whether previous or next enabled steps exist.",
  },
  {
    name: "goPrevious / goNext",
    type: "() => void",
    description: "Moves to the previous or next enabled step.",
  },
];

const accessibilityNotes = [
  {
    label: "Current step",
    value: 'aria-current="step"',
    help: "The active trigger is announced as the current step in a related step list.",
  },
  {
    label: "Keyboard",
    value: "Arrows, Home, End",
    help: "Arrow keys move focus between enabled triggers; Enter and Space keep the native button/link activation model.",
  },
  {
    label: "Panels",
    value: "aria-labelledby",
    help: "StepperContent renders a region labelled by its trigger and can stay mounted with forceMount.",
  },
  {
    label: "Semantics",
    value: "Not tabs",
    help: "Stepper avoids tab roles because it can represent route changes, validation gates, or progress indicators.",
  },
];

const registryNotes = [
  {
    label: "Version",
    value: `v${registryVersion}`,
    help: "Versioned as the registry component, not as a runtime package.",
  },
  {
    label: "Core file",
    value: "components/ui/stepper.tsx",
    help: "Copy-paste friendly primitive.",
  },
  {
    label: "Demo file",
    value: "components/stepper-examples.tsx",
    help: "Product examples separated from the core.",
  },
];

const apiComponents = [
  {
    name: "Stepper",
    element: "div",
    description: "Root provider that owns value, orientation, step order, and navigation state.",
  },
  {
    name: "StepperList",
    element: "ol",
    description: "Ordered visual list of steps. Supports horizontal and vertical layout.",
  },
  {
    name: "StepperItem",
    element: "li",
    description: "Step record with value, completed, disabled, and error states.",
  },
  {
    name: "StepperTrigger",
    element: "button / Slot",
    description: "Real button by default. Can use asChild for custom triggers while keeping step selection logic.",
  },
  {
    name: "StepperIndicator",
    element: "span",
    description: "Visual number, completed mark, error marker, or custom icon slot for a step.",
  },
  {
    name: "StepperLabel",
    element: "span",
    description: "Text label primitive for custom triggers and composable layouts.",
  },
  {
    name: "StepperDescription",
    element: "span",
    description: "Supporting text primitive for vertical steppers and richer step summaries.",
  },
  {
    name: "StepperSeparator",
    element: "span",
    description: "Connector line between steps. Hidden automatically when rendered in the final item.",
  },
  {
    name: "StepperContent",
    element: "div / Slot",
    description: "Associated panel for a step value. Can stay mounted with forceMount or render asChild.",
  },
  {
    name: "StepperPrevious / StepperNext",
    element: "button / Slot",
    description: "Navigation helpers that skip disabled steps, support asChild, and can run async guards.",
  },
  {
    name: "useStepper",
    element: "hook",
    description: "Public hook for external form footers, validation controls, and custom navigation.",
  },
];

const v2Roadmap = [
  {
    title: "Mobile pattern",
    description: "Document Drawer or Sheet composition without adding responsive props to the core.",
  },
  {
    title: "Linear mode",
    description: "Explore opt-in navigation rules for forms that must complete steps in order.",
  },
  {
    title: "Animation by composition",
    description: "Keep Motion outside the core and show animated content as an example.",
  },
];

export {
  accessibilityNotes,
  apiComponents,
  asChildRequirements,
  checkoutExampleCode,
  circleProgressRecipeSnippet,
  compositionCode,
  contentProps,
  controlledBehaviorNotes,
  controlledExampleCode,
  controlledSnippet,
  controlsOnlyRecipeSnippet,
  formWizardGuideSnippet,
  gettingStartedSnippet,
  indicatorCode,
  itemProps,
  listProps,
  mobileDrawerPatternSnippet,
  navigationProps,
  registryVersion,
  registryInstallSnippet,
  registryNotes,
  quickFacts,
  releaseItems,
  rootProps,
  routeBasedPatternSnippet,
  sidebarCompositionTree,
  stateSelectorsCode,
  statusExampleCode,
  themeTokensSnippet,
  triggerProps,
  usageSnippet,
  useStepperRows,
  useStepperSnippet,
  verticalExampleCode,
  v2Roadmap,
  worksWith,
  workspaceExampleCode,
  whyStepper,
};
