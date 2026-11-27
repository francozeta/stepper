import type { Metadata } from "next";
import { StepperInteractionLab } from "@/components/stepper-interaction-lab";

export const metadata: Metadata = {
  title: "Interaction lab - Stepper",
  description: "Experimental multi-step interaction comparison.",
  robots: { index: false, follow: false },
};

export default function InteractionLabPage() {
  return <StepperInteractionLab />;
}
