import {
  Stepper,
  StepperContent,
  StepperItem,
  useStepper,
  type StepperStepInput,
  type StepperStepsValue,
} from "@/components/ui/stepper";

const checkoutSteps = [
  { value: "account" },
  { value: "profile" },
  { value: "done", disabled: true },
] as const satisfies readonly StepperStepInput[];

type CheckoutStep = StepperStepsValue<typeof checkoutSteps>;

function TypedStepperExamples() {
  return (
    <>
      <Stepper
        steps={checkoutSteps}
        value="account"
        onValueChange={(value) => {
          const step: CheckoutStep = value;
          void step;

          // @ts-expect-error The inferred step value cannot be an arbitrary string.
          const invalid: "banana" = value;
          void invalid;
        }}
      >
        <StepperItem<CheckoutStep> value="profile">Profile</StepperItem>
        <StepperContent<CheckoutStep> value="done">Done</StepperContent>

        {/* @ts-expect-error Content values can be constrained by the step value union. */}
        <StepperContent<CheckoutStep> value="banana">Broken</StepperContent>
      </Stepper>

      {/* @ts-expect-error Literal steps constrain controlled values. */}
      <Stepper steps={checkoutSteps} value="banana" />
    </>
  );
}

function TypedHookExample() {
  const stepper = useStepper<CheckoutStep>();

  stepper.setValue("profile");

  // @ts-expect-error setValue accepts only the configured step value union.
  stepper.setValue("banana");

  return null;
}

void TypedStepperExamples;
void TypedHookExample;
