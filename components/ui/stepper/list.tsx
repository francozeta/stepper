"use client";

import { cn } from "@/lib/utils";

import { StepperListContext, useStepperContext } from "./context";
import type { StepperListProps } from "./types";

function StepperList({
  className,
  "aria-label": ariaLabel = "Progress steps",
  children,
  ...props
}: StepperListProps) {
  const { orientation } = useStepperContext("StepperList");

  return (
    <StepperListContext.Provider value>
      <ol
        aria-label={props["aria-labelledby"] ? undefined : ariaLabel}
        data-slot="stepper-list"
        data-orientation={orientation}
        className={cn(
          "flex min-w-0",
          "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:gap-3 data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:pb-2",
          "data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-4",
          "[&>li:last-child_[data-slot=stepper-separator]]:hidden",
          className
        )}
        {...props}
      >
        {children}
      </ol>
    </StepperListContext.Provider>
  );
}

export { StepperList };
