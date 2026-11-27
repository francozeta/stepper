"use client";

import * as React from "react";
import Link from "next/link";
import {
  Stepper, StepperContent, StepperItem, StepperList,
  StepperNext, StepperPrevious,
} from "@/components/ui/stepper";

const steps = [{ value: "account" }, { value: "preferences" }, { value: "review" }] as const;
type Stage = (typeof steps)[number]["value"];

// Lab only. Retarget from the in-flight visual height rather than replaying
// from the last committed height. Keep the actual content in normal flow.
function AdaptiveHeight({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const outer = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const frame = outer.current;
    const content = inner.current;
    if (!frame || !content || !enabled || typeof ResizeObserver === "undefined" || typeof frame.animate !== "function") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = content.getBoundingClientRect().height;
    let active: Animation | undefined;
    function stop() {
      active?.cancel();
      active = undefined;
      if (frame) frame.style.height = "";
    }
    const observer = new ResizeObserver(() => {
      if (!frame || !content) return;
      const next = content.getBoundingClientRect().height;
      if (Math.abs(next - target) < 0.5) return;
      const from = active ? frame.getBoundingClientRect().height : target;
      target = next;
      stop();
      if (reduced.matches) return;
      frame.style.height = next + "px";
      const animation = frame.animate(
        [{ height: from + "px" }, { height: next + "px" }],
        { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
      active = animation;
      animation.onfinish = () => {
        if (active === animation) stop();
      };
    });
    observer.observe(content);
    function onMotionChange() { if (reduced.matches) stop(); }
    reduced.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", onMotionChange);
      stop();
    };
  }, [enabled]);
  return (
    <div ref={outer} className={enabled ? "overflow-clip" : undefined}>
      <div ref={inner} className="flow-root">{children}</div>
    </div>
  );
}

function Field({ label, ...props }: React.ComponentProps<"input"> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span>{label}</span>
      <input className="h-10 rounded-lg border border-border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" {...props} />
    </label>
  );
}

export function StepperInteractionLab() {
  const [mode, setMode] = React.useState<"instant" | "adaptive">("adaptive");
  const [stage, setStage] = React.useState<Stage>("account");
  const [name, setName] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [history, setHistory] = React.useState<Stage[]>(["account"]);

  function navigate(next: Stage) {
    if (next === stage) return;
    setStage(next);
    setHistory((previous) => [...previous.slice(-7), next]);
  }

  return (
    <main className="mx-auto grid min-h-dvh max-w-xl content-start gap-8 px-5 py-8 sm:py-14">
      <header className="grid gap-3">
        <Link href="/docs" className="w-fit text-xs text-muted-foreground hover:text-foreground">Stepper / Research</Link>
        <h1 className="text-2xl font-medium tracking-tight">Make progress feel natural.</h1>
        <p className="text-sm text-muted-foreground">Same primitive. Same workflow. Two ways to handle a change in height.</p>
      </header>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-2 text-xs text-muted-foreground">Layout behavior</legend>
        {(["instant", "adaptive"] as const).map((value) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm">
            <input type="radio" name="layout" checked={mode === value} onChange={() => setMode(value)} />
            {value === "instant" ? "Instant / baseline" : "Adaptive / experiment"}
          </label>
        ))}
      </fieldset>
      <section className="rounded-2xl border border-border p-4 sm:p-6">
        <Stepper steps={steps} value={stage} onValueChange={navigate}>
          <StepperList>
            <StepperItem value="account">Account</StepperItem>
            <StepperItem value="preferences">Preferences</StepperItem>
            <StepperItem value="review">Review</StepperItem>
          </StepperList>
          <AdaptiveHeight enabled={mode === "adaptive"}>
            <StepperContent value="account" keepMounted className="space-y-4 border-0 bg-transparent p-1 shadow-none">
              <h2 className="text-lg font-medium">Start with the essentials.</h2>
              <Field label="Workspace name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Studio" />
            </StepperContent>
            <StepperContent value="preferences" keepMounted className="space-y-4 border-0 bg-transparent p-1 shadow-none">
              <h2 className="text-lg font-medium">Make it yours.</h2>
              <p className="text-sm text-muted-foreground">Change the content height, then move quickly between stages.</p>
              <Field label="Timezone" placeholder="America/Lima" />
              <Field label="Language" placeholder="English" />
              <button type="button" aria-expanded={expanded} aria-controls="lab-extra" className="text-sm underline underline-offset-4" onClick={() => setExpanded((value) => !value)}>Advanced preferences</button>
              <div id="lab-extra" hidden={!expanded} className="space-y-3">
                <Field label="Team name" />
                <Field label="Default view" />
              </div>
            </StepperContent>
            <StepperContent value="review" keepMounted className="space-y-4 border-0 bg-transparent p-1 shadow-none">
              <h2 className="text-lg font-medium">Everything in place.</h2>
              <p className="text-sm text-muted-foreground">Workspace: {name || "Untitled"}</p>
            </StepperContent>
          </AdaptiveHeight>
          <div className="flex justify-between gap-3 border-t pt-4">
            <StepperPrevious className="rounded-full">Back</StepperPrevious>
            <StepperNext className="rounded-full">Continue</StepperNext>
          </div>
        </Stepper>
      </section>
      <section className="grid gap-3 text-sm">
        <h2 className="font-medium">Navigation trace</h2>
        <p className="break-words font-mono text-xs text-muted-foreground">{history.join(" → ")}</p>
        <p className="text-muted-foreground">Try jumping across stages while the layout is moving, expanding preferences mid-transition, returning to Account, and enabling reduced motion in your OS.</p>
        <p className="text-xs text-muted-foreground">Experimental native animation, not a benchmark or a registry component.</p>
      </section>
    </main>
  );
}
