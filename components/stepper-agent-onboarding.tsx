"use client";

import * as React from "react";
import Link from "next/link";
import { createChange, definePrimitive, type ChangeDetails } from "@ui-sdk/core";
import { createParts } from "@ui-sdk/react/primitive";
import { createAgent } from "@ui-sdk/react/agent";
import { Input } from "@ui-sdk/react/input";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { Stepper, StepperContent, StepperItem, StepperList, StepperNext, StepperPrevious } from "@/components/ui/stepper";
import { assistancePlan, labels, navigationIssue, stages, type Stage, type ValidationIssue } from "@/lib/stepper-onboarding";

type ProgressOptions = {
  value?: string;
  onValueChange?: (value: string, details: ChangeDetails<"imperative">) => void;
};

const progress = definePrimitive({
  name: "stepper-progress",
  options: { value: "string", onValueChange: "callback" },
  controlled: ["value"],
  state: (options: ProgressOptions) => ({ value: options.value ?? "business" }),
  sync: (options) => options.value === undefined ? {} : { value: options.value },
  api: (context) => {
    const change = createChange(context);
    return { setValue: (value: string) => change("value", value, { reason: "imperative" }) };
  },
  slots: (slot) => ({ root: slot({ attrs: () => ({ role: "group" }) }) }),
  agent: { actions: ["setValue"] },
});
const { Root: AgentProgress } = createParts(progress, { root: "div" });

// Created only on a user action in the browser. No global tools or external model.
let bridge: ReturnType<typeof createAgent> | undefined;
function getBridge() {
  return bridge ??= createAgent({
    allow: (step) =>
      (step.label === "Onboarding progress" && step.action === "setValue" &&
        stages.some((stage) => stage === step.args?.[0])) ||
      (step.label === "Business name" && step.action === "setValue" && step.args?.[0] === "Café Studio") ||
      (step.label === "Currency" && step.action === "setValue" && step.args?.[0] === "PEN") ||
      (step.label === "QR payments" && step.action === "setChecked" && step.args?.[0] === true),
  });
}

const fieldClass = "h-11 w-full rounded-lg border border-border bg-background px-3 text-base sm:text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive";
const steps = stages.map((value) => ({ value }));

