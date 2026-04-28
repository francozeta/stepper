import {
  StepperControlledExample,
  StepperExample,
  StepperStatusExample,
  StepperVerticalExample,
} from "@/components/ui/stepper";

const examples = [
  {
    title: "Checkout flow",
    description:
      "Guide customers through cart review, shipping details, and payment.",
    badge: "Horizontal",
    component: <StepperExample />,
  },
  {
    title: "Workspace onboarding",
    description:
      "Use a vertical layout when each step needs more context and scanning.",
    badge: "Vertical",
    component: <StepperVerticalExample />,
  },
  {
    title: "Blocked checkout",
    description:
      "Show validation problems, completed progress, and steps that are not available yet.",
    badge: "States",
    component: <StepperStatusExample />,
  },
  {
    title: "Controlled review",
    description:
      "Drive the active step from React state when the flow depends on app logic.",
    badge: "Controlled",
    component: <StepperControlledExample />,
  },
];

const features = [
  "Controlled",
  "Uncontrolled",
  "Horizontal",
  "Vertical",
  "Error state",
  "Disabled steps",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-muted px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex max-w-3xl flex-col gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            components/ui
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Stepper
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
              A lightweight component for building guided multi-step flows such
              as checkout, onboarding, setup screens, and long forms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </header>

        {examples.map((example) => (
          <section
            key={example.title}
            className="rounded-xl border border-border bg-background p-4 shadow-sm sm:p-6"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-medium text-foreground">
                  {example.title}
                </h2>
                <p className="max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
                  {example.description}
                </p>
              </div>
              <span className="w-fit rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {example.badge}
              </span>
            </div>
            {example.component}
          </section>
        ))}
      </div>
    </main>
  );
}
