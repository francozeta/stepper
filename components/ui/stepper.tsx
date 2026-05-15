"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

type StepperOrientation = "horizontal" | "vertical";
type StepperValue = string;
type StepperStepPosition = "previous" | "current" | "next";
type StepperStepState =
  | "inactive"
  | "active"
  | "completed"
  | "disabled"
  | "error";

type StepperStepInput<TValue extends StepperValue = StepperValue> = {
  value: TValue;
  disabled?: boolean;
};

type StepperStep<TValue extends StepperValue = StepperValue> = {
  value: TValue;
  disabled: boolean;
};

type StepperStepsValue<TSteps extends readonly StepperStepInput[]> =
  TSteps[number]["value"];

type RegisteredStep<TValue extends StepperValue = StepperValue> =
  StepperStep<TValue> & {
    id: string;
    element: HTMLLIElement | null;
    order: number;
  };

type StepperNavigationGuard = () => boolean | Promise<boolean>;

type StepperApi<TValue extends StepperValue = StepperValue> = {
  value: TValue | undefined;
  orientation: StepperOrientation;
  steps: StepperStep<TValue>[];
  currentIndex: number;
  totalSteps: number;
  setValue: (value: TValue) => void;
  getStepIndex: (value: TValue) => number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goPrevious: () => void;
  goNext: () => void;
};

type StepperItemApi<TValue extends StepperValue = StepperValue> = {
  value: TValue;
  index: number;
  disabled: boolean;
  isActive: boolean;
  stepState: StepperStepState;
  stepPosition: StepperStepPosition;
  orientation: StepperOrientation;
  setValue: (value: TValue) => void;
  triggerId: string;
  contentId: string;
};

type StepperContextValue<TValue extends StepperValue = StepperValue> =
  StepperApi<TValue> & {
    isExplicitMode: boolean;
    registerStep: (step: Omit<RegisteredStep, "order">) => void;
    unregisterStep: (id: string) => void;
    getTriggerId: (value: TValue) => string;
    getContentId: (value: TValue) => string;
  };

type StepperItemContextValue<TValue extends StepperValue = StepperValue> =
  StepperItemApi<TValue>;

type StepperProps<TValue extends StepperValue = StepperValue> =
  React.ComponentPropsWithoutRef<"div"> & {
    value?: TValue;
    defaultValue?: TValue;
    onValueChange?: (value: TValue) => void;
    orientation?: StepperOrientation;
    steps?: readonly StepperStepInput<TValue>[];
  };

type StepperPropsWithSteps<
  TSteps extends readonly StepperStepInput[],
> = Omit<StepperProps<StepperStepsValue<TSteps>>, "steps"> & {
  steps: TSteps;
};

type StepperPropsWithoutSteps<
  TValue extends StepperValue = StepperValue,
> = Omit<StepperProps<TValue>, "steps"> & {
  steps?: undefined;
};

type StepperListProps = React.ComponentPropsWithoutRef<"ol">;

type StepperItemProps<TValue extends StepperValue = StepperValue> = Omit<
  React.ComponentPropsWithoutRef<"li">,
  "value"
> & {
  value: TValue;
  completed?: boolean;
  defaultTrigger?: boolean;
  disabled?: boolean;
  error?: boolean;
  separator?: boolean;
};

type StepperTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

type StepperIndicatorProps = React.ComponentPropsWithoutRef<"span">;

type StepperLabelProps = React.ComponentPropsWithoutRef<"span">;

type StepperDescriptionProps = React.ComponentPropsWithoutRef<"span">;

type StepperSeparatorProps = React.ComponentPropsWithoutRef<"span">;

type StepperContentProps<TValue extends StepperValue = StepperValue> =
  React.ComponentPropsWithoutRef<"div"> & {
    value: TValue;
    forceMount?: boolean;
    keepMounted?: boolean;
    asChild?: boolean;
  };

type StepperButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

type StepperPreviousProps = StepperButtonProps & {
  onBeforePrevious?: StepperNavigationGuard;
};

