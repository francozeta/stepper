"use client";

import * as React from "react";
import Link from "next/link";
import { Stepper, StepperContent, StepperItem, StepperList, StepperNext, StepperPrevious } from "@/components/ui/stepper";
import { handoffReducer, initialState, stages, type Stage } from "@/lib/stepper-handoff";

const labels: Record<Stage, string> = { account: "Account", preferences: "Preferences", review: "Review" };

export function StepperHandoffLab() {
  const [state, dispatch] = React.useReducer(handoffReducer, initialState);
  const [target, setTarget] = React.useState<Stage>("preferences");
  const [snapshot, setSnapshot] = React.useState<Stage | undefined>();
  const index = stages.indexOf(state.stage);
  const last = state.history.at(-1);

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
        <p className="text-sm text-muted-foreground">A human and a simulated agent can request navigation. Neither owns the workflow.</p>
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
              <p className="text-xs text-muted-foreground">Your choices stay here when the agent takes over.</p>
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
          <p role="status" className="min-h-8 text-xs text-muted-foreground">{last?.message ?? "Ready."}</p>
        </Stepper>
      </section>

      <section className="grid gap-4 border-t pt-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium">Agent simulator</h2>
          <span className="rounded-full border px-2 py-1 text-[10px] text-muted-foreground">Local only</span>
        </div>
        <p className="text-xs text-muted-foreground">Read the current stage, then ask to move. Try changing the step manually between reading and executing the request.</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button type="button" onClick={() => setSnapshot(state.stage)} className="rounded-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Read state</button>
          <output className="font-mono text-xs text-muted-foreground">snapshot: {snapshot ?? "—"}</output>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid flex-1 gap-1 text-xs text-muted-foreground">Target stage
            <select value={target} onChange={(event) => setTarget(event.target.value as Stage)} className="h-10 rounded-lg border bg-background px-3 text-sm text-foreground">
              {stages.map((value) => <option key={value} value={value}>{labels[value]}</option>)}
            </select>
          </label>
          <button type="button" disabled={!snapshot} onClick={() => dispatch({ type: "navigate", source: "agent", target, expectedStage: snapshot })} className="h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Request change</button>
        </div>
        <div className="flex justify-between gap-3 text-xs text-muted-foreground">
          <span>Current stage</span><span className="font-mono">{index + 1}/3 · {state.stage}</span>
        </div>
      </section>

      <section className="grid gap-2 border-t pt-5">
        <h2 className="text-sm font-medium">Action trace</h2>
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
      <p className="text-xs text-muted-foreground">No model, network request, or browser tool registration. This is a controlled baseline for a future UI SDK bridge.</p>
    </main>
  );
}
