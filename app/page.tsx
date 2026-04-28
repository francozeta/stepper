import {
  StepperControlledExample,
  StepperExample,
  StepperStatusExample,
  StepperVerticalExample,
} from "@/components/ui/stepper";

const examples = [
  {
    title: "Horizontal checkout",
    component: <StepperExample />,
  },
  {
    title: "Vertical onboarding",
    component: <StepperVerticalExample />,
  },
  {
    title: "Error and disabled states",
    component: <StepperStatusExample />,
  },
  {
    title: "Controlled state",
    component: <StepperControlledExample />,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-muted px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            components/ui
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Stepper
          </h1>
        </header>

        {examples.map((example) => (
          <section
            key={example.title}
            className="rounded-lg border border-border bg-background p-6 shadow-sm"
          >
            <h2 className="mb-5 text-sm font-medium text-foreground">
              {example.title}
            </h2>
            {example.component}
          </section>
        ))}
      </div>
    </main>
  );
}
