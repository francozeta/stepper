import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StepperInteractionLab } from "./stepper-interaction-lab";

describe("Stepper spatial interaction lab", () => {
  it("keeps inactive panels in layout but inert and hidden from assistive technology", async () => {
    const user = userEvent.setup();
    const { container } = render(<StepperInteractionLab />);
    const panels = () => Array.from(container.querySelectorAll('[data-slot="stepper-content"]'));
    const controls = container.querySelector("[data-lab-controls]") as HTMLElement;
    expect(screen.getByRole("radio", { name: "Spatial" })).toBeChecked();
    expect(panels()).toHaveLength(3);
    expect(panels()[1]).not.toHaveAttribute("hidden");
    expect(panels()[1]).toHaveAttribute("inert");
    expect(panels()[1]).toHaveAttribute("aria-hidden", "true");
    expect(panels()[1]).toHaveStyle({ visibility: "hidden", gridArea: "1 / 1" });
    await user.type(screen.getByLabelText("Workspace name"), "Studio");
    await user.click(within(controls).getByRole("button", { name: "Continue" }));
    expect(panels()[0]).toHaveAttribute("inert");
    expect(panels()[1]).not.toHaveAttribute("inert");
    expect(panels()[1]).not.toHaveAttribute("aria-hidden");
    await user.click(within(controls).getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText("Workspace name")).toHaveValue("Studio");
    expect(container.querySelector("[data-lab-controls]")).toBe(controls);
    await user.click(screen.getByRole("radio", { name: "Instant" }));
    expect(panels()[1]).toHaveAttribute("hidden");
    expect(panels()[1]).not.toHaveAttribute("inert");
  });
  it("recovers keyboard focus at the last stage without losing input", async () => {
    const user = userEvent.setup();
    const { container } = render(<StepperInteractionLab />);
    await user.click(screen.getByRole("radio", { name: "Continuity" }));
    await user.type(screen.getByLabelText("Workspace name"), "Studio");
    const controls = container.querySelector("[data-lab-controls]") as HTMLElement;
    const next = within(controls).getByRole("button", { name: "Continue" });
    await user.click(next);
    next.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: "Everything in place." })).toHaveFocus();
    expect(screen.getByText("Workspace: Studio")).toBeVisible();
    expect(container.querySelector("[data-lab-controls]")).toBe(controls);
    await user.click(within(controls).getByRole("button", { name: "Back" }));
    await user.click(within(controls).getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText("Workspace name")).toHaveValue("Studio");
  });
});
