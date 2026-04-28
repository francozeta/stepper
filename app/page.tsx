import { StepperExample } from "@/components/ui/stepper";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-6">
      <div className="w-full max-w-2xl rounded-lg border border-border bg-background p-6 shadow-sm">
        <StepperExample />
      </div>
    </main>
  );
}
