"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { StepperContext } from "./context";
import type {
  RegisteredStep,
  StepperContextValue,
  StepperProps,
} from "./types";
import {
  areRegisteredStepsEqual,
  collectSteps,
  getNextEnabledStep,
  getPreviousEnabledStep,
  getSafeId,
  getStepperStepMeta,
  sortRegisteredSteps,
  toStepRecord,
} from "./utils";

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
        ? registeredSteps.map((step) => {
            const collectedStep = collectedSteps.find(
              (currentStep) => currentStep.value === step.value
            );

            return {
              ...toStepRecord(step),
              disabled: collectedStep?.disabled ?? step.disabled,
            };
          })
        : collectedSteps,
    [collectedSteps, registeredSteps]
  );
  const selectedValue = isControlled ? value : uncontrolledValue;
  const { currentValue, selectedStep } = React.useMemo(
    () => getStepperStepMeta(steps, selectedValue),
    [selectedValue, steps]
  );
  const selectedCollectedStep = React.useMemo(
    () => collectedSteps.find((step) => step.value === selectedValue),
    [collectedSteps, selectedValue]
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
        if (currentSteps.length === 0) {
          stepOrderRef.current = 0;
        }

        const existingStep = currentSteps.find(
          (currentStep) => currentStep.value === step.value
        );
        const nextStepRecord: RegisteredStep = {
          ...step,
          order: existingStep?.order ?? stepOrderRef.current++,
        };
        const nextSteps = sortRegisteredSteps([
          ...currentSteps.filter(
            (currentStep) => currentStep.value !== step.value
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

  React.useEffect(() => {
    if (
      !isControlled ||
      selectedValue === undefined ||
      currentValue === undefined
    ) {
      return;
    }

    const shouldSyncFallback =
      !selectedStep || selectedCollectedStep?.disabled === true;

    if (selectedValue === currentValue || !shouldSyncFallback) {
      return;
    }

    onValueChange?.(currentValue);
  }, [
    currentValue,
    isControlled,
    onValueChange,
    selectedCollectedStep,
    selectedStep,
    selectedValue,
  ]);

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

export { Stepper };
