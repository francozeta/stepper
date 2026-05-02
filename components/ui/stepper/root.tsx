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

type FallbackSyncState = {
  currentValue: string | undefined;
  selectedCollectedStepDisabled: boolean | undefined;
  selectedStepDisabled: boolean | undefined;
  selectedStepExists: boolean;
  selectedValue: string | undefined;
};

type FallbackSyncReason =
  | "missing"
  | "direct-disabled"
  | "registered-disabled";

function getControlledFallbackReason(
  state: FallbackSyncState
): FallbackSyncReason | undefined {
  if (state.selectedValue === undefined || state.currentValue === undefined) {
    return undefined;
  }

  if (state.selectedValue === state.currentValue) {
    return undefined;
  }

  if (!state.selectedStepExists) {
    return "missing";
  }

  if (state.selectedCollectedStepDisabled === true) {
    return "direct-disabled";
  }

  if (state.selectedStepDisabled === true) {
    return "registered-disabled";
  }

  return undefined;
}

function getDuplicateStepValues(steps: Array<{ value: string }>) {
  const seenValues = new Set<string>();
  const duplicateValues = new Set<string>();

  steps.forEach((step) => {
    if (seenValues.has(step.value)) {
      duplicateValues.add(step.value);
      return;
    }

    seenValues.add(step.value);
  });

  return Array.from(duplicateValues);
}

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
  const duplicateStepValues = React.useMemo(
    () => getDuplicateStepValues(collectedSteps),
    [collectedSteps]
  );
  const duplicateStepValuesKey = duplicateStepValues.join("\0");
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
  const fallbackSyncState = React.useMemo<FallbackSyncState>(
    () => ({
      currentValue,
      selectedCollectedStepDisabled: selectedCollectedStep?.disabled,
      selectedStepDisabled: selectedStep?.disabled,
      selectedStepExists: Boolean(selectedStep),
      selectedValue,
    }),
    [
      currentValue,
      selectedCollectedStep?.disabled,
      selectedStep,
      selectedValue,
    ]
  );
  const fallbackSyncStateRef =
    React.useRef<FallbackSyncState>(fallbackSyncState);
  const previousStep = React.useMemo(
    () => getPreviousEnabledStep(steps, currentValue),
    [currentValue, steps]
  );
  const nextStep = React.useMemo(
    () => getNextEnabledStep(steps, currentValue),
    [currentValue, steps]
  );
  const currentIndex = React.useMemo(
    () =>
      currentValue === undefined
        ? -1
        : steps.findIndex((step) => step.value === currentValue),
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

  React.useLayoutEffect(() => {
    fallbackSyncStateRef.current = fallbackSyncState;
  }, [fallbackSyncState]);

  React.useEffect(() => {
    if (
      process.env.NODE_ENV === "production" ||
      duplicateStepValues.length === 0
    ) {
      return;
    }

    duplicateStepValues.forEach((stepValue) => {
      console.warn(
        `StepperItem value "${stepValue}" is duplicated. Step values must be unique within a Stepper.`
      );
    });
  }, [duplicateStepValues, duplicateStepValuesKey]);

  React.useEffect(() => {
    const fallbackReason = getControlledFallbackReason(fallbackSyncState);

    if (!isControlled || !fallbackReason) {
      return;
    }

    const syncLatestFallback = () => {
      const latestState = fallbackSyncStateRef.current;

      if (
        getControlledFallbackReason(latestState) &&
        latestState.currentValue !== undefined
      ) {
        onValueChange?.(latestState.currentValue);
      }
    };

    if (fallbackReason !== "registered-disabled") {
      syncLatestFallback();
      return;
    }

    // Wrapped StepperItem components report disabled changes from layout effects.
    // Deferring avoids syncing from a stale registered disabled value.
    const timeout = window.setTimeout(syncLatestFallback, 0);

    return () => window.clearTimeout(timeout);
  }, [
    fallbackSyncState,
    isControlled,
    onValueChange,
  ]);

  const context = React.useMemo<StepperContextValue>(
    () => ({
      value: currentValue,
      orientation,
      steps,
      currentIndex,
      totalSteps: steps.length,
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
      currentIndex,
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
