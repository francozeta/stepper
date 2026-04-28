"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type StepperOrientation = "horizontal" | "vertical";

type StepRecord = {
  value: string;
  disabled: boolean;
};

type StepperContextValue = {
  value: string | undefined;
  orientation: StepperOrientation;
  steps: StepRecord[];
  setValue: (value: string) => void;
  getStepIndex: (value: string) => number;
  getTriggerId: (value: string) => string;
  getContentId: (value: string) => string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goPrevious: () => void;
  goNext: () => void;
};

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext(component: string) {
  const context = React.useContext(StepperContext);

  if (!context) {
    throw new Error(`${component} must be used within Stepper`);
  }

  return context;
}

function getSafeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function getNextEnabledStep(
  steps: StepRecord[],
  currentValue: string | undefined
) {
  const currentIndex = steps.findIndex((step) => step.value === currentValue);

  if (currentIndex === -1) {
    return undefined;
  }

  return steps.slice(currentIndex + 1).find((step) => !step.disabled);
}

function getPreviousEnabledStep(
  steps: StepRecord[],
  currentValue: string | undefined
) {
  const currentIndex = steps.findIndex((step) => step.value === currentValue);

  if (currentIndex === -1) {
    return undefined;
  }

  return steps
    .slice(0, currentIndex)
    .reverse()
    .find((step) => !step.disabled);
}

function collectSteps(children: React.ReactNode) {
  const steps: StepRecord[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === StepperItem) {
      const props = child.props as Pick<StepperItemProps, "disabled" | "value">;

      steps.push({
        value: props.value,
        disabled: Boolean(props.disabled),
      });

      return;
    }

    if (
      typeof child.props === "object" &&
      child.props !== null &&
      "children" in child.props
    ) {
      const childProps = child.props as { children?: React.ReactNode };

      collectSteps(childProps.children).forEach((step) => steps.push(step));
    }
  });

  return steps;
}

type StepperProps = React.ComponentPropsWithoutRef<"div"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: StepperOrientation;
};

