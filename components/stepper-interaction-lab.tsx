"use client";

import * as React from "react";
import Link from "next/link";
import {
  Stepper, StepperContent, StepperItem, StepperList,
  StepperNext, StepperPrevious,
} from "@/components/ui/stepper";

const steps = [{ value: "account" }, { value: "preferences" }, { value: "review" }] as const;
type Stage = (typeof steps)[number]["value"];
type LayoutMode = "instant" | "adaptive" | "spatial" | "continuity";

// Lab only. Retarget from the in-flight visual height rather than replaying
// from the last committed height. Keep the actual content in normal flow.
function AdaptiveHeight({ enabled, spatial, children }: { enabled: boolean; spatial: boolean; children: React.ReactNode }) {
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
      <div ref={inner} className={spatial ? "grid min-w-0 grid-cols-1 items-start" : "flow-root"}>{children}</div>
    </div>
  );
}

// The largest real panel determines the shared grid track. Inactive panels
// stay in layout for intrinsic sizing, but cannot be read or interacted with.
function spatialPanel(mode: LayoutMode, stage: Stage, value: Stage): React.ComponentProps<typeof StepperContent> {
  if (mode !== "spatial" && mode !== "continuity") return { value };
  const inactive = stage !== value;
  return {
    value,
    hidden: false,
    inert: inactive,
    "aria-hidden": inactive ? true : undefined,
    style: { gridArea: "1 / 1", visibility: inactive ? "hidden" : "visible" },
  };
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
  const [mode, setMode] = React.useState<LayoutMode>("spatial");
  const [stage, setStage] = React.useState<Stage>("account");
  const [name, setName] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [history, setHistory] = React.useState<Stage[]>(["account"]);
  const surface = React.useRef<HTMLElement>(null);
  const previousStage = React.useRef<Stage>(stage);
  const focusDestination = React.useRef(false);
  const spatial = mode === "spatial" || mode === "continuity";

  // Only the newly visible panel moves; the navigation and grid stay put.
  // Cancel an obsolete animation when another stage is selected.
  React.useLayoutEffect(() => {
    const previous = previousStage.current;
    previousStage.current = stage;
    if (previous === stage || mode !== "continuity") return;
    const panel = surface.current?.querySelector<HTMLElement>('[data-slot="stepper-content"][data-state="active"]');
    if (!panel) return;
    if (focusDestination.current) {
      focusDestination.current = false;
      panel.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    }
    if (typeof panel.animate !== "function" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const forward = steps.findIndex((item) => item.value === stage) > steps.findIndex((item) => item.value === previous);
    const rtl = getComputedStyle(panel).direction === "rtl";
    const offset = (forward === rtl ? -1 : 1) * 8;
    const animation = panel.animate(
      [{ transform: "translateX(" + offset + "px)", opacity: 0.65 }, { transform: "translateX(0)", opacity: 1 }],
      { duration: 160, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
    function onMotionChange() { if (media.matches) animation.cancel(); }
    media.addEventListener("change", onMotionChange);
    return () => {
      media.removeEventListener("change", onMotionChange);
      animation.cancel();
    };
  }, [stage, mode]);

  function requestBoundaryFocus(event: React.MouseEvent<HTMLButtonElement>, destination: Stage) {
    // Keyboard activation at a boundary disables the old action. Move focus
    // to the destination heading instead of losing it to the document body.
    if (mode === "continuity" && event.detail === 0 && !event.defaultPrevented && destination !== stage) {
      focusDestination.current = true;
    }
  }

  function navigate(next: Stage) {
    if (next === stage) return;
    if (mode === "continuity" && surface.current?.querySelector('[data-slot="stepper-content"][data-state="active"]')?.contains(document.activeElement)) {
      focusDestination.current = true;
    }
    setStage(next);
    setHistory((previous) => [...previous.slice(-7), next]);
  }

  return (
    <main className="mx-auto grid min-h-dvh max-w-xl content-start gap-8 px-5 py-8 sm:py-14">
      <header className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href="/docs" className="w-fit text-xs text-muted-foreground hover:text-foreground">Stepper / Research</Link>
          <Link href="/drafts/handoff" className="text-xs text-muted-foreground hover:text-foreground">Next experiment: Handoff →</Link>
        </div>
        <h1 className="text-2xl font-medium tracking-tight">Make progress feel natural.</h1>
        <p className="text-sm text-muted-foreground">Same primitive. Same workflow. Four ways to explore layout and continuity.</p>
      </header>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-2 text-xs text-muted-foreground">Layout behavior</legend>
        {(["instant", "adaptive", "spatial", "continuity"] as const).map((value) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm">
            <input type="radio" name="layout" checked={mode === value} onChange={() => setMode(value)} />
            {value === "instant" ? "Instant" : value === "adaptive" ? "Adaptive" : value === "spatial" ? "Spatial" : "Continuity"}
          </label>
        ))}
      </fieldset>
      <p className="-mt-5 text-xs text-muted-foreground" aria-live="polite">{mode === "instant" ? "The panel and controls follow content immediately." : mode === "adaptive" ? "The panel and controls move together with an animated height." : mode === "spatial" ? "A shared intrinsic height keeps navigation in place when switching steps." : "Stable navigation, directional panel motion, and keyboard focus recovery."}</p>
      <section ref={surface} className="rounded-2xl border border-border p-4 sm:p-6">
        <Stepper steps={steps} value={stage} onValueChange={navigate}>
          <StepperList>
            <StepperItem value="account">Account</StepperItem>
            <StepperItem value="preferences">Preferences</StepperItem>
            <StepperItem value="review">Review</StepperItem>
          </StepperList>
          <AdaptiveHeight enabled={mode === "adaptive"} spatial={spatial}>
            <StepperContent {...spatialPanel(mode, stage, "account")} keepMounted className="space-y-4 border-0 bg-transparent p-1 shadow-none">
              <h2 tabIndex={-1} className="text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Start with the essentials.</h2>
              <Field label="Workspace name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Studio" />
            </StepperContent>
            <StepperContent {...spatialPanel(mode, stage, "preferences")} keepMounted className="space-y-4 border-0 bg-transparent p-1 shadow-none">
              <h2 tabIndex={-1} className="text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Make it yours.</h2>
              <p className="text-sm text-muted-foreground">Change the content height, then move quickly between stages.</p>
              <Field label="Timezone" placeholder="America/Lima" />
              <Field label="Language" placeholder="English" />
              <button type="button" aria-expanded={expanded} aria-controls="lab-extra" className="text-sm underline underline-offset-4" onClick={() => setExpanded((value) => !value)}>Advanced preferences</button>
              <div id="lab-extra" hidden={!expanded} className="space-y-3">
                <Field label="Team name" />
                <Field label="Default view" />
              </div>
            </StepperContent>
            <StepperContent {...spatialPanel(mode, stage, "review")} keepMounted className="space-y-4 border-0 bg-transparent p-1 shadow-none">
              <h2 tabIndex={-1} className="text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Everything in place.</h2>
              <p className="text-sm text-muted-foreground">Workspace: {name || "Untitled"}</p>
            </StepperContent>
          </AdaptiveHeight>
          <div data-lab-controls className="flex justify-between gap-3 border-t pt-4">
            <StepperPrevious className="rounded-full" onClick={(event) => { if (stage === "preferences") requestBoundaryFocus(event, "account"); }}>Back</StepperPrevious>
            <StepperNext className="rounded-full" onClick={(event) => { if (stage === "preferences") requestBoundaryFocus(event, "review"); }}>Continue</StepperNext>
          </div>
        </Stepper>
      </section>
      <section className="grid gap-3 text-sm">
        <h2 className="font-medium">Navigation trace</h2>
        <p className="break-words font-mono text-xs text-muted-foreground">{history.join(" → ")}</p>
        <p className="text-muted-foreground">Try rapid Continue / Back, compare the position of the controls in all four modes, expand preferences, and return to Account. Spatial reserves the tallest current panel, so expanding content or resizing the viewport can still move the controls.</p>
        <p className="text-xs text-muted-foreground">Experimental native layout and animation, not a benchmark or a registry component. Spatial and Continuity trade extra whitespace for more predictable control placement. Continuity cancels obsolete panel motion; full mid-flight visual reversal remains a later experiment.</p>
      </section>
    </main>
  );
}