type StepperNextProps = StepperButtonProps & {
  onBeforeNext?: StepperNavigationGuard;
};

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

const isDevelopment = process.env.NODE_ENV !== "production";

function warnDev(message: string) {
  if (isDevelopment) {
    console.warn(message);
  }
}

function getSafeId(value: StepperValue) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function normalizeStep<TValue extends StepperValue>(
  step: StepperStepInput<TValue>
): StepperStep<TValue> {
  return {
    value: step.value,
    disabled: Boolean(step.disabled),
  };
}

function normalizeSteps<TValue extends StepperValue>(
  steps: readonly StepperStepInput<TValue>[] | undefined
) {
  return steps?.map(normalizeStep) ?? [];
}

function getDuplicateStepValues<TValue extends StepperValue>(
  steps: ReadonlyArray<{ value: TValue }>
) {
  const seenValues = new Set<TValue>();
  const duplicateValues = new Set<TValue>();

  steps.forEach((step) => {
    if (seenValues.has(step.value)) {
      duplicateValues.add(step.value);
      return;
    }

    seenValues.add(step.value);
  });

  return Array.from(duplicateValues);
}

function getStepByValue<TValue extends StepperValue>(
  steps: readonly StepperStep<TValue>[],
  value: TValue | undefined
) {
  return steps.find((step) => step.value === value);
}

function getCurrentStepValue<TValue extends StepperValue>(
  steps: readonly StepperStep<TValue>[],
  selectedValue: TValue | undefined
) {
  const selectedStep = getStepByValue(steps, selectedValue);

  if (selectedStep && !selectedStep.disabled) {
    return selectedStep.value;
  }

  return steps.find((step) => !step.disabled)?.value;
}

function getNextEnabledStep<TValue extends StepperValue>(
  steps: readonly StepperStep<TValue>[],
  currentValue: TValue | undefined
) {
  const currentIndex = steps.findIndex((step) => step.value === currentValue);

  if (currentIndex === -1) {
    return undefined;
  }

  return steps.slice(currentIndex + 1).find((step) => !step.disabled);
}

function getPreviousEnabledStep<TValue extends StepperValue>(
  steps: readonly StepperStep<TValue>[],
  currentValue: TValue | undefined
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
      step.id === nextStep.id &&
      step.value === nextStep.value &&
      step.disabled === nextStep.disabled &&
      step.element === nextStep.element &&
      step.order === nextStep.order
    );
  });
}

function getKeyboardNavigationStepValue<TValue extends StepperValue>({
  key,
  orientation,
  steps,
  value,
}: {
  key: string;
  orientation: StepperOrientation;
  steps: readonly StepperStep<TValue>[];
  value: TValue;
}) {
  const enabledSteps = steps.filter((step) => !step.disabled);
  const currentIndex = enabledSteps.findIndex((step) => step.value === value);

  if (currentIndex < 0) {
    return undefined;
  }

  if (key === "Home") {
    return enabledSteps.at(0)?.value;
  }

  if (key === "End") {
    return enabledSteps.at(-1)?.value;
  }

  if (
    (orientation === "horizontal" && key === "ArrowRight") ||
    (orientation === "vertical" && key === "ArrowDown")
  ) {
    return enabledSteps[Math.min(currentIndex + 1, enabledSteps.length - 1)]
      ?.value;
  }

  if (
    (orientation === "horizontal" && key === "ArrowLeft") ||
    (orientation === "vertical" && key === "ArrowUp")
  ) {
    return enabledSteps[Math.max(currentIndex - 1, 0)]?.value;
  }

  return undefined;
}

async function resolveNavigationGuard(
  guard: StepperNavigationGuard | undefined
) {
  if (!guard) {
    return true;
  }

  return (await guard()) !== false;
}

function setDisplayName(component: object, displayName: string) {
  (component as { displayName?: string }).displayName = displayName;
}

// ----------------------------------------------------------------------------
// Context
// ----------------------------------------------------------------------------

const StepperContext = React.createContext<StepperContextValue | null>(null);
const StepperItemContext =
  React.createContext<StepperItemContextValue | null>(null);
