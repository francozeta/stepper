import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn migration: Stepper class contracts", () => {
  it("retains conditional and override behavior", () => {
    expect(cn("flex p-4", false, null, ["p-1", { "rounded-full": true }])).toBe("flex p-1 rounded-full");
    expect(cn("rounded-none bg-background", "rounded-full bg-transparent")).toBe("rounded-full bg-transparent");
    expect(cn("border border-border/70 p-4 shadow-sm", "border-0 p-1 shadow-none")).toBe("border-border/70 border-0 p-1 shadow-none");
  });
  it("keeps modifier boundaries, logical geometry and connector transforms", () => {
    const value = cn(
      "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
      "sm:focus-visible:outline-offset-2",
      "after:origin-left rtl:after:origin-right after:[transform:scaleX(var(--stepper-connector-fill,0))]",
      "start-[calc(50%_+_var(--stepper-separator-offset))] end-[calc(-50%_+_var(--stepper-separator-offset))]",
      "motion-reduce:transition-none",
    );
    for (const token of [
      "focus-visible:outline-2", "focus-visible:outline-offset-[-2px]", "focus-visible:outline-ring",
      "sm:focus-visible:outline-offset-2", "after:origin-left", "rtl:after:origin-right",
      "after:[transform:scaleX(var(--stepper-connector-fill,0))]",
      "start-[calc(50%_+_var(--stepper-separator-offset))]",
      "end-[calc(-50%_+_var(--stepper-separator-offset))]", "motion-reduce:transition-none",
    ]) expect(value.split(" ")).toContain(token);
  });
});
