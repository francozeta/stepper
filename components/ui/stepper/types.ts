import type * as React from "react";

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

type StepperStep = StepRecord;

type RegisteredStep = StepRecord & {
  element: HTMLLIElement | null;
  order: number;
};

type StepperApi = {
  value: string | undefined;
  orientation: StepperOrientation;
  steps: StepperStep[];
  setValue: (value: string) => void;
  getStepIndex: (value: string) => number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goPrevious: () => void;
  goNext: () => void;
};

type StepperContextValue = StepperApi & {
  registerStep: (step: Omit<RegisteredStep, "order">) => void;
  unregisterStep: (value: string) => void;
  getTriggerId: (value: string) => string;
  getContentId: (value: string) => string;
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

type StepperProps = React.ComponentPropsWithoutRef<"div"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: StepperOrientation;
};

type StepperListProps = React.ComponentPropsWithoutRef<"ol">;

type StepperItemProps = Omit<
  React.ComponentPropsWithoutRef<"li">,
  "value"
> & {
  value: string;
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
};

type StepperTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

type StepperIndicatorProps = React.ComponentPropsWithoutRef<"span">;

type StepperLabelProps = React.ComponentPropsWithoutRef<"span">;

type StepperDescriptionProps = React.ComponentPropsWithoutRef<"span">;

type StepperSeparatorProps = React.ComponentPropsWithoutRef<"span">;

type StepperContentProps = React.ComponentPropsWithoutRef<"div"> & {
  value: string;
  forceMount?: boolean;
  asChild?: boolean;
};

type StepperButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

export type {
  RegisteredStep,
  StepperApi,
  StepperButtonProps,
  StepperContentProps,
  StepperContextValue,
  StepperDescriptionProps,
  StepperIndicatorProps,
  StepperItemContextValue,
  StepperItemProps,
  StepperLabelProps,
  StepperListProps,
  StepperOrientation,
  StepperProps,
  StepperSeparatorProps,
  StepperStep,
  StepperStepMeta,
  StepperStepState,
  StepperTriggerProps,
  StepRecord,
};