const StepperListContext = React.createContext(false);

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

function useStepperListContext() {
  return React.useContext(StepperListContext);
}

// ----------------------------------------------------------------------------
// Internal Hooks
// ----------------------------------------------------------------------------

function useRegisteredSteps() {
  const [registeredSteps, setRegisteredSteps] = React.useState<
    RegisteredStep[]
  >([]);
  const stepOrderRef = React.useRef(0);

  const registerStep = React.useCallback(
    (step: Omit<RegisteredStep, "order">) => {
      setRegisteredSteps((currentSteps) => {
        if (currentSteps.length === 0) {
          stepOrderRef.current = 0;
        }

        const existingStep = currentSteps.find(
          (currentStep) => currentStep.id === step.id
        );
        const nextStepRecord: RegisteredStep = {
          ...step,
          order: existingStep?.order ?? stepOrderRef.current++,
        };
        const nextSteps = sortRegisteredSteps([
          ...currentSteps.filter(
            (currentStep) => currentStep.id !== step.id
          ),
          nextStepRecord,
        ]);

        return areRegisteredStepsEqual(currentSteps, nextSteps)
          ? currentSteps
          : nextSteps;
      });
    },
    []
  );

  const unregisterStep = React.useCallback((stepId: string) => {
    setRegisteredSteps((currentSteps) =>
      currentSteps.filter((step) => step.id !== stepId)
    );
  }, []);

  return {
    registeredSteps,
    registerStep,
    unregisterStep,
  };
}

function useStepperSteps(
  stepsProp: readonly StepperStepInput[] | undefined,
  registeredSteps: RegisteredStep[]
) {
  const isExplicitMode = stepsProp !== undefined;
  const explicitSteps = React.useMemo(
    () => (isExplicitMode ? normalizeSteps(stepsProp) : undefined),
    [isExplicitMode, stepsProp]
  );
  const steps = React.useMemo(
    () =>
      explicitSteps ??
      registeredSteps.map((step) => ({
        value: step.value,
        disabled: step.disabled,
      })),
    [explicitSteps, registeredSteps]
  );

  return {
    isExplicitMode,
    steps,
  };
}

