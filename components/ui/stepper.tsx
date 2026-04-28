"use client";

import * as React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";

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
  const stepState: StepperStepState = disabled
    ? "disabled"
    : error
      ? "error"
      : isActive
        ? "active"
        : completed
          ? "completed"
          : "inactive";

  return (
    <li
      data-slot="stepper-item"
      data-orientation={orientation}
      data-state={stepState}
      className={cn(
        "group/stepper-item relative flex min-w-0",
        "data-[orientation=horizontal]:min-w-24 data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center",
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
        className={cn(
          "group inline-flex min-h-10 min-w-0 items-center gap-2 rounded-md text-left text-sm font-medium outline-none",
          "text-muted-foreground transition-[color,background-color,box-shadow,transform] active:scale-[0.96]",
          "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=active]:text-foreground",
          "data-[state=completed]:text-foreground",
          "data-[state=error]:text-destructive",
          orientation === "horizontal" && "w-full flex-col items-center text-center",
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
            "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground shadow-sm",
            "group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground",
            "group-data-[state=completed]:border-primary group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground",
            "group-data-[state=error]:border-destructive group-data-[state=error]:bg-destructive group-data-[state=error]:text-destructive-foreground"
          )}
        >
          {stepState === "error" ? "!" : index >= 0 ? index + 1 : null}
        </span>
        <span
          data-slot="stepper-label"
          className={cn(
            "min-w-0 leading-none",
            orientation === "horizontal" && "max-w-24 truncate"
          )}
        >
          {children}
        </span>
      </button>
      <span
        aria-hidden="true"
        data-slot="stepper-separator"
        className={cn(
          "bg-muted-foreground/25",
          orientation === "horizontal" &&
            "absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-[1.125rem] h-px group-data-[state=completed]/stepper-item:bg-primary",
          orientation === "vertical" &&
            "absolute left-[1.125rem] top-11 h-[calc(100%-1.5rem)] w-px group-data-[state=completed]/stepper-item:bg-primary"
        )}
      />
    </li>
  );
}

type StepperContentProps = Omit<HTMLMotionProps<"div">, "value"> & {
  value: string;
  forceMount?: boolean;
};

function StepperContent({
  value,
  forceMount = false,
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

  const content = (
    <motion.div
      key={value}
      id={getContentId(value)}
      role="region"
      aria-labelledby={getTriggerId(value)}
      data-slot="stepper-content"
      data-state={isActive ? "active" : "inactive"}
      hidden={!isActive}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      className={cn(
        "rounded-lg border border-border/70 bg-muted/25 p-4 text-sm text-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );

  if (forceMount) {
    return content;
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {isActive ? content : null}
    </AnimatePresence>
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

type ExampleContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

function ExampleContent({
  eyebrow,
  title,
  description,
  children,
}: ExampleContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
        <h3 className="text-balance text-sm font-medium text-foreground">
          {title}
        </h3>
        <p className="text-pretty text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

type SummaryItem = {
  label: string;
  value: string;
  help?: string;
};

function SummaryGrid({ items }: { items: SummaryItem[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md border border-border bg-background p-3"
        >
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {item.value}
          </dd>
          {item.help ? (
            <dd className="mt-1 text-xs text-muted-foreground">{item.help}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

function StepperActions({
  note,
  previousLabel = "Back",
  nextLabel = "Continue",
}: {
  note?: React.ReactNode;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      {note ? (
        <p className="text-sm text-muted-foreground">{note}</p>
      ) : (
        <span />
      )}
      <div className="flex gap-2 sm:justify-end">
        <StepperPrevious>{previousLabel}</StepperPrevious>
        <StepperNext>{nextLabel}</StepperNext>
      </div>
    </div>
  );
}

function StepperExample() {
  return (
    <Stepper defaultValue="shipping" orientation="horizontal">
      <StepperList>
        <StepperItem value="cart" completed>
          Cart review
        </StepperItem>
        <StepperItem value="shipping">Shipping</StepperItem>
        <StepperItem value="payment" disabled>
          Payment
        </StepperItem>
      </StepperList>

      <StepperContent value="cart">
        <ExampleContent
          eyebrow="Cart"
          title="Review selected products"
          description="Confirm the items in the order before choosing how they should be delivered."
        >
          <SummaryGrid
            items={[
              { label: "Items", value: "3 products", help: "Ready to ship" },
              { label: "Subtotal", value: "$128.00", help: "Before tax" },
              { label: "Discount", value: "-$12.00", help: "Spring offer" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="shipping">
        <ExampleContent
          eyebrow="Shipping"
          title="Confirm delivery details"
          description="A horizontal stepper works well when users move through a short linear checkout."
        >
          <SummaryGrid
            items={[
              { label: "Recipient", value: "Avery Stone", help: "Primary" },
              { label: "Method", value: "Express", help: "2 business days" },
              { label: "Address", value: "Missing ZIP", help: "Required" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="payment">
        <ExampleContent
          eyebrow="Payment"
          title="Choose a payment method"
          description="This step stays disabled until the required shipping details are complete."
        />
      </StepperContent>

      <StepperActions note="Payment unlocks after the shipping address is complete." />
    </Stepper>
  );
}

function StepperVerticalExample() {
  return (
    <Stepper defaultValue="workspace" orientation="vertical">
      <StepperList>
        <StepperItem value="profile" completed>
          Profile
        </StepperItem>
        <StepperItem value="workspace">Workspace</StepperItem>
        <StepperItem value="invite" disabled>
          Invite team
        </StepperItem>
      </StepperList>

      <StepperContent value="profile">
        <ExampleContent
          eyebrow="Profile"
          title="Personal details are ready"
          description="The user has already added their name, role, and notification preferences."
        />
      </StepperContent>
      <StepperContent value="workspace">
        <ExampleContent
          eyebrow="Workspace"
          title="Set team defaults"
          description="Vertical orientation gives each step room to carry extra explanation without compressing the labels."
        >
          <SummaryGrid
            items={[
              { label: "Plan", value: "Team", help: "14-day trial" },
              { label: "Region", value: "US East", help: "Lowest latency" },
              { label: "Seats", value: "8 seats", help: "2 unused" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="invite">
        <ExampleContent
          eyebrow="Invites"
          title="Invite teammates"
          description="Invitations become available once the workspace defaults have been saved."
        />
      </StepperContent>

      <StepperActions note="Invite controls stay disabled until the workspace setup is complete." />
    </Stepper>
  );
}

function StepperStatusExample() {
  return (
    <Stepper defaultValue="shipping" orientation="horizontal">
      <StepperList>
        <StepperItem value="account" completed>
          Account
        </StepperItem>
        <StepperItem value="shipping" error>
          Shipping
        </StepperItem>
        <StepperItem value="payment" disabled>
          Payment
        </StepperItem>
      </StepperList>

      <StepperContent value="account" forceMount>
        <ExampleContent
          eyebrow="Account"
          title="Account details are complete"
          description="Completed steps keep their primary color so users can see how far they got."
        />
      </StepperContent>
      <StepperContent value="shipping" forceMount>
        <ExampleContent
          eyebrow="Needs attention"
          title="Shipping address is missing a postal code"
          description="Error state highlights the current blocker while keeping the next step disabled."
        >
          <div className="rounded-md border border-destructive/30 bg-background p-3 text-sm text-destructive">
            Add a postal code to unlock payment.
          </div>
        </ExampleContent>
      </StepperContent>
      <StepperContent value="payment" forceMount>
        <ExampleContent
          eyebrow="Payment"
          title="Payment is locked"
          description="Disabled steps use a real disabled button and cannot be selected."
        />
      </StepperContent>

      <StepperActions note="The next action is unavailable until the error is resolved." />
    </Stepper>
  );
}

function StepperControlledExample() {
  const steps = ["details", "review", "confirm"];
  const [value, setValue] = React.useState("details");
  const currentIndex = steps.indexOf(value);

  return (
    <Stepper value={value} onValueChange={setValue} orientation="horizontal">
      <StepperList>
        <StepperItem value="details" completed={currentIndex > 0}>
          Details
        </StepperItem>
        <StepperItem value="review" completed={currentIndex > 1}>
          Review
        </StepperItem>
        <StepperItem value="confirm">Confirm</StepperItem>
      </StepperList>

      <StepperContent value="details">
        <ExampleContent
          eyebrow="Details"
          title="Collect request details"
          description="Controlled steppers let the application decide when a user can move to the next step."
        >
          <SummaryGrid
            items={[
              { label: "Owner", value: "Finance", help: "Assigned" },
              { label: "Budget", value: "$4,800", help: "Estimated" },
              { label: "Due date", value: "May 12", help: "Flexible" },
            ]}
          />
        </ExampleContent>
      </StepperContent>
      <StepperContent value="review">
        <ExampleContent
          eyebrow="Review"
          title="Check the request"
          description="The active value is stored in React state and passed back through onValueChange."
        />
      </StepperContent>
      <StepperContent value="confirm">
        <ExampleContent
          eyebrow="Confirm"
          title="Submit the request"
          description="Use a controlled Stepper when validation, routing, or persistence lives outside the component."
        />
      </StepperContent>

      <StepperActions
        note={
          <span>
            Step{" "}
            <span className="tabular-nums">
              {currentIndex + 1} of {steps.length}
            </span>
            : {value}
          </span>
        }
        nextLabel={value === "confirm" ? "Finish" : "Continue"}
      />
    </Stepper>
  );
}

export {
  Stepper,
  StepperControlledExample,
  StepperContent,
  StepperExample,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperStatusExample,
  StepperVerticalExample,
};

export type { StepperOrientation, StepperStepState };
