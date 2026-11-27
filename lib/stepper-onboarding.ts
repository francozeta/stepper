export const stages = ["business", "preferences", "review"] as const;
export type Stage = (typeof stages)[number];
export const labels: Record<Stage, string> = { business: "Business", preferences: "Preferences", review: "Review" };

export function navigationError(current: Stage, target: string, name: string, currency: string): string | undefined {
  const index = stages.findIndex((stage) => stage === target);
  if (index < 0) return "Unknown stage.";
  if (index <= stages.indexOf(current)) return;
  if (!name.trim()) return "Enter a business name first.";
  if (index > stages.indexOf(current) + 1) return "Complete the intermediate stage first.";
  if (target === "review" && !/^(PEN|USD)$/i.test(currency.trim())) return "Enter PEN or USD as your currency.";
}

export type DemoStep = { ref: string; action: string; args: unknown[] };
export function exampleSteps(stage: Stage, name: string, currency: string, qrTouched: boolean): DemoStep[] {
  const result: DemoStep[] = [];
  if (stage === "business") {
    if (!name.trim()) result.push({ ref: "Business name", action: "setValue", args: ["Café Studio"] });
    result.push({ ref: "Onboarding progress", action: "setValue", args: ["preferences"] });
  }
  if (stage !== "review") {
    if (!currency.trim()) result.push({ ref: "Currency", action: "setValue", args: ["PEN"] });
    if (!qrTouched) result.push({ ref: "QR payments", action: "setChecked", args: [true] });
    result.push({ ref: "Onboarding progress", action: "setValue", args: ["review"] });
  }
  return result;
}
