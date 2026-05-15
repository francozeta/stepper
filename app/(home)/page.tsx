import type { Metadata } from "next";

import { StepperHome } from "@/components/stepper-home";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function HomePage() {
  return <StepperHome />;
}
