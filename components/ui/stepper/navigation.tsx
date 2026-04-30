"use client";

import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

import { useStepperContext } from "./context";
import type { StepperButtonProps } from "./types";

function StepperPrevious({
  asChild = false,
  className,
  children = "Previous",
  disabled,
  onClick,
  tabIndex,
  ...props
}: StepperButtonProps) {
  const { canGoPrevious, goPrevious } = useStepperContext("StepperPrevious");
  const isDisabled = disabled || !canGoPrevious;
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={asChild && isDisabled ? -1 : tabIndex}
      data-slot="stepper-previous"
      data-disabled={isDisabled ? "" : undefined}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground",
        "transition-[color,background-color,box-shadow,transform] hover:bg-muted hover:text-foreground active:scale-[0.96]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (isDisabled) {
          event.preventDefault();
          return;
        }

        if (!event.defaultPrevented) {
          goPrevious();
        }
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

function StepperNext({
  asChild = false,
  className,
  children = "Next",
  disabled,
  onClick,
  tabIndex,
  ...props
}: StepperButtonProps) {
  const { canGoNext, goNext } = useStepperContext("StepperNext");
  const isDisabled = disabled || !canGoNext;
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={asChild && isDisabled ? -1 : tabIndex}
      data-slot="stepper-next"
      data-disabled={isDisabled ? "" : undefined}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground",
        "transition-[background-color,box-shadow,transform] hover:bg-primary/90 active:scale-[0.96]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (isDisabled) {
          event.preventDefault();
          return;
        }

        if (!event.defaultPrevented) {
          goNext();
        }
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { StepperNext, StepperPrevious };
