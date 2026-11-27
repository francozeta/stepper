"use client";

import * as React from "react";
import Link from "next/link";
import { createChange, definePrimitive, type ChangeDetails } from "@ui-sdk/core";
import { createParts } from "@ui-sdk/react/primitive";
import { createAgent } from "@ui-sdk/react/agent";
import { Input } from "@ui-sdk/react/input";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { Stepper, StepperContent, StepperItem, StepperList, StepperNext, StepperPrevious } from "@/components/ui/stepper";
import { exampleSteps, labels, navigationError, stages, type Stage } from "@/lib/stepper-onboarding";

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

const fieldClass = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function StepperAgentOnboarding() {
  const [stage, setStage] = React.useState<Stage>("business");
  const [name, setName] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [qr, setQr] = React.useState(false);
  const [qrTouched, setQrTouched] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [inspect, setInspect] = React.useState("");
  const running = React.useRef<AbortController | null>(null);

  React.useEffect(() => () => running.current?.abort(), []);

  function requestStage(target: string) {
    const error = navigationError(stage, target, name, currency);
    if (error) {
      setMessage(error);
      return false;
    }
    setStage(target as Stage);
    setMessage("");
    setConfirmed(false);
    return true;
  }

  function stop() {
    running.current?.abort();
  }

  async function prepare() {
    if (running.current || stage === "review") return;
    const controller = new AbortController();
    running.current = controller;
    setBusy(true);
    setMessage("Preparing your example…");
    try {
      const agent = getBridge();
      const result = await agent.act({ steps: exampleSteps(stage, name, currency, qrTouched) }, { signal: controller.signal });
      if (controller.signal.aborted) setMessage("Paused. Continue by hand or resume.");
      else if (result.ok) setMessage("Draft prepared. Review before confirming.");
      else setMessage("A change was blocked. Check the fields or open the action details.");
      setInspect(JSON.stringify(result, null, 2));
    } catch {
      setMessage(controller.signal.aborted ? "Paused." : "The bridge could not finish. You can continue manually.");
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
        <p className="text-sm text-muted-foreground">Do it yourself, or let the assistant prepare a sample. You stay in control.</p>
      </header>
      <section onPointerDownCapture={(event) => { if (event.nativeEvent.isTrusted) stop(); }} onKeyDownCapture={(event) => { if (event.nativeEvent.isTrusted) stop(); }} className="rounded-2xl border border-border p-4 sm:p-6">
        <AgentProgress aria-label="Onboarding progress" value={stage} onValueChange={(value, details) => { if (!requestStage(value)) details.cancel(); }}>
          <Stepper steps={stages.map((value) => ({ value }))} value={stage} onValueChange={requestStage}>
            <StepperList>
              {stages.map((value) => <StepperItem key={value} value={value}>{labels[value]}</StepperItem>)}
            </StepperList>
            <div className="grid min-w-0 grid-cols-1 items-start">
              <StepperContent {...panel("business")}>
                <h2 className="text-lg font-medium">Make it yours.</h2>
                <label className="grid gap-2 text-sm">Business name
                  <Input aria-label="Business name" name="business" value={name} onValueChange={setName} placeholder="Your café" className={fieldClass} />
                </label>
                <p className="text-xs text-muted-foreground">The name your customers will see.</p>
              </StepperContent>
              <StepperContent {...panel("preferences")}>
                <h2 className="text-lg font-medium">Set your preferences.</h2>
                <label className="grid gap-2 text-sm">Currency
                  <Input aria-label="Currency" name="currency" value={currency} onValueChange={setCurrency} placeholder="PEN or USD" className={fieldClass} />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>QR payments</span>
                  <Switch aria-label="QR payments" checked={qr} onCheckedChange={(value) => { setQr(value); setQrTouched(true); }} className="group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border bg-muted p-0.5 data-checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
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
                <button type="button" onClick={() => setConfirmed(true)} disabled={confirmed} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{confirmed ? "Confirmed locally" : "Confirm setup"}</button>
              </StepperContent>
            </div>
            <div className="flex justify-between gap-3 border-t pt-4">
              <StepperPrevious className="rounded-full">Back</StepperPrevious>
              <StepperNext className="rounded-full">Continue</StepperNext>
            </div>
          </Stepper>
        </AgentProgress>
      </section>
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <button type="button" disabled={busy || stage === "review"} onClick={prepare} className="rounded-full border border-border px-4 py-2 text-sm font-medium disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{busy ? "Preparing…" : "Prepare example"}</button>
          {busy && <button type="button" onClick={stop} className="rounded-full border px-3 py-2 text-sm">Stop</button>}
        </div>
        <p className="text-xs text-muted-foreground">Café Studio · PEN · QR enabled. Existing choices are preserved.</p>
        <p role="status" className="min-h-5 text-xs text-muted-foreground">{message}</p>
      </div>
      <details className="border-t pt-4 text-sm text-muted-foreground">
        <summary className="cursor-pointer">Developer details</summary>
        <button type="button" onClick={() => setInspect(JSON.stringify(getBridge().snapshot(), null, 2))} className="mt-3 rounded-full border px-3 py-2 text-xs">Inspect SDK snapshot</button>
        {inspect && <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all text-[11px]">{inspect}</pre>}
        <p className="mt-3 text-xs">Actual UI SDK actions; a deterministic local example, not an LLM. No external submissions.</p>
      </details>
    </main>
  );
}
