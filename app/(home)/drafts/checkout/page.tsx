import type { Metadata } from "next";

import { StepperCheckoutDraft } from "@/components/stepper-checkout-draft";

export const metadata: Metadata = {
  title: "Checkout Draft - Stepper",
  description: "Internal checkout block draft for Stepper.",
};

export default function CheckoutDraftPage() {
  return <StepperCheckoutDraft />;
}
