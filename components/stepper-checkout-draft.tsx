"use client";

import * as React from "react";
import { Lock } from "lucide-react";

import { StepperLogo } from "@/components/stepper-logo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
  useStepper,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

const checkoutSteps = [
  {
    value: "account",
    label: "Account",
  },
  {
    value: "plan",
    label: "Plan",
  },
  {
    value: "payment",
    label: "Payment",
  },
] as const;

type CheckoutStep = (typeof checkoutSteps)[number]["value"];
type PaymentMethod = "card" | "cash-app" | "bank";

const checkoutProduct = {
  brand: "steppr.dev",
  title: "Stepper Pro - Monthly Subscription",
  price: 7.99,
  interval: "mo",
  customerEmail: "reader@steppr.dev",
  company: "Steppr Software Inc.",
};

const paymentMethods = [
  {
    value: "card",
    label: "Card",
    description: "Visa, Mastercard",
    icon: CardPaymentIcon,
  },
  {
    value: "cash-app",
    label: "Cash App Pay",
    description: "Fast wallet",
    icon: CashAppPaymentIcon,
  },
  {
    value: "bank",
    label: "US bank account",
    description: "ACH debit",
    icon: BankPaymentIcon,
  },
] as const;

const countries = [
  { value: "pe", label: "Peru" },
  { value: "us", label: "United States" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "es", label: "Spain" },
  { value: "gb", label: "United Kingdom" },
  { value: "mx", label: "Mexico" },
  { value: "br", label: "Brazil" },
  { value: "cl", label: "Chile" },
  { value: "ar", label: "Argentina" },
  { value: "co", label: "Colombia" },
  { value: "jp", label: "Japan" },
  { value: "sg", label: "Singapore" },
] as const;

