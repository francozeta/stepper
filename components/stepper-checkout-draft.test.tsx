import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { StepperCheckoutDraft } from "@/components/stepper-checkout-draft";

describe("Stepper checkout draft", () => {
  it("uses account, payment, and confirmation steps for guest checkout", async () => {
    const user = userEvent.setup();

    render(<StepperCheckoutDraft />);

    expect(
      screen.getByRole("button", { name: /Step 1:\s*Account/ })
    ).toHaveAttribute("aria-current", "step");
    expect(
      screen.getByRole("button", { name: /Step 2:\s*Payment/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Step 3:\s*Confirmation/ })
    ).toBeInTheDocument();

    const email = screen.getByLabelText("Email");

    await user.clear(email);
    await user.type(email, "buyer@steppr.dev");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByLabelText("Card number")).toBeInTheDocument();
    expect(screen.getByText("buyer@steppr.dev")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByRole("button", { name: /Step 3:\s*Confirmation/ })
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("buyer@steppr.dev")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirm subscription" })
    ).toBeInTheDocument();
  });

  it("starts authenticated checkout at payment and keeps account as read-only state", () => {
    render(<StepperCheckoutDraft mode="authenticated" />);

    expect(
      screen.queryByRole("button", { name: /Account/ })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Step 1:\s*Payment/ })
    ).toHaveAttribute("aria-current", "step");
    expect(
      screen.getByRole("button", { name: /Step 2:\s*Confirmation/ })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.getByText("reader@steppr.dev")).toBeInTheDocument();
  });
});
