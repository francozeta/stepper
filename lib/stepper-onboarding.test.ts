import { describe, it, expect } from "vitest";
import { exampleSteps, navigationError } from "./stepper-onboarding";

describe("agent-ready onboarding policy", () => {
  it("blocks missing data and skipped stages, but allows going back", () => {
    expect(navigationError("business", "preferences", "", "")).toBeTruthy();
    expect(navigationError("business", "review", "Studio", "PEN")).toBeTruthy();
    expect(navigationError("preferences", "review", "Studio", "invalid")).toBeTruthy();
    expect(navigationError("preferences", "review", "Studio", "PEN")).toBeUndefined();
    expect(navigationError("review", "business", "", "")).toBeUndefined();
  });
  it("prepares a sample without overwriting existing decisions", () => {
    expect(exampleSteps("business", "", "", false).map((step) => step.ref)).toEqual(["Business name", "Onboarding progress", "Currency", "QR payments", "Onboarding progress"]);
    expect(exampleSteps("business", "My café", "USD", true)).toEqual([
      { ref: "Onboarding progress", action: "setValue", args: ["preferences"] },
      { ref: "Onboarding progress", action: "setValue", args: ["review"] },
    ]);
    expect(exampleSteps("review", "Studio", "PEN", true)).toEqual([]);
  });
});