function StepperCheckoutDraft() {
  const [step, setStep] = React.useState<CheckoutStep>("payment");
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>("card");
  const [country, setCountry] = React.useState("pe");
  const [discountOpen, setDiscountOpen] = React.useState(false);
  const [businessPurchase, setBusinessPurchase] = React.useState(false);
  const discountInputRef = React.useRef<HTMLInputElement>(null);
  const currentStepIndex = checkoutSteps.findIndex((item) => item.value === step);
  const subtotal = checkoutProduct.price;
  const taxes = 0.0;
  const total = subtotal + taxes;

  React.useEffect(() => {
    if (discountOpen) {
      discountInputRef.current?.focus();
    }
  }, [discountOpen]);

  return (
    <section className="min-h-dvh bg-[#080808] text-zinc-50">
      <div className="mx-auto grid min-h-dvh w-full max-w-6xl lg:grid-cols-[minmax(18rem,0.9fr)_minmax(24rem,1.1fr)]">
        <aside className="relative bg-[#080808] px-2 py-6 sm:px-8 lg:px-10 lg:py-10">
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-7">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-white/[0.08] text-zinc-100">
                  <StepperLogo className="h-4 w-auto" />
                </span>
                <p className="text-xs font-semibold text-zinc-50">
                  {checkoutProduct.brand}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-50 sm:text-sm">
                  {checkoutProduct.title}
                </p>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                    ${checkoutProduct.price.toFixed(2)}
                  </span>
                  <span className="pb-0.5 text-sm font-semibold text-white">
                    / {checkoutProduct.interval}
                  </span>
                </div>
              </div>

              <div className="space-y-3 py-3">
                <SummaryRow
                  label="Subtotal"
                  value={`$${subtotal.toFixed(2)} / ${checkoutProduct.interval}`}
                />
                <SummaryRow label="Taxes" value={`$${taxes.toFixed(2)}`} />
                <SummaryRow
                  label="Monthly"
                  value={`$${total.toFixed(2)} / ${checkoutProduct.interval}`}
                  strong
                />
              </div>

              {discountOpen ? (
                <input
                  ref={discountInputRef}
                  aria-label="Discount code"
                  placeholder="Discount code"
                  className={inputClassName}
                />
              ) : (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="h-8 rounded-full bg-white/[0.075] px-4 text-xs font-semibold text-zinc-100 transition-colors hover:bg-white/[0.12]"
                    onClick={() => setDiscountOpen(true)}
                  >
                    Add discount code
                  </button>
                </div>
              )}
            </div>

            <div className="hidden gap-3 text-xs text-zinc-600 lg:grid">
              <p>Source-owned checkout UI for shadcn projects.</p>
              <p>No payment provider is wired in this draft.</p>
            </div>
          </div>
        </aside>

        <div className="bg-[#080808] px-2 pb-8 pt-4 sm:px-8 lg:bg-[#0b0b0b] lg:px-12 lg:py-10">
          <div className="mx-auto flex w-full max-w-md flex-col gap-5">
            <Stepper
              value={step}
              onValueChange={(nextStep) => setStep(nextStep as CheckoutStep)}
              steps={checkoutSteps}
              className="gap-4"
            >
              <StepperList
                aria-label="Checkout progress"
                className="hidden"
              >
                {checkoutSteps.map((item, index) => {
                  const completed = index < currentStepIndex;

                  return (
                    <StepperItem
                      key={item.value}
                      value={item.value}
                      completed={completed}
                      separator={false}
                    >
                      {item.label}
                    </StepperItem>
                  );
                })}
              </StepperList>

              <StepperContent
                value="account"
                className="border-0 bg-transparent p-0 shadow-none"
              >
                <PanelHeader
                  eyebrow="Account"
                  title="Confirm your email"
                  description="The checkout keeps account state separate from payment details."
                />
                <Field label="Email" id="draft-account-email">
                  <input
                    id="draft-account-email"
                    type="email"
                    defaultValue={checkoutProduct.customerEmail}
                    className={inputClassName}
                  />
                </Field>
              </StepperContent>

              <StepperContent
                value="plan"
                className="border-0 bg-transparent p-0 shadow-none"
              >
                <PanelHeader
                  eyebrow="Plan"
                  title="Monthly subscription"
                  description="The selected plan appears in the order summary."
                />
                <div className="border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        {checkoutProduct.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Monthly access, billed today.
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-50">
                      ${checkoutProduct.price.toFixed(2)}/
                      {checkoutProduct.interval}
                    </p>
                  </div>
                </div>
              </StepperContent>

              <StepperContent
                value="payment"
                className="border-0 bg-transparent p-0 shadow-none"
              >
                <div className="flex flex-col gap-5">
                  <Field label="Email" id="draft-checkout-email">
                    <input
                      id="draft-checkout-email"
                      type="email"
                      placeholder="you@example.com"
                      className={inputClassName}
                    />
                  </Field>

                  <div className="grid gap-2">
                    <p className="text-xs font-medium text-zinc-200">
                      Payment method
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const selected = paymentMethod === method.value;

                        return (
                          <button
                            key={method.value}
                            type="button"
                            className={cn(
                              "min-h-[4.125rem] rounded-md border p-2.5 text-left transition-colors",
                              selected
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-white/10 bg-white/[0.035] text-zinc-400 hover:border-white/20 hover:text-zinc-100"
                            )}
                            onClick={() => setPaymentMethod(method.value)}
                          >
                            <span className="mb-1.5 block">
                              <Icon />
                            </span>
                            <span className="block text-xs font-semibold">
                              {method.label}
                            </span>
                            <span
                              className={cn(
                                "mt-1 hidden text-[0.68rem] sm:block",
                                selected ? "text-blue-100" : "text-zinc-600"
                              )}
                            >
                              {method.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <Lock className="size-3.5" aria-hidden="true" />
                    Secure, fast checkout with Link
                  </div>

                  <Field label="Card number" id="draft-card-number">
                    <div className="relative">
                      <input
                        id="draft-card-number"
                        inputMode="numeric"
                        placeholder="1234 1234 1234 1234"
                        className={cn(inputClassName, "pr-24")}
                      />
                      <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                        <VisaLogo />
                        <MastercardLogo />
                        <AmexLogo />
                        <DinersClubLogo />
                      </span>
                    </div>
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Expiration date" id="draft-expiration">
                      <input
                        id="draft-expiration"
                        inputMode="numeric"
                        placeholder="MM / YY"
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Security code" id="draft-cvc">
                      <div className="relative">
                        <input
                          id="draft-cvc"
                          inputMode="numeric"
                          placeholder="CVC"
                          className={cn(inputClassName, "pr-12")}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                          <CardCvcIcon />
                        </span>
                      </div>
                    </Field>
                  </div>

                  <Field label="Cardholder name" id="draft-cardholder">
                    <input
                      id="draft-cardholder"
                      placeholder="Avery Stone"
                      className={inputClassName}
                    />
                  </Field>

                  <Field label="Billing address" id="draft-country">
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger
                        id="draft-country"
                        className={selectTriggerClassName}
                      >
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        className="max-h-64 rounded-md border border-white/10 bg-[#171717] text-zinc-100 shadow-2xl ring-0"
                      >
                        <SelectGroup className="p-1">
                          {countries.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              className="rounded-md px-3 py-2 text-sm text-zinc-300 focus:!bg-blue-500 focus:!text-white data-[highlighted]:!bg-blue-500 data-[highlighted]:!text-white data-[state=checked]:!bg-blue-500 data-[state=checked]:!text-white"
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <label className="flex items-center gap-2 text-xs text-zinc-500">
                    <input
                      type="checkbox"
                      checked={businessPurchase}
                      onChange={(event) =>
                        setBusinessPurchase(event.target.checked)
                      }
                      className="size-3.5 accent-blue-500"
                    />
                    I am purchasing as a business
                  </label>

                  {businessPurchase ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <h3 className="text-sm font-semibold text-zinc-50">
                        Business Details
                      </h3>
                      <div className="mt-4 grid gap-3">
                        <input
                          aria-label="Business name"
                          placeholder="Business name"
                          className={inputClassName}
                        />
                        <input
                          aria-label="Tax ID"
                          placeholder="Tax ID (Optional)"
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </StepperContent>

              <CheckoutActions />
            </Stepper>

            <p className="px-2 pt-3 text-center text-[0.68rem] leading-5 text-zinc-600">
              By clicking subscribe, you authorize {checkoutProduct.company} to
              charge your selected payment method according to the terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutActions() {
  const { canGoNext, currentIndex, goNext, totalSteps, value } =
    useStepper<CheckoutStep>();
  const isPaymentStep = value === "payment";

  return (
    <div className="flex flex-col gap-3 pt-3">
      <Button
        type="button"
        className="h-12 w-full rounded-full bg-zinc-100 text-zinc-950 hover:bg-white"
        disabled={!isPaymentStep && !canGoNext}
        onClick={() => {
          if (!isPaymentStep) {
            goNext();
          }
        }}
      >
        {isPaymentStep ? "Subscribe now" : "Continue"}
      </Button>
      <p className="sr-only">
        Step {currentIndex + 1} of {totalSteps}
      </p>
    </div>
  );
}

function CardPaymentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2H0zm0 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6H0zm3 5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CashAppPaymentIcon() {
  return (
    <span
      aria-hidden="true"
      className="block size-4 rounded-[3px] bg-[#00d64f] bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://js.stripe.com/v3/fingerprinted/img/payment-methods/icon-pm-cashapp-981164a833e417d28a8ac2684fda2324.svg)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}

function BankPaymentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5 7.5V14h1.5V7.5h3V14H11V7.5h3V14h1a1 1 0 0 1 1 1v1H0v-1a1 1 0 0 1 1-1h1V7.5h3zM8 0c4.681 2.572 7.181 3.95 7.5 4.134A1 1 0 0 1 14.98 6H1.02A1 1 0 0 1 .5 4.134C.82 3.95 3.32 2.572 8 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className="h-4 w-6"
      fill="none"
    >
      <g clipPath="url(#steppr-visa-clip)">
        <path
          fill="#00579f"
          d="M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2"
        />
        <path
          fill="#fff"
          d="M10.367 10.91H8.85l.949-5.802h1.517zm5.501-5.66a3.8 3.8 0 0 0-1.36-.247c-1.5 0-2.555.79-2.561 1.92-.013.833.755 1.296 1.33 1.574.587.284.786.469.786.722-.006.389-.474.568-.91.568-.607 0-.931-.092-1.425-.309l-.2-.092-.212 1.302c.356.16 1.012.303 1.692.309 1.593 0 2.63-.778 2.642-1.982.006-.66-.4-1.166-1.274-1.58-.53-.265-.856-.444-.856-.716.006-.247.275-.5.874-.5.493-.012.856.105 1.13.222l.138.062z"
        />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M18.584 5.108h1.174l1.224 5.802h-1.405l-.18-.87h-1.95c-.055.154-.318.87-.318.87h-1.592l2.254-5.32c.156-.377.431-.482.793-.482m-.093 2.124-.606 1.623h1.261c-.062-.29-.35-1.679-.35-1.679l-.106-.5a31 31 0 0 1-.2.556"
          clipRule="evenodd"
        />
        <path
          fill="#fff"
          d="M7.582 5.108 6.096 9.065l-.162-.803c-.275-.926-1.136-1.931-2.098-2.432l1.361 5.074h1.605l2.385-5.796z"
        />
        <path
          fill="#fff"
          d="M4.716 5.108H2.275l-.025.118c1.904.481 3.166 1.641 3.684 3.036l-.53-2.666c-.088-.37-.357-.475-.688-.488"
        />
      </g>
      <defs>
        <clipPath id="steppr-visa-clip">
          <path fill="#fff" d="M0 0h24v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className="h-4 w-6"
      fill="none"
    >
      <rect width="24" height="16" fill="#252525" rx="2" />
      <circle cx="9" cy="8" r="5" fill="#eb001b" />
      <circle cx="15" cy="8" r="5" fill="#f79e1b" />
      <path
        d="M12 4c1.214.912 2 2.364 2 4s-.786 3.088-2 4c-1.214-.912-2-2.364-2-4s.786-3.088 2-4z"
        fill="#ff5f00"
      />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className="h-4 w-6"
      fill="none"
    >
      <g clipPath="url(#steppr-amex-clip)">
        <path
          fill="#0193ce"
          d="M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2"
        />
        <path
          fill="#fff"
          d="m19.127 8.063 2.278-2.333h-3.037l-.823.883-.696-.883h-3.505v.63h3.252l.949 1.135L18.62 6.36h1.139l-1.646 1.703 1.646 1.575h-1.14l-1.075-1.133-.986 1.133h-3.215v.632h3.505l.696-.883.823.883h3.037z"
        />
        <path
          fill="#fff"
          d="M14.19 9.009h1.9l.885-.946-.76-.946h-2.024v.63h1.772v.631H14.19z"
        />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="m5.478 9.514-.262.756H2.595l2.228-4.54h2.102l.258.504V5.73h2.621l.525 1.261.524-1.261h2.49v4.54h-1.972v-.63l-.256.63H9.542l-.262-.63v.63H6.396l-.262-.756zm6.424.126h.782l.004-3.28h-1.31l-1.05 2.27L9.28 6.36H7.97v3.027L6.395 6.36H5.347L3.774 9.64h.918l.262-.757h1.704l.262.757h1.836V7.117l1.18 2.523h.786l1.18-2.523zM6.396 8.252l-.524-1.387-.656 1.387z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="steppr-amex-clip">
          <path fill="#fff" d="M0 0h24v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DinersClubLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className="h-4 w-6"
      fill="none"
    >
      <path
        d="M21.997 15.75H22c.955.008 1.74-.773 1.751-1.746V2.006a1.789 1.789 0 0 0-.52-1.25A1.72 1.72 0 0 0 21.997.25H2.001A1.718 1.718 0 0 0 .77.757c-.33.33-.517.779-.521 1.247v11.99c.004.47.191.92.52 1.25.329.328.771.51 1.233.506h19.994Zm0 .5h-.002.002Z"
        stroke="#ddd"
        fill="#fff"
      />
      <path
        d="M10.002 2.052v-.016h4v.016a6 6 0 0 1 0 11.968v.016h-4v-.016a6 6 0 0 1 0-11.968Z"
        fill="#0165AC"
      />
      <path
        d="M11.602 11.428a3.6 3.6 0 0 0 0-6.784v6.784Zm-2.4-6.784a3.6 3.6 0 0 0 0 6.784V4.644Zm1.2 8.592a5.2 5.2 0 1 1 0-10.4 5.2 5.2 0 0 1 0 10.4Z"
        fill="#fff"
      />
    </svg>
  );
}

function CardCvcIcon() {
  return (
    <svg
      aria-labelledby="steppr-cvc-icon-title"
      role="img"
      width="30"
      height="20"
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="h-5 w-[30px]"
    >
      <title id="steppr-cvc-icon-title">Credit or debit card CVC</title>
      <g opacity="0.74">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.2061 0.00488281C27.3194 0.112115 29 1.85996 29 4V11.3291C28.5428 11.0304 28.0336 10.8304 27.5 10.7188V8H1.5V16C1.5 17.3807 2.61929 18.5 4 18.5H10.1104V20H4L3.79395 19.9951C1.7488 19.8913 0.108652 18.2512 0.00488281 16.2061L0 16V4C0 1.85996 1.68056 0.112115 3.79395 0.00488281L4 0H25L25.2061 0.00488281ZM4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V5H27.5V4C27.5 2.61929 26.3807 1.5 25 1.5H4Z"
        />
        <path d="M27.5 12.7988C28.3058 13.1128 28.7725 13.7946 28.7725 14.6406C28.7722 15.4002 28.2721 15.9399 27.6523 16.1699C28.1601 16.3319 28.6072 16.6732 28.8086 17.2207C28.3597 18.6222 27.1605 19.6862 25.6826 19.9404C24.8389 19.7707 24.1662 19.2842 23.834 18.5H25C25.0914 18.5 25.1816 18.4939 25.2705 18.4844C25.5434 18.7862 25.9284 18.9501 26.3623 18.9502C27.142 18.9501 27.6922 18.5297 27.6924 17.79C27.6923 17.4212 27.5473 17.1544 27.2998 16.9795C27.4281 16.6786 27.5 16.3478 27.5 16V15.0527C27.5397 14.9481 27.5625 14.8309 27.5625 14.7002C27.5625 14.5657 27.5399 14.4422 27.5 14.3311V12.7988Z" />
        <path d="M15.2207 18.5V18.8301H16.8799V19.9004H12.1104V18.8301H13.9902V18.5H15.2207Z" />
        <path d="M19.9307 18.5L19.5762 18.7803H22.8369V19.9004H17.8164V18.8604L18.2549 18.5H19.9307Z" />
      </g>
      <path d="M26.3822 20.01C24.9722 20.01 23.8522 19.25 23.6422 17.81L24.8722 17.58C24.9922 18.45 25.6022 18.95 26.3622 18.95C27.1422 18.95 27.6922 18.53 27.6922 17.79C27.6922 17.05 27.1122 16.72 26.2822 16.72H25.5722V15.67H26.3022C27.0622 15.67 27.5622 15.34 27.5622 14.7C27.5622 14.07 27.1022 13.68 26.3922 13.68C25.6422 13.68 25.1322 14.18 24.9822 14.92L23.8122 14.76C24.0022 13.55 24.9822 12.61 26.4322 12.61C27.8822 12.61 28.7722 13.47 28.7722 14.64C28.7722 15.4 28.2722 15.94 27.6522 16.17C28.3422 16.39 28.9222 16.94 28.9222 17.89C28.9222 19.04 27.9522 20.01 26.3822 20.01Z" />
      <path d="M17.8161 18.86L19.6161 17.38C20.5961 16.58 21.4761 15.87 21.4761 14.97C21.4761 14.23 21.0161 13.7 20.2561 13.7C19.5061 13.7 19.0161 14.29 19.0161 15C19.0161 15.23 19.0561 15.46 19.1361 15.68H17.9461C17.8461 15.39 17.8161 15.2 17.8161 14.93C17.8161 13.58 18.9261 12.61 20.2861 12.61C21.7861 12.61 22.7461 13.54 22.7461 14.89C22.7461 16.16 21.7861 17.03 20.7761 17.83L19.5761 18.78H22.8361V19.9H17.8161V18.86Z" />
      <path d="M14.25 12.67H15.22V18.83H16.88V19.9H12.11V18.83H13.99V14.92H12.15V13.99L12.88 13.93C13.78 13.86 14.18 13.58 14.25 12.67Z" />
    </svg>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 text-sm",
        strong ? "font-semibold text-zinc-100" : "text-zinc-500"
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PanelHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-zinc-50">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-xs font-medium text-zinc-200">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "h-10 w-full rounded-md border border-white/10 bg-white/[0.045] px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-white/25 focus:bg-white/[0.065]";

const selectTriggerClassName =
  "h-10 w-full rounded-md border-white/10 bg-white/[0.045] px-3 text-sm text-zinc-100 hover:bg-white/[0.065] focus-visible:border-white/25 focus-visible:ring-0 data-placeholder:text-zinc-700 [&>svg]:text-zinc-500";

export { StepperCheckoutDraft };
