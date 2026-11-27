import type { Metadata } from "next";
import { StepperHandoffLab } from "@/components/stepper-handoff-lab";

export const metadata: Metadata = {
  title: "Handoff lab - Stepper",
  description: "Shared navigation policy experiment.",
  robots: { index: false, follow: false },
};

export default function HandoffLabPage() {
  return <StepperHandoffLab />;
}
