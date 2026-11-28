"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "cn";

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
  completed: boolean;
  isActive: boolean;
  stepState: StepperStepState;
  stepPosition: StepperStepPosition;
  orientation: StepperOrientation;
  setValue: (value: TValue) => void;
  triggerId: string;
  contentId: string;
};

type StepperCollection = {
  id: string;
  orientation: StepperOrientation;
  steps: StepperStep[];
  register?: (registrationId: string, step?: StepperStep) => void;
};

type StepperContextValue = {
  api: StepperApi;
  collection: StepperCollection;
  previousValue: StepperValue | undefined;
  nextValue: StepperValue | undefined;
  readIntent: () => number;
  advanceIntent: () => number;
};

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

type StepperCompositionProps = {
  render?: useRender.RenderProp;
  /** @deprecated Prefer the Base UI render prop. */
  asChild?: boolean;
};

type StepperTriggerProps = StepperButtonProps;

type StepperIndicatorProps = React.ComponentPropsWithoutRef<"span">;

type StepperLabelProps = React.ComponentPropsWithoutRef<"span">;

type StepperDescriptionProps = React.ComponentPropsWithoutRef<"span">;

type StepperSeparatorProps = React.ComponentPropsWithoutRef<"span">;

type StepperContentProps<TValue extends StepperValue = StepperValue> =
  React.ComponentPropsWithoutRef<"div"> & {
    value: TValue;
    forceMount?: boolean;
    keepMounted?: boolean;
  } & StepperCompositionProps;

