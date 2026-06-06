import type { Metadata } from "next";

import { BlockDemoBar } from "@/components/block-demo-bar";
import { StepperCheckoutDraft } from "@/components/stepper-checkout-draft";

export const metadata: Metadata = {
  title: "Subscription Checkout - Stepper",
  description:
    "A Stepper checkout block preview with account, payment, and confirmation steps.",
};

export default function SubscriptionCheckoutBlockPage() {
  return (
    <div className="min-h-dvh bg-[#080808]">
      <StepperCheckoutDraft />
      <BlockDemoBar name="subscription-checkout" />
    </div>
  );
}