export function StepperAgentOnboarding() {
  const [draft, setDraft] = React.useState({
    stage: "business" as Stage, name: "", currency: "", qr: false,
    qrTouched: false, nameTouched: false, currencyTouched: false,
  });
  const latest = React.useRef(draft);
  const { stage, name, currency, qr } = draft;

  // SDK calls may arrive before React commits. Read the last accepted intent.
  function updateDraft(patch: Partial<typeof draft>) {
    latest.current = { ...latest.current, ...patch };
    setDraft(latest.current);
  }
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [issue, setIssue] = React.useState<ValidationIssue>();
  const statusId = React.useId();
  const [confirmed, setConfirmed] = React.useState(false);
  const running = React.useRef<AbortController | null>(null);

  React.useEffect(() => () => running.current?.abort(), []);

  function requestStage(target: string) {
    const current = latest.current;
    const error = navigationIssue(current.stage, target, current.name, current.currency);
    if (error) {
      setIssue(error);
      setMessage(error.message);
      return false;
    }
    updateDraft({ stage: target as Stage });
    setIssue(undefined);
    setMessage("");
    setConfirmed(false);
    return true;
  }

  function stop() {
    running.current?.abort();
  }

  function acceptChange(details: Pick<ChangeDetails<string>, "source" | "cancel">) {
    if (details.source !== "agent") {
      stop();
      return true;
    }
    // An action can already be in flight when the person interrupts a run.
    if (running.current?.signal.aborted === false) return true;
    details.cancel();
    return false;
  }

  async function prepare() {
    const current = latest.current;
    if (running.current || current.stage === "review") return;
    const controller = new AbortController();
    running.current = controller;
    setBusy(true);
    setMessage("");
    setIssue(undefined);
    try {
      const plan = assistancePlan(current.stage, current.name, current.currency, current.qrTouched, {
        name: current.nameTouched, currency: current.currencyTouched,
      });
      const result = plan.steps.length
        ? await getBridge().act({ steps: plan.steps }, { signal: controller.signal })
        : { ok: true };
      if (controller.signal.aborted) setMessage("Paused. Continue by hand or resume.");
      else if (result.ok && plan.issue) {
        setIssue(plan.issue);
        setMessage(plan.issue.message);
      } else if (result.ok) setMessage("Draft prepared. Review before confirming.");
      else setMessage((message) => message || "A change was blocked. Check the fields before continuing.");
    } catch {
      setMessage(controller.signal.aborted ? "Paused." : "The assistant could not finish. You can continue manually.");
    } finally {
      running.current = null;
      setBusy(false);
    }
  }

  function panel(value: Stage) {
    const inactive = stage !== value;
    return {
      value, keepMounted: true, hidden: false, inert: inactive,
      "aria-hidden": inactive ? true as const : undefined,
      "data-agent-hidden": inactive ? "" : undefined,
      style: { gridArea: "1 / 1", visibility: inactive ? "hidden" as const : "visible" as const },
      className: "space-y-5 border-0 bg-transparent p-1 shadow-none",
    };
  }

  return (
    <main className="mx-auto grid min-h-dvh max-w-xl content-start gap-7 px-5 py-8 sm:py-14">
      <header className="grid gap-3">
        <Link href="/drafts/handoff" className="w-fit text-xs text-muted-foreground hover:text-foreground">Stepper / Research / 006</Link>
        <h1 className="text-2xl font-medium tracking-tight">Set up your business.</h1>
        <p className="text-sm text-muted-foreground">Complete it yourself or ask for help.</p>
      </header>
      <section onPointerDownCapture={(event) => { if (event.nativeEvent.isTrusted) stop(); }} onKeyDownCapture={(event) => { if (event.nativeEvent.isTrusted) stop(); }} className="rounded-2xl border border-border p-4 sm:p-6">
        <AgentProgress aria-label="Onboarding progress" value={stage} onValueChange={(value, details) => {
          if (acceptChange(details) && !requestStage(value)) details.cancel();
        }}>
          <Stepper steps={steps} value={stage} onValueChange={(value) => {
            stop();
            requestStage(value);
          }}>
            <StepperList>
              {stages.map((value) => <StepperItem key={value} value={value}>{labels[value]}</StepperItem>)}
            </StepperList>
            <div className="grid min-w-0 grid-cols-1 items-start">
              <StepperContent {...panel("business")}>
                <h2 className="text-lg font-medium">Make it yours.</h2>
                <label className="grid gap-2 text-sm">Business name
                  <Input aria-label="Business name" aria-required="true" aria-invalid={issue?.field === "name" || undefined} aria-describedby={issue?.field === "name" ? statusId : undefined} name="business" value={name} onValueChange={(value, details) => {
                    if (!acceptChange(details)) return;
                    updateDraft({ name: value, ...(details.source !== "agent" ? { nameTouched: true } : {}) });
                    if (issue?.field === "name" && value.trim()) { setIssue(undefined); setMessage(""); }
                  }} placeholder="Your café" className={fieldClass} />
                </label>
              </StepperContent>
              <StepperContent {...panel("preferences")}>
                <h2 className="text-lg font-medium">Set your preferences.</h2>
                <label className="grid gap-2 text-sm">Currency
                  <Input aria-label="Currency" aria-required="true" aria-invalid={issue?.field === "currency" || undefined} aria-describedby={issue?.field === "currency" ? statusId : undefined} name="currency" value={currency} onValueChange={(value, details) => {
                    if (!acceptChange(details)) return;
                    updateDraft({ currency: value, ...(details.source !== "agent" ? { currencyTouched: true } : {}) });
                    if (issue?.field === "currency" && /^(PEN|USD)$/i.test(value.trim())) { setIssue(undefined); setMessage(""); }
                  }} placeholder="PEN or USD" className={fieldClass} />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>QR payments</span>
                  <Switch aria-label="QR payments" checked={qr} onCheckedChange={(value, details) => {
                    if (!acceptChange(details)) return;
                    updateDraft({ qr: value, qrTouched: true });
                  }} className="group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border bg-muted p-0.5 data-checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <SwitchThumb className="size-4 rounded-full bg-background shadow-sm transition-transform group-data-checked:translate-x-5 motion-reduce:transition-none" />
                  </Switch>
                </label>
              </StepperContent>
              <StepperContent {...panel("review")}>
                <h2 className="text-lg font-medium">Everything in place.</h2>
                <dl className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Business</dt><dd>{name}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Currency</dt><dd>{currency.trim().toUpperCase()}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">QR payments</dt><dd>{qr ? "Enabled" : "Disabled"}</dd></div>
                </dl>
              </StepperContent>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
              <StepperPrevious className="rounded-full">Back</StepperPrevious>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                <button type="button" aria-label={busy ? "Stop assistant" : "Fill with assistant"} disabled={!busy && stage === "review"} onClick={busy ? stop : prepare} className="h-9 rounded-full border border-border px-3 text-sm font-medium hover:bg-muted disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{busy ? "Stop" : message.startsWith("Paused") ? "Resume" : "Assist"}</button>
              {stage === "review" ? (
                <button type="button" onClick={() => setConfirmed(true)} disabled={confirmed} className="inline-flex h-9 min-w-24 items-center justify-center rounded-full border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:opacity-50">{confirmed ? "Confirmed locally" : "Confirm setup"}</button>
              ) : <StepperNext className="rounded-full">Continue</StepperNext>}
              </div>
            </div>
            <p id={statusId} role="status" className={`min-h-10 text-sm ${issue ? "text-destructive" : "text-muted-foreground"}`}>{message || (busy ? "Preparing your setup. You can still edit." : stage === "review" ? "Review your choices before confirming." : "Assist uses sample details and keeps your choices.")}</p>
          </Stepper>
        </AgentProgress>
      </section>
      <p className="text-xs text-muted-foreground">Local demo using UI SDK actions. No external submissions.</p>
    </main>
  );
}
