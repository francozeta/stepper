import type { ComponentType } from "react";
import {
  BookOpen,
  Boxes,
  Code2,
  GalleryVerticalEnd,
  Palette,
  Rocket,
} from "lucide-react";

type DocsNavItem = {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

type DocsNavGroup = {
  title: string;
  items: DocsNavItem[];
};

const docsNav: DocsNavGroup[] = [
  {
    title: "Basics",
    items: [
      {
        title: "Overview",
        href: "/",
        icon: Boxes,
      },
      {
        title: "Getting Started",
        href: "/getting-started",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "API",
    items: [
      {
        title: "Stepper",
        href: "/api",
        icon: Code2,
      },
      {
        title: "Examples",
        href: "/examples",
        icon: GalleryVerticalEnd,
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "Styling",
        href: "/styling",
        icon: Palette,
      },
      {
        title: "Release 0.1.0",
        href: "/changelog",
        icon: Rocket,
      },
    ],
  },
];

const quickFacts = [
  "Controlled and uncontrolled",
  "Horizontal and vertical",
  "Composed primitives",
  "No Radix requirement",
  "No Motion in core",
  "shadcn/ui tokens",
];

const releaseItems = [
  "Controlled and uncontrolled Stepper state.",
  "Horizontal and vertical layouts.",
  "Step states for active, completed, disabled, and error.",
  "Associated content panels with optional forceMount.",
  "Navigation helpers with StepperPrevious and StepperNext.",
  "Primitive composition pieces for custom triggers and indicators.",
  "Lightweight step registration for simple wrappers around StepperItem.",
  "Product-style demos for checkout, onboarding, blocked states, and controlled flows.",
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

const workspaceExampleCode = `"use client";

import * as React from "react";
import { Building2, Check, Lock, Send, Settings2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

export function WorkspaceSetup() {
  const [step, setStep] = React.useState("workspace");
  const [workspaceReady, setWorkspaceReady] = React.useState(false);
  const [preferencesReady, setPreferencesReady] = React.useState(false);
  const preferencesDisabled = !workspaceReady;
  const inviteDisabled = !preferencesReady;
  const blocked =
    (step === "workspace" && !workspaceReady) ||
    (step === "preferences" && !preferencesReady);

  return (
    <Stepper value={step} onValueChange={setStep}>
      <StepperList>
        <StepperItem value="profile" completed>
          <StepperTrigger>
            <StepperIndicator><UserRound /></StepperIndicator>
            <StepperLabel>Profile</StepperLabel>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value="workspace" completed={workspaceReady} error={!workspaceReady}>
          <StepperTrigger>
            <StepperIndicator><Building2 /></StepperIndicator>
            <StepperLabel>Workspace</StepperLabel>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value="preferences" completed={preferencesReady} disabled={preferencesDisabled}>
          <StepperTrigger>
            <StepperIndicator>{preferencesDisabled ? <Lock /> : <Settings2 />}</StepperIndicator>
            <StepperLabel>Preferences</StepperLabel>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value="invite" disabled={inviteDisabled}>
          <StepperTrigger>
            <StepperIndicator>{inviteDisabled ? <Lock /> : <Send />}</StepperIndicator>
            <StepperLabel>Invite</StepperLabel>
          </StepperTrigger>
        </StepperItem>
      </StepperList>

      <StepperContent value="workspace">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Generate a URL-safe slug before preferences unlock.
          </p>
          <Button size="sm" variant="outline" onClick={() => setWorkspaceReady(true)}>
            <Check data-icon="inline-start" />
            Generate slug
          </Button>
        </div>
      </StepperContent>

      <StepperContent value="preferences">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Save access policy and notification defaults.
          </p>
          <Button size="sm" variant="outline" onClick={() => setPreferencesReady(true)}>
            <Check data-icon="inline-start" />
            Save defaults
          </Button>
        </div>
      </StepperContent>

      <StepperContent value="invite">
        Ready to invite teammates.
      </StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        <StepperNext disabled={blocked}>Next</StepperNext>
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
  StepperSeparator,
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
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="shipping">
          <StepperTrigger>
            <StepperIndicator>
              <Truck />
            </StepperIndicator>
            <StepperLabel>Shipping</StepperLabel>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="payment" disabled>
          <StepperTrigger>
            <StepperIndicator>
              <CreditCard />
            </StepperIndicator>
            <StepperLabel>Payment</StepperLabel>
          </StepperTrigger>
          <StepperSeparator />
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
  StepperSeparator,
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
          <StepperSeparator />
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
          <StepperSeparator />
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
          <StepperSeparator />
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
  StepperSeparator,
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
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="shipping" error>
          <StepperTrigger>
            <StepperIndicator>
              <AlertCircle />
            </StepperIndicator>
            <StepperLabel>Shipping</StepperLabel>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="payment" disabled>
          <StepperTrigger>
            <StepperIndicator>
              <Lock />
            </StepperIndicator>
            <StepperLabel>Payment</StepperLabel>
          </StepperTrigger>
          <StepperSeparator />
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
  <StepperSeparator />
</StepperItem>`;

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
    description: "Called when the selected step changes.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Controls list layout and connector direction.",
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
];

const packageNotes = [
  {
    label: "Version",
    value: "0.1.0",
    help: "First presentable release candidate.",
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
    element: "button",
    description: "Real button that selects the step and receives aria-current on the active item.",
  },
  {
    name: "StepperIndicator",
    element: "span",
    description: "Visual number, status, or custom icon slot for a step.",
  },
  {
    name: "StepperContent",
    element: "div",
    description: "Associated panel for a step value. Can stay mounted with forceMount.",
  },
  {
    name: "StepperPrevious / StepperNext",
    element: "button",
    description: "Basic navigation helpers that skip disabled steps.",
  },
];

const v2Roadmap = [
  {
    title: "asChild",
    description: "Add Radix Slot once the trigger API needs links or custom button primitives.",
  },
  {
    title: "Richer primitives",
    description: "Split label, description, indicator, separator, and trigger examples further.",
  },
  {
    title: "Animation by composition",
    description: "Keep Motion outside the core and show animated content as an example.",
  },
];

export {
  apiComponents,
  checkoutExampleCode,
  compositionCode,
  contentProps,
  controlledExampleCode,
  controlledSnippet,
  docsNav,
  gettingStartedSnippet,
  indicatorCode,
  itemProps,
  packageNotes,
  quickFacts,
  releaseItems,
  rootProps,
  stateSelectorsCode,
  statusExampleCode,
  verticalExampleCode,
  v2Roadmap,
  workspaceExampleCode,
};

export type { DocsNavGroup, DocsNavItem };
