import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  StepperExample,
  StepperRoutePatternExample,
} from "@/components/stepper-examples";

describe("Stepper examples", () => {
  it("keeps the active workspace step visually current after returning from a completed step", async () => {
    const user = userEvent.setup();

    render(<StepperExample />);

    await user.type(screen.getByLabelText("Workspace name"), "Acme");
    await user.type(screen.getByLabelText("Workspace slug"), "acme");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.click(screen.getByRole("button", { name: /Back/ }));

    const workspaceStep = screen
      .getByText("Workspace")
      .closest('[data-slot="stepper-item"]');

    expect(workspaceStep).toHaveAttribute("data-state", "active");
    expect(
      workspaceStep?.querySelector('[data-slot="stepper-indicator"] .lucide-check')
    ).not.toBeInTheDocument();
  });

  it("marks previous route steps completed when the route preview reaches review", async () => {
    const user = userEvent.setup();

    render(<StepperRoutePatternExample />);

    await user.click(screen.getByRole("link", { name: /Review/ }));

    expect(
      screen.getByText("Members").closest('[data-slot="stepper-item"]')
    ).toHaveAttribute("data-state", "completed");
  });
});