type StepperButtonProps = React.ComponentPropsWithoutRef<"button"> &
  StepperCompositionProps & {
    /** Set false when rendering a link or another non-button element. */
    nativeButton?: boolean;
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

function getStepId(id: string, part: "trigger" | "content", value: StepperValue) {
  const suffix = value.replace(/[^a-zA-Z0-9_-]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).padStart(4, "0")}`
  );
  return `${id}-${part}-${suffix}`;
}

function findEnabledIndex(steps: StepperStep[], from: number, direction: 1 | -1) {
  for (let index = from + direction; index >= 0 && index < steps.length; index += direction) {
    if (!steps[index].disabled) return index;
  }
  return -1;
}

function getKeyboardTarget(
  event: React.KeyboardEvent<HTMLButtonElement>,
  orientation: StepperOrientation,
  steps: StepperStep[],
  index: number
) {
  if (index < 0) return undefined;

  const { key, currentTarget } = event;
  if (key === "Home") return steps[findEnabledIndex(steps, -1, 1)]?.value;
  if (key === "End") return steps[findEnabledIndex(steps, steps.length, -1)]?.value;

  if (orientation === "vertical") {
    if (key === "ArrowDown") return steps[findEnabledIndex(steps, index, 1)]?.value;
    if (key === "ArrowUp") return steps[findEnabledIndex(steps, index, -1)]?.value;
  } else if (key === "ArrowLeft" || key === "ArrowRight") {
    const rtl = getComputedStyle(currentTarget).direction === "rtl";
    const direction = (key === "ArrowRight") !== rtl ? 1 : -1;
    return steps[findEnabledIndex(steps, index, direction)]?.value;
  }

  return undefined;
}

function setDisplayName(component: object, displayName: string) {
  (component as { displayName?: string }).displayName = displayName;
}

// ----------------------------------------------------------------------------
// Context
// ----------------------------------------------------------------------------

const StepperContext = React.createContext<StepperContextValue | null>(null);
const StepperCollectionContext = React.createContext<StepperCollection | null>(null);
const StepperItemContext = React.createContext<Omit<StepperItemApi, "setValue"> | null>(null);
const StepperActionContext = React.createContext<StepperApi["setValue"] | null>(null);
const StepperListContext = React.createContext<string | null>(null);

function useStepperContext(component: string) {
  const context = React.useContext(StepperContext);

  if (!context) {
    throw new Error(`${component} must be used within Stepper`);
  }

  return context;
}

function useStepperCollection(component: string) {
  const collection = React.useContext(StepperCollectionContext);
  if (!collection) {
    throw new Error(`${component} must be used within Stepper`);
  }
  return collection;
}

function useStepperAction(component: string) {
  const setValue = React.useContext(StepperActionContext);
  if (!setValue) throw new Error(`${component} must be used within Stepper`);
  return setValue;
}

function useStepperItemContext(component: string) {
  const context = React.useContext(StepperItemContext);

  if (!context) {
    throw new Error(`${component} must be used within StepperItem`);
  }

  return context;
}

// ----------------------------------------------------------------------------
// Internal Hooks
// ----------------------------------------------------------------------------

// A single inherited numeric cursor drives every connector. CSS retargets
// from the in-flight value on reversal instead of restarting a stagger.
// Browsers without typed custom properties fall back to an instant update.
const progressProperty = "--stepper-progress";
let progressPropertyRegistered = false;

function useConnectorProgress(currentIndex: number) {
  const [cursor, setCursor] = React.useState({ index: currentIndex, duration: 0 });

  if (currentIndex !== cursor.index) {
    // Commit the duration and target together so layout reads see both.
    const duration = cursor.index < 0 || currentIndex < 0
      ? 0
      : Math.min(330, Math.abs(currentIndex - cursor.index) * 110);
    setCursor({ index: currentIndex, duration });
  }

  React.useLayoutEffect(() => {
    if (!progressPropertyRegistered && typeof CSS !== "undefined" && typeof CSS.registerProperty === "function") {
      try {
        CSS.registerProperty({ name: progressProperty, syntax: "<number>", inherits: true, initialValue: "0" });
      } catch {
        // Multiple installed copies may already have registered the property.
      }
      progressPropertyRegistered = true;
    }
  }, []);

  return { progress: Math.max(0, cursor.index), duration: cursor.duration };
}

function useStepper<
  TValue extends StepperValue = StepperValue,
>(): StepperApi<TValue> {
  return useStepperContext("useStepper").api as unknown as StepperApi<TValue>;
}

function useStepperItem<
  TValue extends StepperValue = StepperValue,
>(): StepperItemApi<TValue> {
  const item = useStepperItemContext("useStepperItem");
  const setValue = useStepperAction("useStepperItem");
  return React.useMemo(() => ({ ...item, setValue }), [item, setValue]) as unknown as StepperItemApi<TValue>;
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
  style,
  children,
  ...props
}: StepperProps) {
  const id = React.useId();
  const [registrations, setRegistrations] = React.useState(() => new Map<string, StepperStep>());
  const register = React.useCallback((registrationId: string, step?: StepperStep) => {
    setRegistrations((registered) => {
      const previous = registered.get(registrationId);
      if (previous?.value === step?.value && previous?.disabled === step?.disabled) return registered;
      const next = new Map(registered);
      if (step) next.set(registrationId, step);
      else next.delete(registrationId);
      return next;
    });
  }, []);
  const registration = stepsProp === undefined ? register : undefined;

  const { steps, getStepIndex, duplicates } = React.useMemo(() => {
    const indices = new Map<StepperValue, number>();
    const duplicates = isDevelopment ? new Set<StepperValue>() : undefined;
    const steps = Array.from<StepperStepInput, StepperStep>(
      stepsProp ?? registrations.values(),
      ({ value, disabled }, index) => {
        if (indices.has(value)) duplicates?.add(value);
        else indices.set(value, index);
        return { value, disabled: !!disabled };
      }
    );
    return { steps, getStepIndex: (value: StepperValue) => indices.get(value) ?? -1, duplicates };
  }, [registrations, stepsProp]);

  React.useEffect(() => {
    if (!duplicates) return;
    for (const value of duplicates) {
      warnDev(`StepperItem value "${value}" is duplicated. Step values must be unique within a Stepper.`);
    }
  }, [duplicates]);
  const collection = React.useMemo<StepperCollection>(
    () => ({ id, orientation, steps, register: registration }),
    [id, orientation, registration, steps]
  );

  const controlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const selectedValue = controlled ? value : uncontrolledValue;
  const selectedIndex = selectedValue === undefined ? -1 : getStepIndex(selectedValue);
  const currentIndex = steps[selectedIndex]?.disabled === false
    ? selectedIndex
    : findEnabledIndex(steps, -1, 1);
  const currentValue = steps[currentIndex]?.value;
  const previousValue = currentIndex < 0 ? undefined : steps[findEnabledIndex(steps, currentIndex, -1)]?.value;
  const nextValue = currentIndex < 0 ? undefined : steps[findEnabledIndex(steps, currentIndex, 1)]?.value;

  // One root-scoped intent clock covers direct requests and both guarded directions.
  const navigationEpochRef = React.useRef(0);
  const readIntent = React.useCallback(() => navigationEpochRef.current, []);
  const advanceIntent = React.useCallback(() => ++navigationEpochRef.current, []);
  React.useLayoutEffect(() => () => { advanceIntent(); }, [currentValue, advanceIntent]);

  const setValue = React.useCallback((nextValue: StepperValue) => {
    if (steps[getStepIndex(nextValue)]?.disabled !== false) return;
    advanceIntent();
    if (!controlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  }, [advanceIntent, controlled, getStepIndex, onValueChange, steps]);
  const goPrevious = React.useCallback(() => {
    if (previousValue !== undefined) setValue(previousValue);
  }, [previousValue, setValue]);
  const goNext = React.useCallback(() => {
    if (nextValue !== undefined) setValue(nextValue);
  }, [nextValue, setValue]);

  const context = React.useMemo<StepperContextValue>(() => ({
    api: {
      value: currentValue,
      orientation,
      steps,
      currentIndex,
      totalSteps: steps.length,
      setValue,
      getStepIndex,
      canGoPrevious: previousValue !== undefined,
      canGoNext: nextValue !== undefined,
      goPrevious,
      goNext,
    },
    collection,
    previousValue,
    nextValue,
    readIntent,
    advanceIntent,
  }), [advanceIntent, collection, currentIndex, currentValue, getStepIndex, goNext, goPrevious, nextValue, orientation, previousValue, readIntent, setValue, steps]);

  return (
    <StepperContext.Provider value={context}>
      <StepperProgress currentIndex={currentIndex} orientation={orientation} className={className} style={style} {...props}>
        <StepperCollectionContext.Provider value={collection}>
          <StepperActionContext.Provider value={setValue}>
            {children}
          </StepperActionContext.Provider>
        </StepperCollectionContext.Provider>
      </StepperProgress>
    </StepperContext.Provider>
  );
}

// A render-phase cursor adjustment should only retry this host, not the root
// navigation provider or all of its context calculations.
function StepperProgress({
  currentIndex,
  orientation,
  className,
  style,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  currentIndex: number;
  orientation: StepperOrientation;
}) {
  const { progress, duration } = useConnectorProgress(currentIndex);
  return (
    <div
      data-slot="stepper"
      data-orientation={orientation}
      className={cn("flex flex-col gap-6 transition-[--stepper-progress] ease-linear motion-reduce:transition-none", className)}
      style={{ ...style, "--stepper-progress": progress, transitionDuration: duration + "ms" } as React.CSSProperties}
      {...props}
    />
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
  const { id, orientation } = useStepperCollection("StepperList");

  return (
    <StepperListContext.Provider value={id}>
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
  style,
  children,
  ...props
}: StepperItemProps<TValue>) {
  const {
    api: { value: currentValue, currentIndex, getStepIndex },
    collection: { id, orientation, steps, register },
  } = useStepperContext("StepperItem");
  const registrationId = React.useId();
  const isInsideStepperList = React.useContext(StepperListContext) === id;
  const index = getStepIndex(value);
  const isDisabled = steps[index]?.disabled ?? disabled;
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
  const isLastStep = index >= 0 && index === steps.length - 1;
  const shouldRenderSeparator =
    isInsideStepperList && separator && !isLastStep;
  const itemStyle = {
    ...style,
    "--stepper-connector-index": Math.max(0, index),
    "--stepper-connector-fill": completed ? 1 : index < 0 ? 0 : "clamp(0, calc(var(--stepper-progress, 0) - var(--stepper-connector-index)), 1)",
  } as React.CSSProperties;

  React.useLayoutEffect(() => {
    if (isInsideStepperList && register) return () => register(registrationId);
  }, [isInsideStepperList, register, registrationId]);

  React.useLayoutEffect(() => {
    if (isInsideStepperList) register?.(registrationId, { value, disabled });
  }, [disabled, isInsideStepperList, register, registrationId, value]);

  React.useEffect(() => {
    if (!isDevelopment || (isInsideStepperList && index >= 0)) return;

    const message = isInsideStepperList
      ? `StepperItem with value "${value}" could not be found in the Stepper order. Check that it is rendered inside StepperList. For dynamic or conditional step order, pass an explicit steps prop to Stepper.`
      : `StepperItem with value "${value}" must be rendered inside StepperList to participate in step order.`;
    const timeout = window.setTimeout(() => warnDev(message), 0);
    return () => window.clearTimeout(timeout);
  }, [index, isInsideStepperList, value]);

  const itemContext = React.useMemo<Omit<StepperItemApi, "setValue">>(() => ({
    value,
    index,
    disabled: isDisabled,
    completed,
    isActive,
    stepState,
    stepPosition,
    orientation,
    triggerId: getStepId(id, "trigger", value),
    contentId: getStepId(id, "content", value),
  }), [value, index, isDisabled, completed, isActive, stepState, stepPosition, orientation, id]);

  const trigger = React.useMemo(() => defaultTrigger ? (
    <StepperTrigger>
      <StepperIndicator />
      <StepperLabel>{children}</StepperLabel>
    </StepperTrigger>
  ) : children, [children, defaultTrigger]);

  return (
    <li
      data-slot="stepper-item"
      data-orientation={orientation}
      data-state={stepState}
      data-position={stepPosition}
      data-disabled={isDisabled ? "" : undefined}
      data-error={error ? "" : undefined}
      data-completed={completed ? "" : undefined}
      className={cn(
        "group/stepper-item relative flex min-w-0",
        "[--stepper-indicator-size:1.75rem] [--stepper-separator-offset:calc(var(--stepper-indicator-size)_/_2)] [--stepper-separator-y:calc(var(--stepper-indicator-size)_/_2)] sm:[--stepper-indicator-size:2.25rem]",
        "data-[orientation=horizontal]:min-w-16 data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center sm:data-[orientation=horizontal]:min-w-28",
        "data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-3",
        className
      )}
      style={itemStyle}
      {...props}
    >
      <StepperItemContext.Provider value={itemContext}>
        {trigger}
        {shouldRenderSeparator ? <StepperSeparator /> : null}
      </StepperItemContext.Provider>
    </li>
  );
}

// ----------------------------------------------------------------------------
// Trigger
// ----------------------------------------------------------------------------

// Keep the legacy composition shape working while using Base UI for prop
// and event merging. All new consumers should use the render prop.
function StepperElement({
  defaultTagName,
  render,
  asChild,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & StepperCompositionProps & {
  defaultTagName: "button" | "div";
  type?: React.ComponentPropsWithoutRef<"button">["type"];
  disabled?: boolean;
}) {
  const legacyRender = asChild
    ? React.Children.only(children) as React.ReactElement
    : undefined;

  const customRender = render ?? legacyRender;
  const element = useRender({
    defaultTagName,
    enabled: customRender !== undefined,
    render: customRender,
    props: {
      ...props,
      ...(!asChild && children !== undefined ? { children } : {}),
    },
  });

  // Keep the hook order and host element identity when composition changes.
  // Base UI only needs to merge props/events/refs for custom composition.
  return customRender !== undefined
    ? element
    : React.createElement(defaultTagName, props, children);
}

function StepperTrigger({
  asChild = false,
  render,
  nativeButton = !asChild,
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
    index,
    disabled: itemDisabled,
    isActive,
    stepState,
    orientation,
    triggerId,
    contentId,
  } = useStepperItemContext("StepperTrigger");
  const setValue = useStepperAction("StepperTrigger");
  const { id, steps } = useStepperCollection("StepperTrigger");
  const isDisabled = itemDisabled || disabled;

  return (
    <StepperElement
      defaultTagName="button"
      render={render}
      asChild={asChild}
      id={triggerId}
      type={nativeButton ? "button" : undefined}
      aria-current={isActive ? "step" : undefined}
      aria-controls={isActive ? contentId : undefined}
      aria-disabled={isDisabled ? true : undefined}
      disabled={nativeButton ? isDisabled : undefined}
      tabIndex={!nativeButton && isDisabled ? -1 : tabIndex}
      data-slot="stepper-trigger"
      data-state={stepState}
      data-disabled={isDisabled ? "" : undefined}
      className={cn(
        "group inline-flex min-h-10 min-w-0 items-center gap-2 rounded-lg text-left text-sm font-medium outline-none",
        "text-muted-foreground transition-[color,background-color,border-color,box-shadow,transform] hover:text-foreground active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100",
        "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
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

        const targetStepValue = getKeyboardTarget(event, orientation, steps, index);

        if (targetStepValue === undefined || targetStepValue === value) {
          return;
        }

        const targetTrigger = event.currentTarget.ownerDocument.getElementById(
          getStepId(id, "trigger", targetStepValue)
        );

        if (targetTrigger) {
          event.preventDefault();
          targetTrigger.focus();
        }
      }}
      {...props}
    >
      {children}
    </StepperElement>
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
          "transition-[color,background-color,border-color,box-shadow,transform] motion-reduce:transition-none",
          "group-hover:border-foreground/30",
          "group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:shadow-md",
          "group-data-[state=completed]:border-primary group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground",
          "group-data-[state=error]:border-destructive group-data-[state=error]:bg-destructive group-data-[state=error]:text-destructive-foreground",
          "group-data-[position=previous]:text-foreground",
          "[&>svg]:size-3.5 [&>svg]:shrink-0 sm:[&>svg]:size-4",
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
        "min-w-0 text-xs leading-tight font-medium sm:text-sm",
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
        orientation === "horizontal" &&
          "absolute start-[calc(50%_+_var(--stepper-separator-offset))] end-[calc(-50%_+_var(--stepper-separator-offset))] top-(--stepper-separator-y) h-px after:origin-left rtl:after:origin-right after:[transform:scaleX(var(--stepper-connector-fill,0))]",
        orientation === "vertical" &&
          "absolute left-[calc(var(--stepper-indicator-size)_/_2)] top-[calc(var(--stepper-indicator-size)_+_0.5rem)] h-[calc(100%_-_var(--stepper-indicator-size)_+_0.75rem)] w-px after:origin-top after:[transform:scaleY(var(--stepper-connector-fill,0))]",
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
  render,
  className,
  children,
  ...props
}: StepperContentProps<TValue>) {
  const {
    api: { value: currentValue, getStepIndex },
    collection: { id },
  } = useStepperContext("StepperContent");
  const isActive = currentValue === value;
  const hasMatchingStep = getStepIndex(value) >= 0;
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

  return (
    <StepperElement
      defaultTagName="div"
      render={render}
      asChild={asChild}
      id={getStepId(id, "content", value)}
      role="region"
      aria-labelledby={getStepId(id, "trigger", value)}
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
    </StepperElement>
  );
}

// ----------------------------------------------------------------------------
// Navigation
// ----------------------------------------------------------------------------

function StepperPrevious({ onBeforePrevious, ...props }: StepperPreviousProps) {
  return <StepperNavigationButton {...props} direction="previous" onBeforeNavigate={onBeforePrevious} />;
}

function StepperNext({ onBeforeNext, ...props }: StepperNextProps) {
  return <StepperNavigationButton {...props} direction="next" onBeforeNavigate={onBeforeNext} />;
}

function StepperNavigationButton({
  direction,
  asChild = false,
  render,
  nativeButton = !asChild,
  className,
  children,
  disabled = false,
  onBeforeNavigate,
  onClick,
  tabIndex,
  ...props
}: StepperButtonProps & {
  direction: "previous" | "next";
  onBeforeNavigate?: StepperNavigationGuard;
}) {
  const previous = direction === "previous";
  const { api: { value, goPrevious, goNext }, previousValue, nextValue, readIntent, advanceIntent } =
    useStepperContext(previous ? "StepperPrevious" : "StepperNext");
  const target = previous ? previousValue : nextValue;
  const navigate = previous ? goPrevious : goNext;
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const epoch = React.useRef(0);

  // A guard can resolve after the route or external disabled state changes.
  React.useLayoutEffect(() => () => { epoch.current += 1; }, [value, target, disabled]);

  const isDisabled = disabled || target === undefined || pending;
  const isComposed = asChild || render !== undefined;

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const request = epoch.current;
    const beforeClick = readIntent();
    onClick?.(event);
    if (isDisabled || pendingRef.current || request !== epoch.current || beforeClick !== readIntent()) {
      event.preventDefault();
      return;
    }
    if (event.defaultPrevented) return;
    if (!onBeforeNavigate) {
      navigate();
      return;
    }

    const intent = advanceIntent();
    pendingRef.current = true;
    setPending(true);
    try {
      if ((await onBeforeNavigate()) !== false && request === epoch.current && intent === readIntent()) {
        navigate();
      }
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return (
    <StepperElement
      defaultTagName="button"
      render={render}
      asChild={asChild}
      type={nativeButton ? "button" : undefined}
      disabled={nativeButton ? isDisabled : undefined}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={!nativeButton && isDisabled ? -1 : tabIndex}
      aria-busy={pending || undefined}
      data-slot={previous ? "stepper-previous" : "stepper-next"}
      data-pending={pending ? "" : undefined}
      data-disabled={isDisabled ? "" : undefined}
      className={isComposed ? className : cn(
        "inline-flex h-9 min-w-24 items-center justify-center gap-2 rounded-none border px-3 text-sm font-medium",
        previous
          ? "border-border bg-background text-foreground transition-[color,background-color,border-color,box-shadow,transform] hover:border-foreground/20 hover:bg-muted hover:text-foreground"
          : "border-primary bg-primary text-primary-foreground transition-[background-color,border-color,box-shadow,transform] hover:bg-primary/90",
        "active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children ?? (!isComposed ? (previous ? "Previous" : "Next") : undefined)}
    </StepperElement>
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
