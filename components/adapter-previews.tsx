"use client";

import * as React from "react";
import {
  Check,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  PackageCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperTrigger,
  useStepperItem,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

type AdapterStep = "contact" | "shipping" | "payment";

type CheckoutAdapterValues = {
  email: string;
  shippingAddress: string;
  city: string;
  cardNumber: string;
};

const adapterSteps = [
  {
    value: "contact",
    label: "Contact",
    description: "Receipt email",
    icon: Mail,
  },
  {
    value: "shipping",
    label: "Shipping",
    description: "Delivery details",
    icon: Truck,
  },
  {
    value: "payment",
    label: "Payment",
    description: "Backend handoff",
    icon: CreditCard,
  },
] as const;

const fieldsByStep = {
  contact: ["email"],
  shipping: ["shippingAddress", "city"],
  payment: ["cardNumber"],
} satisfies Record<AdapterStep, FieldPath<CheckoutAdapterValues>[]>;

function StepperReactHookFormAdapterPreview() {
  const [step, setStep] = React.useState<AdapterStep>("contact");
  const [completedSteps, setCompletedSteps] = React.useState<
    Partial<Record<AdapterStep, boolean>>
  >({});
  const [submittedValues, setSubmittedValues] =
    React.useState<CheckoutAdapterValues | null>(null);
  const form = useForm<CheckoutAdapterValues>({
    defaultValues: {
      email: "hello@stepper.dev",
      shippingAddress: "Av. Minimal 404",
      city: "Lima",
      cardNumber: "4242",
    },
    mode: "onTouched",
  });
  const values = useWatch({ control: form.control });
  const currentIndex = adapterSteps.findIndex((item) => item.value === step);

  async function canContinue() {
    const isValid = await form.trigger(fieldsByStep[step], {
      shouldFocus: true,
    });

    if (isValid) {
      setCompletedSteps((current) => ({ ...current, [step]: true }));
    }

    return isValid;
  }

  const submitCheckout = form.handleSubmit((nextValues) => {
    setCompletedSteps({
      contact: true,
      shipping: true,
      payment: true,
    });
    setSubmittedValues(nextValues);
  });

  return (
    <form
      className="mx-auto w-full max-w-4xl"
      onSubmit={(event) => void submitCheckout(event)}
    >
      <Stepper
        value={step}
        onValueChange={(nextStep) => {
          setSubmittedValues(null);
          setStep(nextStep);
        }}
        steps={adapterSteps}
        className="gap-5"
      >
        <StepperList className="pb-0">
          {adapterSteps.map((item, index) => {
            const disabled =
              item.value === "shipping"
                ? !completedSteps.contact && currentIndex < index
                : item.value === "payment"
                  ? !completedSteps.shipping && currentIndex < index
                  : false;

            return (
              <StepperItem
                key={item.value}
                value={item.value}
                completed={Boolean(completedSteps[item.value])}
                defaultTrigger={false}
                disabled={disabled}
              >
                <AdapterStepTrigger
                  description={item.description}
                  icon={item.icon}
                  label={item.label}
                />
              </StepperItem>
            );
          })}
        </StepperList>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-h-[17rem] border border-white/10 bg-[#050505] p-4">
            <StepperContent
              value="contact"
              keepMounted
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <PreviewPanel
                description="Validate the user contact step before the flow can move forward."
                icon={Mail}
                title="Contact details"
              >
                <FieldGroup className="gap-3">
                  <Field data-invalid={Boolean(form.formState.errors.email)}>
                    <FieldLabel htmlFor="adapter-email">Email</FieldLabel>
                    <Input
                      id="adapter-email"
                      placeholder="hello@stepper.dev"
                      aria-invalid={Boolean(form.formState.errors.email)}
                      className="h-9 rounded-none border-white/10 bg-[#050505]"
                      {...form.register("email", {
                        required: "Add an email before continuing.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Use a valid email address.",
                        },
                      })}
                    />
                    <FieldDescription>
                      The email stays in React Hook Form, not in Stepper.
                    </FieldDescription>
                    <FieldError errors={[form.formState.errors.email]} />
                  </Field>
                </FieldGroup>
              </PreviewPanel>
            </StepperContent>

            <StepperContent
              value="shipping"
              keepMounted
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <PreviewPanel
                description="The shipping panel can unmount visually while its fields stay registered."
                icon={MapPin}
                title="Shipping route"
              >
                <FieldGroup className="grid gap-3 sm:grid-cols-2">
                  <Field
                    data-invalid={Boolean(
                      form.formState.errors.shippingAddress
                    )}
                  >
                    <FieldLabel htmlFor="adapter-address">Address</FieldLabel>
                    <Input
                      id="adapter-address"
                      placeholder="Av. Minimal 404"
                      aria-invalid={Boolean(
                        form.formState.errors.shippingAddress
                      )}
                      className="h-9 rounded-none border-white/10 bg-[#050505]"
                      {...form.register("shippingAddress", {
                        required: "Add a delivery address.",
                        minLength: {
                          value: 6,
                          message: "Use a more specific address.",
                        },
                      })}
                    />
                    <FieldError
                      errors={[form.formState.errors.shippingAddress]}
                    />
                  </Field>
                  <Field data-invalid={Boolean(form.formState.errors.city)}>
                    <FieldLabel htmlFor="adapter-city">City</FieldLabel>
                    <Input
                      id="adapter-city"
                      placeholder="Lima"
                      aria-invalid={Boolean(form.formState.errors.city)}
                      className="h-9 rounded-none border-white/10 bg-[#050505]"
                      {...form.register("city", {
                        required: "Add a city.",
                      })}
                    />
                    <FieldError errors={[form.formState.errors.city]} />
                  </Field>
                </FieldGroup>
              </PreviewPanel>
            </StepperContent>

            <StepperContent
              value="payment"
              keepMounted
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <PreviewPanel
                description="Submit one final payload after all step boundaries have passed."
                icon={PackageCheck}
                title="Payment handoff"
              >
                <FieldGroup className="gap-3">
                  <Field
                    data-invalid={Boolean(form.formState.errors.cardNumber)}
                  >
                    <FieldLabel htmlFor="adapter-card">
                      Card reference
                    </FieldLabel>
                    <Input
                      id="adapter-card"
                      inputMode="numeric"
                      placeholder="4242"
                      aria-invalid={Boolean(form.formState.errors.cardNumber)}
                      className="h-9 rounded-none border-white/10 bg-[#050505]"
                      {...form.register("cardNumber", {
                        required: "Add a payment reference.",
                        minLength: {
                          value: 4,
                          message: "Use at least 4 digits.",
                        },
                      })}
                    />
                    <FieldDescription>
                      In production this would become your checkout submit.
                    </FieldDescription>
                    <FieldError errors={[form.formState.errors.cardNumber]} />
                  </Field>
                </FieldGroup>
              </PreviewPanel>
            </StepperContent>
          </div>

          <aside className="flex min-h-[17rem] flex-col justify-between border border-white/10 bg-white/[0.018] p-4">
            <div className="space-y-3">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-600">
                  Live values
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  RHF owns the payload while Stepper owns progress.
                </p>
              </div>
              <div className="space-y-2 border-t border-white/10 pt-3">
                <PayloadRow label="email" value={values.email} />
                <PayloadRow label="address" value={values.shippingAddress} />
                <PayloadRow label="city" value={values.city} />
                <PayloadRow label="card" value={maskCard(values.cardNumber)} />
              </div>
            </div>

            <div
              className={cn(
                "border border-white/10 p-3 text-xs leading-5",
                submittedValues
                  ? "bg-zinc-100 text-zinc-950"
                  : "bg-[#050505] text-zinc-500"
              )}
            >
              {submittedValues
                ? "Payload ready for the backend."
                : "Continue through each boundary, then submit."}
            </div>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-zinc-500">
            Values persist across panels with <code>keepMounted</code> and
            React Hook Form.
          </p>
          <div className="flex justify-center gap-2 sm:justify-end">
            <StepperPrevious className="border-white/10 bg-[#050505] text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-100">
              Back
            </StepperPrevious>
            {step === "payment" ? (
              <Button
                type="submit"
                className="h-9 min-w-28 rounded-none bg-zinc-100 px-3 text-zinc-950 hover:bg-white hover:text-zinc-950"
              >
                Submit
                <Check data-icon="inline-end" />
              </Button>
            ) : (
              <StepperNext
                className="min-w-28 bg-zinc-100 text-zinc-950 hover:bg-white hover:text-zinc-950"
                onBeforeNext={canContinue}
              >
                Continue
              </StepperNext>
            )}
          </div>
        </div>
      </Stepper>
    </form>
  );
}

function AdapterStepTrigger({
  label,
  description,
  icon: Icon,
}: {
  label: string;
  description: string;
  icon: LucideIcon;
}) {
  const { disabled, stepPosition, stepState } = useStepperItem();
  const isComplete = stepState === "completed" || stepPosition === "previous";

  return (
    <StepperTrigger>
      <StepperIndicator className="rounded-none border-white/10 bg-[#050505] group-data-[state=active]:bg-zinc-100 group-data-[state=active]:text-zinc-950 group-data-[state=completed]:bg-zinc-100 group-data-[state=completed]:text-zinc-950">
        {disabled ? <Lock /> : isComplete ? <Check /> : <Icon />}
      </StepperIndicator>
      <span className="flex min-w-0 flex-col gap-1">
        <StepperLabel>{label}</StepperLabel>
        <StepperDescription className="hidden max-w-32 sm:block">
          {description}
        </StepperDescription>
      </span>
    </StepperTrigger>
  );
}

function PreviewPanel({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.025]">
          <Icon className="size-4 text-zinc-200" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-100">{title}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function PayloadRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 text-xs">
      <span className="font-mono text-zinc-600">{label}</span>
      <span className="truncate text-zinc-300">{value || "empty"}</span>
    </div>
  );
}

function maskCard(value?: string) {
  const digits = value?.replace(/\D/g, "") ?? "";

  return digits ? `**${digits.slice(-4)}` : "";
}

export { StepperReactHookFormAdapterPreview };
