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
  docsNav,
  packageNotes,
  quickFacts,
  releaseItems,
  v2Roadmap,
};

export type { DocsNavGroup, DocsNavItem };
