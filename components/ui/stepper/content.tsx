"use client";

import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

import { useStepperContext } from "./context";
import type { StepperContentProps } from "./types";

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
    getTriggerId,
    getContentId,
  } = useStepperContext("StepperContent");
  const isActive = currentValue === value;

  if (!forceMount && !isActive) {
    return null;
  }

  const Comp = asChild ? Slot.Root : "div";

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

export { StepperContent };
