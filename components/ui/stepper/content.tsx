"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

import { useStepperContext } from "./context";
import type { StepperContentProps } from "./types";
import { STEPPER_PRIMITIVES, markStepperPrimitive } from "./utils";

function StepperContent({
  value,
  forceMount = false,
  asChild = false,
  className,
  children,
  ...props
}: StepperContentProps) {
  const {
    value: currentValue,
    steps,
    getTriggerId,
    getContentId,
  } = useStepperContext("StepperContent");
  const isActive = currentValue === value;
  const hasMatchingStep = steps.some((step) => step.value === value);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || hasMatchingStep) {
      return;
    }

    const timeout = window.setTimeout(() => {
      console.warn(
        `StepperContent value "${value}" does not match any StepperItem. Content values should map to a step value.`
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [hasMatchingStep, value]);

  if (!forceMount && !isActive) {
    return null;
  }

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      id={getContentId(value)}
      role="region"
      aria-labelledby={getTriggerId(value)}
      data-slot="stepper-content"
      data-state={isActive ? "active" : "inactive"}
      hidden={forceMount ? !isActive : undefined}
      className={cn(
        "rounded-lg border border-border/70 bg-muted/25 p-4 text-sm text-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

markStepperPrimitive(StepperContent, STEPPER_PRIMITIVES.content);

export { StepperContent };
