"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type StepperOrientation = "horizontal" | "vertical";
type StepperStepState =
  | "inactive"
  | "active"
  | "completed"
  | "disabled"
  | "error";

type StepRecord = {
  value: string;
  disabled: boolean;
};

type RegisteredStep = StepRecord & {
  element: HTMLLIElement | null;
  order: number;
};

type StepperContextValue = {
  value: string | undefined;
  orientation: StepperOrientation;
  steps: StepRecord[];
  registerStep: (step: Omit<RegisteredStep, "order">) => void;
  unregisterStep: (value: string) => void;
  setValue: (value: string) => void;
  getStepIndex: (value: string) => number;
  getTriggerId: (value: string) => string;
  getContentId: (value: string) => string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goPrevious: () => void;
  goNext: () => void;
};

type StepperStepMeta = {
  currentValue: string | undefined;
  fallbackValue: string | undefined;
  selectedStep: StepRecord | undefined;
};

type StepperItemContextValue = {
  value: string;
  index: number;
  disabled: boolean;
  isActive: boolean;
  stepState: StepperStepState;
  orientation: StepperOrientation;
  setValue: (value: string) => void;
  triggerId: string;
  contentId: string;
};

const StepperContext = React.createContext<StepperContextValue | null>(null);
const StepperItemContext =
  React.createContext<StepperItemContextValue | null>(null);

function useStepperContext(component: string) {
  const context = React.useContext(StepperContext);

  if (!context) {
    throw new Error(`${component} must be used within Stepper`);
  }

  return context;
}

function useStepperItemContext(component: string) {
  const context = React.useContext(StepperItemContext);

  if (!context) {
    throw new Error(`${component} must be used within StepperItem`);
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

function getStepperStepMeta(
  steps: StepRecord[],
  selectedValue: string | undefined
): StepperStepMeta {
  const fallbackValue = steps.find((step) => !step.disabled)?.value;
  const selectedStep = steps.find((step) => step.value === selectedValue);
  const currentValue =
    selectedStep && !selectedStep.disabled ? selectedStep.value : fallbackValue;

  return {
    currentValue,
    fallbackValue,
    selectedStep,
  };
}

function toStepRecord(step: RegisteredStep): StepRecord {
  return {
    value: step.value,
    disabled: step.disabled,
  };
}

function sortRegisteredSteps(steps: RegisteredStep[]) {
  return [...steps].sort((firstStep, secondStep) => {
    const firstElement = firstStep.element;
    const secondElement = secondStep.element;

    if (
      firstElement &&
      secondElement &&
      firstElement !== secondElement &&
      typeof Node !== "undefined"
    ) {
      const position = firstElement.compareDocumentPosition(secondElement);

      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }

      if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }
    }

    return firstStep.order - secondStep.order;
  });
}

function areRegisteredStepsEqual(
  firstSteps: RegisteredStep[],
  secondSteps: RegisteredStep[]
) {
  if (firstSteps.length !== secondSteps.length) {
    return false;
  }

  return firstSteps.every((step, index) => {
    const nextStep = secondSteps[index];

    return (
      step.value === nextStep.value &&
      step.disabled === nextStep.disabled &&
      step.element === nextStep.element &&
      step.order === nextStep.order
    );
  });
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
  const collectedSteps = React.useMemo(() => collectSteps(children), [children]);
  const [registeredSteps, setRegisteredSteps] = React.useState<
    RegisteredStep[]
  >([]);
  const stepOrderRef = React.useRef(0);
  const steps = React.useMemo(
    () =>
      registeredSteps.length > 0
        ? registeredSteps.map(toStepRecord)
        : collectedSteps,
    [collectedSteps, registeredSteps]
  );
  const selectedValue = isControlled ? value : uncontrolledValue;
  const { currentValue } = React.useMemo(
    () => getStepperStepMeta(steps, selectedValue),
    [selectedValue, steps]
  );
  const previousStep = React.useMemo(
    () => getPreviousEnabledStep(steps, currentValue),
    [currentValue, steps]
  );
  const nextStep = React.useMemo(
    () => getNextEnabledStep(steps, currentValue),
    [currentValue, steps]
  );

  const registerStep = React.useCallback(
    (step: Omit<RegisteredStep, "order">) => {
      setRegisteredSteps((currentSteps) => {
        const existingStep = currentSteps.find(
          (currentStep) => currentStep.value === step.value
        );
        const nextStep: RegisteredStep = {
          ...step,
          order: existingStep?.order ?? stepOrderRef.current++,
        };
        const nextSteps = sortRegisteredSteps([
          ...currentSteps.filter(
            (currentStep) => currentStep.value !== step.value
          ),
          nextStep,
        ]);

        return areRegisteredStepsEqual(currentSteps, nextSteps)
          ? currentSteps
          : nextSteps;
      });
    },
    []
  );

  const unregisterStep = React.useCallback((stepValue: string) => {
    setRegisteredSteps((currentSteps) =>
      currentSteps.filter((step) => step.value !== stepValue)
    );
  }, []);

  const setStepperValue = React.useCallback(
    (nextValue: string) => {
      const nextStepRecord = steps.find((step) => step.value === nextValue);

      if (!nextStepRecord || nextStepRecord.disabled) {
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
      registerStep,
      unregisterStep,
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
      registerStep,
      setStepperValue,
      steps,
      unregisterStep,
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
        "flex min-w-0",
        "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:gap-3 data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:pb-2",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-4",
        "[&>li:last-child_[data-slot=stepper-separator]]:hidden",
        className
      )}
      {...props}
    />
  );
}

