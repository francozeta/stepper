import * as React from "react";

import type {
  RegisteredStep,
  StepperItemProps,
  StepperStepMeta,
  StepRecord,
} from "./types";

const STEPPER_PRIMITIVES = {
  content: "StepperContent",
  description: "StepperDescription",
  indicator: "StepperIndicator",
  item: "StepperItem",
  label: "StepperLabel",
  separator: "StepperSeparator",
  trigger: "StepperTrigger",
} as const;

type StepperPrimitiveName =
  (typeof STEPPER_PRIMITIVES)[keyof typeof STEPPER_PRIMITIVES];

type StepperPrimitiveComponent = React.ElementType & {
  displayName?: string;
  __stepperPrimitive?: StepperPrimitiveName;
  render?: unknown;
  type?: unknown;
};

function getSafeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function getStepperPrimitiveName(type: unknown): StepperPrimitiveName | undefined {
  if (!type || (typeof type !== "function" && typeof type !== "object")) {
    return undefined;
  }

  const primitive = type as StepperPrimitiveComponent;

  if (primitive.__stepperPrimitive) {
    return primitive.__stepperPrimitive;
  }

  if (
    primitive.displayName &&
    Object.values(STEPPER_PRIMITIVES).includes(
      primitive.displayName as StepperPrimitiveName
    )
  ) {
    return primitive.displayName as StepperPrimitiveName;
  }

  return (
    getStepperPrimitiveName(primitive.type) ??
    getStepperPrimitiveName(primitive.render)
  );
}

function markStepperPrimitive<T extends StepperPrimitiveComponent>(
  component: T,
  name: StepperPrimitiveName
) {
  component.displayName = name;
  component.__stepperPrimitive = name;
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

    const primitiveName = getStepperPrimitiveName(child.type);

    if (primitiveName === STEPPER_PRIMITIVES.item) {
      const props = child.props as Pick<StepperItemProps, "disabled" | "value">;

      steps.push({
        value: props.value,
        disabled: Boolean(props.disabled),
      });

      return;
    }

    if (primitiveName === STEPPER_PRIMITIVES.content) {
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

function hasStepperPrimitiveChild(
  children: React.ReactNode,
  name?: StepperPrimitiveName
): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) {
      return false;
    }

    const primitiveName = getStepperPrimitiveName(child.type);

    if (name ? primitiveName === name : primitiveName) {
      return true;
    }

    if (
      typeof child.props === "object" &&
      child.props !== null &&
      "children" in child.props
    ) {
      const childProps = child.props as { children?: React.ReactNode };

      return hasStepperPrimitiveChild(childProps.children, name);
    }

    return false;
  });
}

export {
  STEPPER_PRIMITIVES,
  areRegisteredStepsEqual,
  collectSteps,
  getNextEnabledStep,
  getPreviousEnabledStep,
  getSafeId,
  getStepperPrimitiveName,
  getStepperStepMeta,
  hasStepperPrimitiveChild,
  markStepperPrimitive,
  sortRegisteredSteps,
  toStepRecord,
};

export type { StepperPrimitiveName };
