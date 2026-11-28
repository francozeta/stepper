"use client";

import * as React from "react";
import Link from "next/link";
import { Stepper, StepperContent, StepperItem, StepperList, StepperNext, StepperPrevious } from "@/components/ui/stepper";
import { handoffReducer, initialState, stages, type Stage } from "@/lib/stepper-handoff";

const labels: Record<Stage, string> = { account: "Account", preferences: "Preferences", review: "Review" };

export function StepperHandoffLab() {
  const [state, dispatch] = React.useReducer(handoffReducer, initialState);
  const [pending, setPending] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const index = stages.indexOf(state.stage);
  const last = state.history.at(-1);

  React.useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  function requestHelp() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
      setPending(false);
      return;
    }

    const target = stages[index + 1];
    if (!target) return;
    const expectedStage = state.stage;
    const expectedRevision = state.revision;
    setPending(true);
    // Deliberate local delay: a person can change the form while the request is pending.
    timer.current = setTimeout(() => {
      timer.current = null;
      dispatch({ type: "navigate", source: "agent", target, expectedStage, expectedRevision });
      setPending(false);
    }, 1200);
  }

  function panel(value: Stage) {
    const inactive = value !== state.stage;
    return {
      value, keepMounted: true, hidden: false, inert: inactive,
      "aria-hidden": inactive ? true as const : undefined,
      style: { gridArea: "1 / 1", visibility: inactive ? "hidden" as const : "visible" as const },
      className: "space-y-4 border-0 bg-transparent p-1 shadow-none",
    };
  }

  return (
    <main className="mx-auto grid min-h-dvh max-w-xl content-start gap-7 px-5 py-8 sm:py-14">
      <header className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href="/drafts/interactions" className="w-fit text-xs text-muted-foreground hover:text-foreground">Stepper / Research / 005</Link>
          <Link href="/drafts/onboarding" className="text-xs text-muted-foreground hover:text-foreground">Next: Agent-ready →</Link>
        </div>
        <h1 className="text-2xl font-medium tracking-tight">One interface. Shared intent.</h1>
        <p className="text-sm text-muted-foreground">Move forward yourself or ask the assistant. You can change your mind at any point.</p>
      </header>
      <section className="rounded-2xl border border-border p-4 sm:p-6">
        <Stepper steps={stages.map((value) => ({ value }))} value={state.stage} onValueChange={(value) => dispatch({ type: "navigate", source: "human", target: value })}>
          <StepperList>
            {stages.map((value) => <StepperItem key={value} value={value}>{labels[value]}</StepperItem>)}
          </StepperList>
          <div className="grid min-w-0 grid-cols-1 items-start">
            <StepperContent {...panel("account")}>
              <h2 className="text-lg font-medium">Start with the essentials.</h2>
              <label className="grid gap-2 text-sm">
                Workspace name
                <input value={state.workspace} onChange={(event) => dispatch({ type: "workspace", value: event.target.value })} placeholder="Studio" className="h-10 rounded-lg border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <p className="text-xs text-muted-foreground">Required before moving forward.</p>
            </StepperContent>
            <StepperContent {...panel("preferences")}>
              <h2 className="text-lg font-medium">Make it yours.</h2>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={state.updates} onChange={(event) => dispatch({ type: "updates", value: event.target.checked })} />
                Receive product updates
              </label>
              <p className="text-xs text-muted-foreground">Your choices are kept when you move between steps.</p>
            </StepperContent>
            <StepperContent {...panel("review")}>
              <h2 className="text-lg font-medium">Everything in place.</h2>
              <p className="text-sm">Workspace: {state.workspace || "Untitled"}</p>
              <p className="text-sm">Updates: {state.updates ? "Enabled" : "Disabled"}</p>
            </StepperContent>
          </div>
          <div className="flex justify-between gap-3 border-t pt-4">
            <StepperPrevious className="rounded-full">Back</StepperPrevious>
            <StepperNext className="rounded-full">Continue</StepperNext>
          </div>
        </Stepper>
      </section>

      <section className="grid gap-2">
        <button type="button" onClick={requestHelp} disabled={!pending && index === stages.length - 1} className="w-fit rounded-full border border-border px-4 py-2 text-sm font-medium disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          {pending ? "Stop assistant" : "Continue with assistant"}
        </button>
        <p role="status" className="min-h-10 text-sm text-muted-foreground">
          {pending ? "Preparing the next step. You can still edit or navigate." : last?.result === "blocked" ? last.message : last?.source === "agent" ? "Assistant moved you to the next step." : "The assistant follows the same rules as you."}
        </p>
      </section>

      <section className="grid gap-2 border-t pt-5">
        <h2 className="text-sm font-medium">Interaction history</h2>
        {state.history.length === 0 ? <p className="text-xs text-muted-foreground">No requests yet.</p> : (
          <ol className="grid gap-2">
            {state.history.map((entry, i) => <li key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
              <span className="font-mono text-muted-foreground">{entry.source}</span>
              <span>{entry.target}</span>
              <span className="ml-auto text-muted-foreground">{entry.result}</span>
              {entry.result === "blocked" && <span className="w-full text-muted-foreground">{entry.message}</span>}
            </li>)}
          </ol>
        )}
      </section>
      <p className="text-xs text-muted-foreground">Local simulation. Try moving or editing while the assistant prepares the next step.</p>
    </main>
  );
}