function useStepperValue({
  value,
  defaultValue,
  onValueChange,
  steps,
}: {
  value: StepperValue | undefined;
  defaultValue: StepperValue | undefined;
  onValueChange: ((value: StepperValue) => void) | undefined;
  steps: StepperStep[];
}) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const currentValue = React.useMemo(
    () => getCurrentStepValue(steps, selectedValue),
    [selectedValue, steps]
  );
  const currentIndex = React.useMemo(
    () =>
      currentValue === undefined
        ? -1
        : steps.findIndex((step) => step.value === currentValue),
    [currentValue, steps]
  );

  const setValue = React.useCallback(
    (nextValue: StepperValue) => {
      const nextStepRecord = getStepByValue(steps, nextValue);

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

  return {
    currentValue,
    currentIndex,
    setValue,
  };
}

function useStepperNavigation({
  currentValue,
  setValue,
  steps,
}: {
  currentValue: StepperValue | undefined;
  setValue: (value: StepperValue) => void;
  steps: StepperStep[];
}) {
  const previousStep = React.useMemo(
    () => getPreviousEnabledStep(steps, currentValue),
    [currentValue, steps]
  );
  const nextStep = React.useMemo(
    () => getNextEnabledStep(steps, currentValue),
    [currentValue, steps]
  );
  const goPrevious = React.useCallback(() => {
    if (previousStep) {
      setValue(previousStep.value);
    }
  }, [previousStep, setValue]);
  const goNext = React.useCallback(() => {
    if (nextStep) {
      setValue(nextStep.value);
    }
  }, [nextStep, setValue]);

  return {
    canGoPrevious: Boolean(previousStep),
    canGoNext: Boolean(nextStep),
    goPrevious,
    goNext,
  };
}

function useDuplicateStepWarning(steps: StepperStep[]) {
  const duplicateStepValues = React.useMemo(
    () => getDuplicateStepValues(steps),
    [steps]
  );
  const duplicateStepValuesKey = duplicateStepValues.join("\0");

  React.useEffect(() => {
    if (!isDevelopment || duplicateStepValues.length === 0) {
      return;
    }

    duplicateStepValues.forEach((stepValue) => {
      warnDev(
        `StepperItem value "${stepValue}" is duplicated. Step values must be unique within a Stepper.`
      );
    });
  }, [duplicateStepValues, duplicateStepValuesKey]);
}

function useNavigationButton({
  canNavigate,
  disabled,
  navigate,
  onBeforeNavigate,
}: {
  canNavigate: boolean;
  disabled: boolean | undefined;
  navigate: () => void;
  onBeforeNavigate: StepperNavigationGuard | undefined;
}) {
  const [isPending, setIsPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const isDisabled = disabled || !canNavigate || isPending;

  const handleClick = React.useCallback(
    async (
      event: React.MouseEvent<HTMLButtonElement>,
      onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
    ) => {
      onClick?.(event);

      if (isDisabled || pendingRef.current) {
        event.preventDefault();
        return;
      }

      if (event.defaultPrevented) {
        return;
      }

      pendingRef.current = true;
      setIsPending(true);

      try {
        const canCompleteNavigation =
          await resolveNavigationGuard(onBeforeNavigate);

        if (canCompleteNavigation) {
          navigate();
        }
      } finally {
        pendingRef.current = false;
        setIsPending(false);
      }
    },
    [isDisabled, navigate, onBeforeNavigate]
  );

  return {
    isDisabled,
    handleClick,
  };
}

function useStepper<
  TValue extends StepperValue = StepperValue,
>(): StepperApi<TValue> {
  const context = useStepperContext(
    "useStepper"
  ) as unknown as StepperContextValue<TValue>;

  return {
    value: context.value,
    orientation: context.orientation,
    steps: context.steps,
    currentIndex: context.currentIndex,
    totalSteps: context.totalSteps,
    setValue: context.setValue,
    getStepIndex: context.getStepIndex,
    canGoPrevious: context.canGoPrevious,
    canGoNext: context.canGoNext,
    goPrevious: context.goPrevious,
    goNext: context.goNext,
  };
}

function useStepperItem<
  TValue extends StepperValue = StepperValue,
>(): StepperItemApi<TValue> {
  return useStepperItemContext(
    "useStepperItem"
  ) as unknown as StepperItemContextValue<TValue>;
}

// ----------------------------------------------------------------------------
// Root
// ----------------------------------------------------------------------------

function Stepper<const TSteps extends readonly StepperStepInput[]>(
  props: StepperPropsWithSteps<TSteps>
): React.ReactElement;
function Stepper<TValue extends StepperValue = StepperValue>(
  props: StepperPropsWithoutSteps<TValue>
): React.ReactElement;
function Stepper({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  steps: stepsProp,
  className,
  children,
  ...props
}: StepperProps) {
  const id = React.useId();
  const { registeredSteps, registerStep, unregisterStep } =
    useRegisteredSteps();
  const { isExplicitMode, steps } = useStepperSteps(
    stepsProp,
    registeredSteps
  );
  const {
    currentValue,
    currentIndex,
    setValue: setStepperValue,
  } = useStepperValue({
    value,
    defaultValue,
    onValueChange,
    steps,
  });
  const { canGoPrevious, canGoNext, goPrevious, goNext } =
    useStepperNavigation({
      currentValue,
      setValue: setStepperValue,
      steps,
    });

  useDuplicateStepWarning(steps);

  const context = React.useMemo<StepperContextValue>(
    () => ({
      value: currentValue,
      orientation,
      steps,
      isExplicitMode,
      currentIndex,
      totalSteps: steps.length,
      registerStep,
      unregisterStep,
      setValue: setStepperValue,
      getStepIndex: (stepValue) =>
        steps.findIndex((step) => step.value === stepValue),
      getTriggerId: (stepValue) => `${id}-trigger-${getSafeId(stepValue)}`,
      getContentId: (stepValue) => `${id}-content-${getSafeId(stepValue)}`,
      canGoPrevious,
      canGoNext,
      goPrevious,
      goNext,
    }),
    [
      canGoNext,
      canGoPrevious,
      currentValue,
      currentIndex,
      goNext,
      goPrevious,
      id,
      isExplicitMode,
      orientation,
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

// ----------------------------------------------------------------------------
// List
// ----------------------------------------------------------------------------

function StepperList({
  className,
  "aria-label": ariaLabel = "Progress steps",
  children,
  ...props
}: StepperListProps) {
  const { orientation } = useStepperContext("StepperList");

  return (
    <StepperListContext.Provider value={true}>
      <ol
        aria-label={props["aria-labelledby"] ? undefined : ariaLabel}
        data-slot="stepper-list"
        data-orientation={orientation}
        className={cn(
          "flex min-w-0",
          "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:gap-0 data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:pb-2",
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

// ----------------------------------------------------------------------------
// Item
// ----------------------------------------------------------------------------

function StepperItem<TValue extends StepperValue = StepperValue>({
  value,
  completed = false,
  defaultTrigger = true,
  disabled = false,
  error = false,
  separator = true,
  className,
  children,
  ...props
}: StepperItemProps<TValue>) {
  const {
    value: currentValue,
    orientation,
    steps,
    isExplicitMode,
    registerStep,
    unregisterStep,
    setValue,
    getStepIndex,
    getTriggerId,
    getContentId,
  } = useStepperContext("StepperItem");
  const registrationId = React.useId();
  const itemRef = React.useRef<HTMLLIElement>(null);
  const isInsideStepperList = useStepperListContext();
  const index = getStepIndex(value);
  const step = getStepByValue(steps, value);
  const isDisabled = step?.disabled ?? disabled;
  const currentIndex =
    currentValue === undefined ? -1 : getStepIndex(currentValue);
  const isActive = currentValue === value;
  const stepPosition: StepperStepPosition =
    currentIndex < 0 || index < 0
      ? "next"
      : index < currentIndex
        ? "previous"
        : index === currentIndex
          ? "current"
          : "next";
  const stepState: StepperStepState = isDisabled
    ? "disabled"
    : error
      ? "error"
      : isActive
        ? "active"
        : completed
          ? "completed"
          : "inactive";
  const renderDefaultTrigger = defaultTrigger;
  const isLastStep = index >= 0 && index === steps.length - 1;
  const shouldRenderSeparator =
    isInsideStepperList && separator && !isLastStep;

  React.useLayoutEffect(() => {
    if (!isInsideStepperList || isExplicitMode) {
      return;
    }

    registerStep({
      id: registrationId,
      value,
      disabled,
      element: itemRef.current,
    });

    return () => unregisterStep(registrationId);
  }, [
    disabled,
    isExplicitMode,
    isInsideStepperList,
    registerStep,
    registrationId,
    unregisterStep,
    value,
  ]);

  React.useEffect(() => {
    if (!isDevelopment || isInsideStepperList) {
      return;
    }

    const timeout = window.setTimeout(() => {
      warnDev(
        `StepperItem with value "${value}" must be rendered inside StepperList to participate in step order.`
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [isInsideStepperList, value]);

  React.useEffect(() => {
    if (
      !isDevelopment ||
      !isInsideStepperList ||
      index >= 0
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      warnDev(
        `StepperItem with value "${value}" could not be found in the Stepper order. Check that it is rendered inside StepperList and not hidden behind an unsupported wrapper.`
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [index, isInsideStepperList, value]);

  const itemContext = React.useMemo<StepperItemContextValue>(
    () => ({
      value,
      index,
      disabled: isDisabled,
      isActive,
      stepState,
      stepPosition,
      orientation,
      setValue,
      triggerId: getTriggerId(value),
      contentId: getContentId(value),
    }),
    [
      value,
      index,
      isDisabled,
      isActive,
      stepState,
      stepPosition,
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
      data-position={stepPosition}
      data-disabled={isDisabled ? "" : undefined}
      data-error={error ? "" : undefined}
      data-completed={completed ? "" : undefined}
      className={cn(
        "group/stepper-item relative flex min-w-0",
        "[--stepper-indicator-size:2.25rem] [--stepper-separator-offset:calc(var(--stepper-indicator-size)_/_2)] [--stepper-separator-y:calc(var(--stepper-indicator-size)_/_2)]",
        "data-[orientation=horizontal]:min-w-28 data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center",
        "data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-3",
        className
      )}
      {...props}
    >
      <StepperItemContext.Provider value={itemContext}>
        {renderDefaultTrigger ? (
          <>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>{children}</StepperLabel>
            </StepperTrigger>
            {shouldRenderSeparator ? <StepperSeparator /> : null}
          </>
        ) : (
          <>
            {children}
            {shouldRenderSeparator ? <StepperSeparator /> : null}
          </>
        )}
      </StepperItemContext.Provider>
    </li>
  );
}

// ----------------------------------------------------------------------------
// Trigger
// ----------------------------------------------------------------------------

function StepperTrigger({
  asChild = false,
  className,
  children,
  disabled,
  onClick,
  onKeyDown,
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
  const { steps, getTriggerId } = useStepperContext("StepperTrigger");
  const isDisabled = itemDisabled || disabled;
  const Comp = asChild ? Slot : "button";

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
        "group inline-flex min-h-10 min-w-0 items-center gap-2 rounded-lg text-left text-sm font-medium outline-none",
        "text-muted-foreground transition-[color,background-color,border-color,box-shadow,transform] hover:text-foreground active:scale-[0.96]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[state=active]:text-foreground",
        "data-[state=completed]:text-foreground",
        "data-[state=error]:text-destructive",
        orientation === "horizontal" && "w-full flex-col items-center text-center",
        orientation === "vertical" && "justify-start",
        className
      )}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (isDisabled) {
          event.preventDefault();
          return;
        }

        if (!event.defaultPrevented) {
          setValue(value);
        }
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || isDisabled) {
          return;
        }

        const targetStepValue = getKeyboardNavigationStepValue({
          key: event.key,
          orientation,
          steps,
          value,
        });

        if (!targetStepValue || targetStepValue === value) {
          return;
        }

        const targetTrigger = document.getElementById(
          getTriggerId(targetStepValue)
        );

        if (targetTrigger instanceof HTMLElement) {
          event.preventDefault();
          targetTrigger.focus();
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
        : stepState === "completed"
          ? "\u2713"
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
          "transition-[color,background-color,border-color,box-shadow,transform]",
          "group-hover:border-foreground/30",
          "group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:shadow-md",
          "group-data-[state=completed]:border-primary group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground",
          "group-data-[state=error]:border-destructive group-data-[state=error]:bg-destructive group-data-[state=error]:text-destructive-foreground",
          "group-data-[position=previous]:text-foreground",
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
        "min-w-0 text-sm leading-tight font-medium",
        orientation === "horizontal" && "max-w-40 text-balance",
        className
      )}
      {...props}
    />
  );
}

function StepperDescription({ className, ...props }: StepperDescriptionProps) {
  const { orientation } = useStepperItemContext("StepperDescription");

  return (
    <span
      data-slot="stepper-description"
      className={cn(
        "text-xs leading-snug font-normal text-muted-foreground",
        orientation === "horizontal" && "max-w-44 text-balance",
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
        "overflow-hidden bg-muted-foreground/25 after:absolute after:inset-0 after:bg-primary after:content-['']",
        "after:transition-transform after:duration-[220ms] after:ease-out motion-reduce:after:transition-none",
        orientation === "horizontal" &&
          "absolute left-[calc(50%_+_var(--stepper-separator-offset))] right-[calc(-50%_+_var(--stepper-separator-offset))] top-(--stepper-separator-y) h-px after:origin-left after:scale-x-0 group-data-[position=previous]/stepper-item:after:scale-x-100 group-data-[state=completed]/stepper-item:after:scale-x-100",
        orientation === "vertical" &&
          "absolute left-[calc(var(--stepper-indicator-size)_/_2)] top-[calc(var(--stepper-indicator-size)_+_0.5rem)] h-[calc(100%_-_var(--stepper-indicator-size)_+_0.75rem)] w-px after:origin-top after:scale-y-0 group-data-[position=previous]/stepper-item:after:scale-y-100 group-data-[state=completed]/stepper-item:after:scale-y-100",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------------
// Content
// ----------------------------------------------------------------------------

function StepperContent<TValue extends StepperValue = StepperValue>({
  value,
  forceMount = false,
  keepMounted = false,
  asChild = false,
  className,
  children,
  ...props
}: StepperContentProps<TValue>) {
  const {
    value: currentValue,
    steps,
    getTriggerId,
    getContentId,
  } = useStepperContext("StepperContent");
  const isActive = currentValue === value;
  const hasMatchingStep = steps.some((step) => step.value === value);
  const shouldKeepMounted = forceMount || keepMounted;

  React.useEffect(() => {
    if (!isDevelopment || hasMatchingStep) {
      return;
    }

    const timeout = window.setTimeout(() => {
      warnDev(
        `StepperContent value "${value}" does not match any StepperItem. Content values should map to a step value.`
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [hasMatchingStep, value]);

  if (!shouldKeepMounted && !isActive) {
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
      hidden={shouldKeepMounted ? !isActive : undefined}
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

// ----------------------------------------------------------------------------
// Navigation
// ----------------------------------------------------------------------------

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
  const { handleClick, isDisabled } = useNavigationButton({
    canNavigate: canGoPrevious,
    disabled,
    navigate: goPrevious,
    onBeforeNavigate: onBeforePrevious,
  });
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
        "inline-flex h-9 min-w-24 items-center justify-center gap-2 rounded-none border border-border bg-background px-3 text-sm font-medium text-foreground",
        "transition-[color,background-color,border-color,box-shadow,transform] hover:border-foreground/20 hover:bg-muted hover:text-foreground active:scale-[0.97]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
        handleClick(event, onClick)
      }
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
  const { handleClick, isDisabled } = useNavigationButton({
    canNavigate: canGoNext,
    disabled,
    navigate: goNext,
    onBeforeNavigate: onBeforeNext,
  });
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
        "inline-flex h-9 min-w-24 items-center justify-center gap-2 rounded-none border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground",
        "transition-[background-color,border-color,box-shadow,transform] hover:bg-primary/90 active:scale-[0.97]",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
        handleClick(event, onClick)
      }
      {...props}
    >
      {children}
    </Comp>
  );
}

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

setDisplayName(Stepper, "Stepper");
setDisplayName(StepperList, "StepperList");
setDisplayName(StepperItem, "StepperItem");
setDisplayName(StepperTrigger, "StepperTrigger");
setDisplayName(StepperIndicator, "StepperIndicator");
setDisplayName(StepperLabel, "StepperLabel");
setDisplayName(StepperDescription, "StepperDescription");
setDisplayName(StepperSeparator, "StepperSeparator");
setDisplayName(StepperContent, "StepperContent");
setDisplayName(StepperPrevious, "StepperPrevious");
setDisplayName(StepperNext, "StepperNext");

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
  useStepper,
  useStepperItem,
};

export type {
  StepperApi,
  StepperButtonProps,
  StepperContentProps,
  StepperDescriptionProps,
  StepperIndicatorProps,
  StepperItemApi,
  StepperItemProps,
  StepperLabelProps,
  StepperListProps,
  StepperNavigationGuard,
  StepperNextProps,
  StepperOrientation,
  StepperPreviousProps,
  StepperProps,
  StepperSeparatorProps,
  StepperStep,
  StepperStepInput,
  StepperStepPosition,
  StepperStepState,
  StepperStepsValue,
  StepperTriggerProps,
  StepperValue,
};
