import { describe, it, expect } from "vitest";
import { assistancePlan, exampleSteps, navigationError, navigationIssue } from "./stepper-onboarding";

describe("agent-ready onboarding policy", () => {
  it("blocks missing data and skipped stages, but allows going back", () => {
    expect(navigationError("business", "preferences", "", "")).toBeTruthy();
    expect(navigationError("business", "review", "Studio", "PEN")).toBeTruthy();
    expect(navigationError("preferences", "review", "Studio", "invalid")).toBeTruthy();
    expect(navigationError("preferences", "review", "Studio", "PEN")).toBeUndefined();
    expect(navigationError("review", "business", "", "")).toBeUndefined();
  });
  it("stops a sample plan at the same validation boundary as manual navigation", () => {
    const complete = assistancePlan("business", "", "", false);
    expect(complete.steps).toHaveLength(5);
    expect(complete.issue).toBeUndefined();
    const cleared = assistancePlan("business", "", "", false, { name: true });
    expect(cleared.steps).toEqual([]);
    expect(cleared.issue).toEqual(navigationIssue("business", "preferences", "", ""));
    const invalid = assistancePlan("business", "Studio", "invalid", true);
    expect(invalid.steps).toEqual([{ ref: "Onboarding progress", action: "setValue", args: ["preferences"] }]);
    expect(invalid.issue).toEqual(navigationIssue("preferences", "review", "Studio", "invalid"));
    const resumed = assistancePlan("preferences", "Studio", "USD", true);
    expect(resumed.steps).toEqual([{ ref: "Onboarding progress", action: "setValue", args: ["review"] }]);
    expect(resumed.issue).toBeUndefined();
  });

  it("prepares a sample without overwriting existing decisions", () => {
    expect(exampleSteps("business", "", "", false).map((step) => step.ref)).toEqual(["Business name", "Onboarding progress", "Currency", "QR payments", "Onboarding progress"]);
    expect(exampleSteps("business", "My café", "USD", true)).toEqual([
      { ref: "Onboarding progress", action: "setValue", args: ["preferences"] },
      { ref: "Onboarding progress", action: "setValue", args: ["review"] },
    ]);
    expect(exampleSteps("review", "Studio", "PEN", true)).toEqual([]);
    // A blank field can be a deliberate human edit, not an invitation to overwrite.
    expect(exampleSteps("business", "", "", true, { name: true, currency: true })).toEqual([
      { ref: "Onboarding progress", action: "setValue", args: ["preferences"] },
      { ref: "Onboarding progress", action: "setValue", args: ["review"] },
    ]);
  });
});
