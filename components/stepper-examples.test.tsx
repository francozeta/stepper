import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { StepperRoutePatternExample } from "@/components/stepper-examples";

describe("Stepper examples", () => {
  it("marks previous route steps completed when the route preview reaches review", async () => {
    const user = userEvent.setup();

    render(<StepperRoutePatternExample />);

    await user.click(screen.getByRole("link", { name: /Review/ }));

    expect(
      screen.getByText("Members").closest('[data-slot="stepper-item"]')
    ).toHaveAttribute("data-state", "completed");
  });
});
