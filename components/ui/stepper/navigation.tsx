"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

import { useStepperContext } from "./context";
import type { StepperNextProps, StepperPreviousProps } from "./types";

async function resolveNavigationGuard(
  guard: (() => boolean | Promise<boolean>) | undefined
) {
  if (!guard) {
    return true;
  }

  return (await guard()) !== false;
}

function StepperPrevious({
  asChild = false,
  className,
  children = "Previous",
  disabled,
  onBeforePrevious,
  onClick,
  tabIndex,
  ...props
}: StepperPreviousProps) {
  const { canGoPrevious, goPrevious } = useStepperContext("StepperPrevious");
  const [isPending, setIsPending] = React.useState(false);
  const isDisabled = disabled || !canGoPrevious || isPending;
  const Comp = asChild ? Slot : "button";

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
      onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (isDisabled) {
          event.preventDefault();
          return;
        }

        if (event.defaultPrevented) {
          return;
        }

        setIsPending(true);

        try {
          const canNavigate = await resolveNavigationGuard(onBeforePrevious);

          if (canNavigate) {
            goPrevious();
          }
        } finally {
          setIsPending(false);
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
  onBeforeNext,
  onClick,
  tabIndex,
  ...props
}: StepperNextProps) {
  const { canGoNext, goNext } = useStepperContext("StepperNext");
  const [isPending, setIsPending] = React.useState(false);
  const isDisabled = disabled || !canGoNext || isPending;
  const Comp = asChild ? Slot : "button";

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
      onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (isDisabled) {
          event.preventDefault();
          return;
        }

        if (event.defaultPrevented) {
          return;
        }

        setIsPending(true);

        try {
          const canNavigate = await resolveNavigationGuard(onBeforeNext);

          if (canNavigate) {
            goNext();
          }
        } finally {
          setIsPending(false);
        }
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { StepperNext, StepperPrevious };