function Stepper({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
  ...props
}: StepperProps) {
  const id = React.useId();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const steps = React.useMemo(() => collectSteps(children), [children]);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const fallbackValue = steps.find((step) => !step.disabled)?.value;
  const currentValue = selectedValue ?? fallbackValue;
  const previousStep = React.useMemo(
    () => getPreviousEnabledStep(steps, currentValue),
    [currentValue, steps]
  );
  const nextStep = React.useMemo(
    () => getNextEnabledStep(steps, currentValue),
    [currentValue, steps]
  );

  const setStepperValue = React.useCallback(
    (nextValue: string) => {
      const nextStepRecord = steps.find((step) => step.value === nextValue);

      if (nextStepRecord?.disabled) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange, steps]
  );

  const context = React.useMemo<StepperContextValue>(
    () => ({
      value: currentValue,
      orientation,
      steps,
      setValue: setStepperValue,
      getStepIndex: (stepValue) =>
        steps.findIndex((step) => step.value === stepValue),
      getTriggerId: (stepValue) => `${id}-trigger-${getSafeId(stepValue)}`,
      getContentId: (stepValue) => `${id}-content-${getSafeId(stepValue)}`,
      canGoPrevious: Boolean(previousStep),
      canGoNext: Boolean(nextStep),
      goPrevious: () => {
        if (previousStep) {
          setStepperValue(previousStep.value);
        }
      },
      goNext: () => {
        if (nextStep) {
          setStepperValue(nextStep.value);
        }
      },
    }),
    [
      currentValue,
      id,
      nextStep,
      orientation,
      previousStep,
      setStepperValue,
      steps,
    ]
  );

  return (
    <StepperContext.Provider value={context}>
      <div
        data-slot="stepper"
        data-orientation={orientation}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

type StepperListProps = React.ComponentPropsWithoutRef<"ol">;

function StepperList({ className, ...props }: StepperListProps) {
  const { orientation } = useStepperContext("StepperList");

  return (
    <ol
      data-slot="stepper-list"
      data-orientation={orientation}
      className={cn(
        "flex gap-4",
        "data-[orientation=horizontal]:items-start",
        "data-[orientation=vertical]:flex-col",
        "[&>li:last-child_[data-slot=stepper-separator]]:hidden",
        className
      )}
      {...props}
    />
  );
}

type StepperItemProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value"
> & {
  value: string;
  completed?: boolean;
  error?: boolean;
};

function StepperItem({
  value,
  completed = false,
  disabled = false,
  error = false,
  className,
  children,
  onClick,
  ...props
}: StepperItemProps) {
  const {
    value: currentValue,
    orientation,
    setValue,
    getStepIndex,
    getTriggerId,
    getContentId,
  } = useStepperContext("StepperItem");
  const index = getStepIndex(value);
  const isActive = currentValue === value;
  const stepState = isActive ? "active" : completed ? "completed" : "inactive";

  return (
    <li
      data-slot="stepper-item"
      data-orientation={orientation}
      data-state={stepState}
      className={cn(
        "group/stepper-item relative flex min-w-0",
        "data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:items-start",
        "data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-3"
      )}
    >
      <button
        id={getTriggerId(value)}
        type="button"
        aria-current={isActive ? "step" : undefined}
        aria-controls={isActive ? getContentId(value) : undefined}
        disabled={disabled}
        data-slot="stepper-trigger"
        data-state={stepState}
        data-disabled={disabled ? "" : undefined}
        data-error={error ? "" : undefined}
        className={cn(
          "group inline-flex min-w-0 items-center gap-2 rounded-md text-left text-sm font-medium outline-none",
          "text-muted-foreground transition-colors",
          "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=active]:text-foreground",
          "data-[state=completed]:text-foreground",
          "data-[error]:text-destructive",
          orientation === "horizontal" && "flex-col items-center text-center",
          orientation === "vertical" && "justify-start",
          className
        )}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            setValue(value);
          }
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          data-slot="stepper-indicator"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground",
            "group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground",
            "group-data-[state=completed]:border-primary group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground",
            "group-data-[error]:border-destructive group-data-[error]:bg-destructive group-data-[error]:text-destructive-foreground"
          )}
        >
          {error ? "!" : index >= 0 ? index + 1 : null}
        </span>
        <span data-slot="stepper-label" className="min-w-0 leading-none">
          {children}
        </span>
      </button>
      <span
        aria-hidden="true"
        data-slot="stepper-separator"
        className={cn(
          "bg-border",
          orientation === "horizontal" &&
            "mt-4 ml-4 h-px flex-1 group-data-[state=completed]/stepper-item:bg-primary",
          orientation === "vertical" &&
            "absolute left-4 top-9 h-[calc(100%-1rem)] w-px group-data-[state=completed]/stepper-item:bg-primary"
        )}
      />
    </li>
  );
}

type StepperContentProps = React.ComponentPropsWithoutRef<"div"> & {
  value: string;
};

function StepperContent({
  value,
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

  if (!isActive) {
    return null;
  }

  return (
    <div
      id={getContentId(value)}
      role="region"
      aria-labelledby={getTriggerId(value)}
      data-slot="stepper-content"
      data-state="active"
      className={cn(
        "rounded-md border border-border bg-background p-4 text-sm text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type StepperButtonProps = React.ComponentPropsWithoutRef<"button">;

function StepperPrevious({
  className,
  children = "Previous",
  disabled,
  onClick,
  ...props
}: StepperButtonProps) {
  const { canGoPrevious, goPrevious } = useStepperContext("StepperPrevious");

  return (
    <button
      type="button"
      disabled={disabled || !canGoPrevious}
      data-slot="stepper-previous"
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground",
        "transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          goPrevious();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function StepperNext({
  className,
  children = "Next",
  disabled,
  onClick,
  ...props
}: StepperButtonProps) {
  const { canGoNext, goNext } = useStepperContext("StepperNext");

  return (
    <button
      type="button"
      disabled={disabled || !canGoNext}
      data-slot="stepper-next"
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground",
        "transition-colors hover:bg-primary/90",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          goNext();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function StepperExample() {
  return (
    <Stepper defaultValue="account" orientation="horizontal">
      <StepperList>
        <StepperItem value="account" completed>
          Account
        </StepperItem>
        <StepperItem value="profile">Profile</StepperItem>
        <StepperItem value="payment" disabled>
          Payment
        </StepperItem>
      </StepperList>

      <StepperContent value="account">Account content</StepperContent>
      <StepperContent value="profile">Profile content</StepperContent>
      <StepperContent value="payment">Payment content</StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        <StepperNext />
      </div>
    </Stepper>
  );
}

export {
  Stepper,
  StepperContent,
  StepperExample,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
};

export type { StepperOrientation };
