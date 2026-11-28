export const stages = ["business", "preferences", "review"] as const;
export type Stage = (typeof stages)[number];
export const labels: Record<Stage, string> = { business: "Business", preferences: "Preferences", review: "Review" };

export type ValidationIssue = { message: string; field?: "name" | "currency" };

export function navigationIssue(current: Stage, target: string, name: string, currency: string): ValidationIssue | undefined {
  const index = stages.findIndex((stage) => stage === target);
  if (index < 0) return { message: "Unknown stage." };
  if (index <= stages.indexOf(current)) return;
  if (!name.trim()) return { message: "Enter a business name first.", field: "name" };
  if (index > stages.indexOf(current) + 1) return { message: "Complete the intermediate stage first." };
  if (target === "review" && !/^(PEN|USD)$/i.test(currency.trim())) return { message: "Enter PEN or USD as your currency.", field: "currency" };
}

export function navigationError(current: Stage, target: string, name: string, currency: string) {
  return navigationIssue(current, target, name, currency)?.message;
}

export type DemoStep = { ref: string; action: string; args: unknown[] };
export function exampleSteps(stage: Stage, name: string, currency: string, qrTouched: boolean, touched: { name?: boolean; currency?: boolean } = {}): DemoStep[] {
  const result: DemoStep[] = [];
  if (stage === "business") {
    if (!name.trim() && !touched.name) result.push({ ref: "Business name", action: "setValue", args: ["Café Studio"] });
    result.push({ ref: "Onboarding progress", action: "setValue", args: ["preferences"] });
  }
  if (stage !== "review") {
    if (!currency.trim() && !touched.currency) result.push({ ref: "Currency", action: "setValue", args: ["PEN"] });
    if (!qrTouched) result.push({ ref: "QR payments", action: "setChecked", args: [true] });
    result.push({ ref: "Onboarding progress", action: "setValue", args: ["review"] });
  }
  return result;
}

/** A local sample plan may stop at a known validation boundary, but must never bypass it. */
export function assistancePlan(stage: Stage, name: string, currency: string, qrTouched: boolean, touched: { name?: boolean; currency?: boolean } = {}): { steps: DemoStep[]; issue?: ValidationIssue } {
  const steps: DemoStep[] = [];
  let current = stage;
  let plannedName = name;
  let plannedCurrency = currency;
  for (const step of exampleSteps(stage, name, currency, qrTouched, touched)) {
    if (step.ref === "Business name") plannedName = String(step.args[0]);
    if (step.ref === "Currency") plannedCurrency = String(step.args[0]);
    if (step.ref === "Onboarding progress") {
      const target = String(step.args[0]);
      const issue = navigationIssue(current, target, plannedName, plannedCurrency);
      if (issue) return { steps, issue };
      current = target as Stage;
    }
    steps.push(step);
  }
  return { steps };
}