type StepperItemProps = Omit<
  React.ComponentPropsWithoutRef<"li">,
  "value"
> & {
  value: string;
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
};

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

  React.useEffect(() => {
    registerStep({
      value,
      disabled,
      element: itemRef.current,
    });

    return () => unregisterStep(value);
  }, [disabled, registerStep, unregisterStep, value]);

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

function hasStepperPrimitiveChild(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) {
      return false;
    }

    return (
      child.type === StepperTrigger ||
      child.type === StepperIndicator ||
      child.type === StepperLabel ||
      child.type === StepperDescription ||
      child.type === StepperSeparator
    );
  });
}

type StepperTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

function StepperTrigger({
  asChild = false,
  className,
  children,
  disabled,
  onClick,
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

type StepperIndicatorProps = React.ComponentPropsWithoutRef<"span">;

function StepperIndicator({
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { index, stepState } = useStepperItemContext("StepperIndicator");
  const content =
    children !== undefined
      ? children
      : stepState === "error"
        ? "!"
        : index >= 0
          ? index + 1
          : null;

  return (
    <span
      aria-hidden="true"
      data-slot="stepper-indicator"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground shadow-sm",
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
  );
}

type StepperLabelProps = React.ComponentPropsWithoutRef<"span">;

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

type StepperDescriptionProps = React.ComponentPropsWithoutRef<"span">;

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

type StepperSeparatorProps = React.ComponentPropsWithoutRef<"span">;

function StepperSeparator({ className, ...props }: StepperSeparatorProps) {
  const { orientation } = useStepperItemContext("StepperSeparator");

  return (
    <span
      aria-hidden="true"
      data-slot="stepper-separator"
      className={cn(
        "bg-muted-foreground/25",
        orientation === "horizontal" &&
          "absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-[1.125rem] h-px group-data-[state=completed]/stepper-item:bg-primary",
        orientation === "vertical" &&
          "absolute left-[1.125rem] top-11 h-[calc(100%-1.5rem)] w-px group-data-[state=completed]/stepper-item:bg-primary",
        className
      )}
      {...props}
    />
  );
}

type StepperContentProps = React.ComponentPropsWithoutRef<"div"> & {
  value: string;
  forceMount?: boolean;
  asChild?: boolean;
};

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
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground",
        "transition-[color,background-color,box-shadow,transform] hover:bg-muted hover:text-foreground active:scale-[0.96]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
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
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground",
        "transition-[background-color,box-shadow,transform] hover:bg-primary/90 active:scale-[0.96]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
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

export {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperSeparator,
  StepperTrigger,
};

export type {
  StepperButtonProps,
  StepperContentProps,
  StepperDescriptionProps,
  StepperIndicatorProps,
  StepperItemProps,
  StepperLabelProps,
  StepperListProps,
  StepperOrientation,
  StepperProps,
  StepperSeparatorProps,
  StepperStepState,
  StepperTriggerProps,
};
