"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

import { StepperItemContext, useStepperContext, useStepperItemContext } from "./context";
import type {
  StepperDescriptionProps,
  StepperIndicatorProps,
  StepperItemContextValue,
  StepperItemProps,
  StepperLabelProps,
  StepperSeparatorProps,
  StepperStepState,
  StepperTriggerProps,
} from "./types";
import {
  STEPPER_PRIMITIVES,
  hasStepperPrimitiveChild,
  markStepperPrimitive,
} from "./utils";

function StepperItem({
  value,
  completed = false,
  disabled = false,
  error = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const {
    value: currentValue,
    orientation,
    registerStep,
    unregisterStep,
    setValue,
    getStepIndex,
    getTriggerId,
    getContentId,
  } = useStepperContext("StepperItem");
  const itemRef = React.useRef<HTMLLIElement>(null);
  const index = getStepIndex(value);
  const isActive = currentValue === value;
  const stepState: StepperStepState = disabled
    ? "disabled"
    : error
      ? "error"
      : isActive
        ? "active"
        : completed
          ? "completed"
          : "inactive";
  const hasCustomChildren = hasStepperPrimitiveChild(children);

  React.useLayoutEffect(() => {
    registerStep({
      value,
      disabled,
      element: itemRef.current,
    });

    return () => unregisterStep(value);
  }, [disabled, registerStep, unregisterStep, value]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || index >= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      console.warn(
        `StepperItem with value "${value}" could not be found in the Stepper order. Check that it is rendered inside StepperList and not hidden behind an unsupported wrapper.`
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [index, value]);

  const itemContext = React.useMemo<StepperItemContextValue>(
    () => ({
      value,
      index,
      disabled,
      isActive,
      stepState,
      orientation,
      setValue,
      triggerId: getTriggerId(value),
      contentId: getContentId(value),
    }),
    [
      value,
      index,
      disabled,
      isActive,
      stepState,
      orientation,
      setValue,
      getTriggerId,
      getContentId,
    ]
  );

  return (
    <li
      ref={itemRef}
      data-slot="stepper-item"
      data-orientation={orientation}
      data-state={stepState}
      data-disabled={disabled ? "" : undefined}
      data-error={error ? "" : undefined}
      data-completed={completed ? "" : undefined}
      className={cn(
        "group/stepper-item relative flex min-w-0",
        "[--stepper-indicator-size:2.25rem] [--stepper-separator-offset:calc(var(--stepper-indicator-size)/2+0.125rem)]",
        "data-[orientation=horizontal]:min-w-24 data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center",
        "data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-3",
        className
      )}
      {...props}
    >
      <StepperItemContext.Provider value={itemContext}>
        {hasCustomChildren ? (
          children
        ) : (
          <>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>{children}</StepperLabel>
            </StepperTrigger>
            <StepperSeparator />
          </>
        )}
      </StepperItemContext.Provider>
    </li>
  );
}

function StepperTrigger({
  asChild = false,
  className,
  children,
  disabled,
  onClick,
  tabIndex,
  ...props
}: StepperTriggerProps) {
  const {
    value,
    disabled: itemDisabled,
    isActive,
    stepState,
    orientation,
    setValue,
    triggerId,
    contentId,
  } = useStepperItemContext("StepperTrigger");
  const isDisabled = itemDisabled || disabled;
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      id={triggerId}
      type={asChild ? undefined : "button"}
      aria-current={isActive ? "step" : undefined}
      aria-controls={isActive ? contentId : undefined}
      aria-disabled={isDisabled ? true : undefined}
      disabled={asChild ? undefined : isDisabled}
      tabIndex={asChild && isDisabled ? -1 : tabIndex}
      data-slot="stepper-trigger"
      data-state={stepState}
      data-disabled={isDisabled ? "" : undefined}
      className={cn(
        "group inline-flex min-h-10 min-w-0 items-center gap-2 rounded-md text-left text-sm font-medium outline-none",
        "text-muted-foreground transition-[color,background-color,box-shadow,transform] active:scale-[0.96]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[state=active]:text-foreground",
        "data-[state=completed]:text-foreground",
        "data-[state=error]:text-destructive",
        orientation === "horizontal" && "w-full flex-col items-center text-center",
        orientation === "vertical" && "justify-start",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (isDisabled) {
          event.preventDefault();
          return;
        }

        if (!event.defaultPrevented) {
          setValue(value);
        }
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

function StepperIndicator({
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { index, stepState } = useStepperItemContext("StepperIndicator");
  const stepNumber = index >= 0 ? index + 1 : undefined;
  const content =
    children !== undefined
      ? children
      : stepState === "error"
        ? "!"
        : stepNumber
          ? stepNumber
          : null;

  return (
    <>
      {stepNumber ? (
        <span className="sr-only">Step {stepNumber}:</span>
      ) : null}
      <span
        aria-hidden="true"
        data-slot="stepper-indicator"
        className={cn(
          "flex size-(--stepper-indicator-size) shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground shadow-sm",
          "group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground",
          "group-data-[state=completed]:border-primary group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground",
          "group-data-[state=error]:border-destructive group-data-[state=error]:bg-destructive group-data-[state=error]:text-destructive-foreground",
          "[&>svg]:size-4 [&>svg]:shrink-0",
          className
        )}
        {...props}
      >
        {content}
      </span>
    </>
  );
}

function StepperLabel({ className, ...props }: StepperLabelProps) {
  const { orientation } = useStepperItemContext("StepperLabel");

  return (
    <span
      data-slot="stepper-label"
      className={cn(
        "min-w-0 leading-none",
        orientation === "horizontal" && "max-w-24 truncate",
        className
      )}
      {...props}
    />
  );
}

function StepperDescription({ className, ...props }: StepperDescriptionProps) {
  return (
    <span
      data-slot="stepper-description"
      className={cn(
        "text-xs leading-snug font-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function StepperSeparator({ className, ...props }: StepperSeparatorProps) {
  const { orientation } = useStepperItemContext("StepperSeparator");

  return (
    <span
      aria-hidden="true"
      data-slot="stepper-separator"
      className={cn(
        "bg-muted-foreground/25",
        orientation === "horizontal" &&
          "absolute left-[calc(50%+var(--stepper-separator-offset))] right-[calc(-50%+var(--stepper-separator-offset))] top-[calc(var(--stepper-indicator-size)/2)] h-px group-data-[state=completed]/stepper-item:bg-primary",
        orientation === "vertical" &&
          "absolute left-[calc(var(--stepper-indicator-size)/2)] top-[calc(var(--stepper-indicator-size)+0.5rem)] h-[calc(100%-var(--stepper-indicator-size)+0.75rem)] w-px group-data-[state=completed]/stepper-item:bg-primary",
        className
      )}
      {...props}
    />
  );
}

markStepperPrimitive(StepperItem, STEPPER_PRIMITIVES.item);
markStepperPrimitive(StepperTrigger, STEPPER_PRIMITIVES.trigger);
markStepperPrimitive(StepperIndicator, STEPPER_PRIMITIVES.indicator);
markStepperPrimitive(StepperLabel, STEPPER_PRIMITIVES.label);
markStepperPrimitive(StepperDescription, STEPPER_PRIMITIVES.description);
markStepperPrimitive(StepperSeparator, STEPPER_PRIMITIVES.separator);

export {
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperSeparator,
  StepperTrigger,
};
