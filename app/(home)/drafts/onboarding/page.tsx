import type { Metadata } from "next";
import { StepperAgentOnboarding } from "@/components/stepper-agent-onboarding";

export const metadata: Metadata = {
  title: "Agent-ready onboarding - Stepper",
  description: "An experimental UI SDK onboarding bridge.",
  robots: { index: false, follow: false },
};

export default function AgentOnboardingPage() {
  return <StepperAgentOnboarding />;
}
