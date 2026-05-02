"use client";

import * as React from "react";

import type {
  StepperApi,
  StepperContextValue,
  StepperItemContextValue,
} from "./types";

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

function useStepper(): StepperApi {
  const context = useStepperContext("useStepper");

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

export {
  StepperContext,
  StepperItemContext,
  useStepper,
  useStepperContext,
  useStepperItemContext,
};
