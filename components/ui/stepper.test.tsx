import * as React from "react";
import Link from "next/link";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperNext,
  StepperPrevious,
  StepperTrigger,
  useStepper,
  type StepperItemProps,
} from "@/components/ui/stepper";

function BasicStepper({
  defaultValue = "account",
  value,
  onValueChange,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Stepper
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      <StepperList>
        <StepperItem value="account">Account</StepperItem>
        <StepperItem value="profile">Profile</StepperItem>
        <StepperItem value="payment" disabled>
          Payment
        </StepperItem>
      </StepperList>

      <StepperContent value="account">Account content</StepperContent>
      <StepperContent value="profile">Profile content</StepperContent>
      <StepperContent value="payment">Payment content</StepperContent>
    </Stepper>
  );
}

describe("Stepper", () => {
  it("has no automated accessibility violations in the default markup", async () => {
    const { container } = render(<BasicStepper defaultValue="profile" />);

    expect((await axe(container)).violations).toEqual([]);
  });

  it("renders an accessible progress list and marks the active step", () => {
    render(<BasicStepper defaultValue="profile" />);

    expect(
      screen.getByRole("list", { name: "Progress steps" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Step 2:\s*Profile/ })
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Profile content")).toBeVisible();
    expect(screen.queryByText("Account content")).not.toBeInTheDocument();
  });

  it("distinguishes completed, current, and future steps in the default UI", () => {
    const { container } = render(
      <Stepper defaultValue="payment">
        <StepperList>
          <StepperItem value="account" completed>
            Account
          </StepperItem>
          <StepperItem value="shipping">Shipping</StepperItem>
          <StepperItem value="payment">Payment</StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="shipping">Shipping content</StepperContent>
        <StepperContent value="payment">Payment content</StepperContent>
      </Stepper>
    );

    const account = container.querySelector(
      '[data-slot="stepper-item"][data-state="completed"]'
    );
    const shipping = container.querySelector(
      '[data-slot="stepper-item"][data-position="previous"][data-state="inactive"]'
    );
    const payment = container.querySelector(
      '[data-slot="stepper-item"][data-position="current"][data-state="active"]'
    );

    expect(account).toBeInTheDocument();
    expect(shipping).toBeInTheDocument();
    expect(payment).toBeInTheDocument();
    expect(
      account?.querySelector('[data-slot="stepper-indicator"]')
    ).toHaveTextContent("\u2713");
    expect(
      payment?.querySelector('[data-slot="stepper-indicator"]')
    ).toHaveTextContent("3");
  });

  it("falls back to the first enabled step when the controlled value is missing", async () => {
    const onValueChange = vi.fn();

    render(<BasicStepper value="missing" onValueChange={onValueChange} />);

    expect(screen.getByText("Account content")).toBeVisible();

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("account");
    });
  });

  it("falls back to the first enabled step when defaultValue is missing", () => {
    render(<BasicStepper defaultValue="missing" />);

    expect(screen.getByText("Account content")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Step 1:\s*Account/ })
    ).toHaveAttribute("aria-current", "step");
  });

  it("syncs a controlled value away from a step that becomes disabled", async () => {
    const user = userEvent.setup();

    function ControlledStepper() {
      const [value, setValue] = React.useState("profile");
      const [isProfileDisabled, setIsProfileDisabled] = React.useState(false);

      return (
        <>
          <button type="button" onClick={() => setIsProfileDisabled(true)}>
            Disable profile
          </button>
          <output data-testid="current-value">{value}</output>

          <Stepper value={value} onValueChange={setValue}>
            <StepperList>
              <StepperItem value="account">Account</StepperItem>
              <StepperItem value="profile" disabled={isProfileDisabled}>
                Profile
              </StepperItem>
            </StepperList>

            <StepperContent value="account">Account content</StepperContent>
            <StepperContent value="profile">Profile content</StepperContent>
          </Stepper>
        </>
      );
    }

    render(<ControlledStepper />);

    await user.click(screen.getByRole("button", { name: "Disable profile" }));

    await waitFor(() => {
      expect(screen.getByTestId("current-value")).toHaveTextContent("account");
    });
    expect(screen.getByText("Account content")).toBeVisible();
  });

  it("syncs a controlled value away from a wrapped step that becomes disabled", async () => {
    const user = userEvent.setup();

    const WrappedStep = React.memo(function WrappedStep(
      props: StepperItemProps
    ) {
      return <StepperItem {...props} />;
    });

    function ControlledStepper() {
      const [value, setValue] = React.useState("profile");
      const [isProfileDisabled, setIsProfileDisabled] = React.useState(false);

      return (
        <>
          <button type="button" onClick={() => setIsProfileDisabled(true)}>
            Disable wrapped profile
          </button>
          <output data-testid="wrapped-current-value">{value}</output>

          <Stepper value={value} onValueChange={setValue}>
            <StepperList>
              <WrappedStep value="account">Account</WrappedStep>
              <WrappedStep value="profile" disabled={isProfileDisabled}>
                Profile
              </WrappedStep>
            </StepperList>

            <StepperContent value="account">Account content</StepperContent>
            <StepperContent value="profile">Profile content</StepperContent>
          </Stepper>
        </>
      );
    }

    render(<ControlledStepper />);

    await user.click(
      screen.getByRole("button", { name: "Disable wrapped profile" })
    );

    await waitFor(() => {
      expect(screen.getByTestId("wrapped-current-value")).toHaveTextContent(
        "account"
      );
    });
  });

  it("can select a wrapped step in the same update that enables it", async () => {
    const user = userEvent.setup();

    const WrappedStep = React.memo(function WrappedStep(
      props: StepperItemProps
    ) {
      return <StepperItem {...props} />;
    });

    function ControlledStepper() {
      const [value, setValue] = React.useState("account");
      const [isProfileDisabled, setIsProfileDisabled] = React.useState(true);

      return (
        <>
          <button
            type="button"
            onClick={() => {
              setIsProfileDisabled(false);
              setValue("profile");
            }}
          >
            Enable and select profile
          </button>
          <output data-testid="enabled-current-value">{value}</output>

          <Stepper value={value} onValueChange={setValue}>
            <StepperList>
              <WrappedStep value="account">Account</WrappedStep>
              <WrappedStep value="profile" disabled={isProfileDisabled}>
                Profile
              </WrappedStep>
            </StepperList>

            <StepperContent value="account">Account content</StepperContent>
            <StepperContent value="profile">Profile content</StepperContent>
          </Stepper>
        </>
      );
    }

    render(<ControlledStepper />);

    await user.click(
      screen.getByRole("button", { name: "Enable and select profile" })
    );

    await waitFor(() => {
      expect(screen.getByTestId("enabled-current-value")).toHaveTextContent(
        "profile"
      );
    });
    expect(screen.getByText("Profile content")).toBeVisible();
  });

  it("falls back when the active uncontrolled step is removed", async () => {
    const user = userEvent.setup();

    function ConditionalStepper() {
      const [showProfile, setShowProfile] = React.useState(true);

      return (
        <>
          <button type="button" onClick={() => setShowProfile(false)}>
            Remove profile
          </button>

          <Stepper defaultValue="profile">
            <StepperList>
              <StepperItem value="account">Account</StepperItem>
              {showProfile ? (
                <StepperItem value="profile">Profile</StepperItem>
              ) : null}
            </StepperList>

            <StepperContent value="account">Account content</StepperContent>
            {showProfile ? (
              <StepperContent value="profile">Profile content</StepperContent>
            ) : null}
          </Stepper>
        </>
      );
    }

    render(<ConditionalStepper />);

    expect(screen.getByText("Profile content")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Remove profile" }));

    expect(screen.getByText("Account content")).toBeVisible();
  });

  it("supports wrapped and memoized StepperItem components through registration", async () => {
    const MemoStep = React.memo(function MemoStep(props: StepperItemProps) {
      return <StepperItem {...props} />;
    });

    render(
      <Stepper defaultValue="profile">
        <StepperList>
          <MemoStep value="account">Account</MemoStep>
          <MemoStep value="profile">Profile</MemoStep>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>
      </Stepper>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Step 2:\s*Profile/ })
      ).toHaveAttribute("aria-current", "step");
    });

    expect(screen.getByText("Profile content")).toBeVisible();
  });

  it("warns in development when step values are duplicated", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="account">Duplicate account</StepperItem>
        </StepperList>
      </Stepper>
    );

    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('StepperItem value "account" is duplicated')
      );
    });

    warn.mockRestore();
  });

  it("warns in development when content references a missing step value", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
        </StepperList>

        <StepperContent value="missing">Missing content</StepperContent>
      </Stepper>
    );

    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'StepperContent value "missing" does not match any StepperItem'
        )
      );
    });

    warn.mockRestore();
  });

  it("does not count accidental StepperItems nested inside StepperContent", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    function StepperStatus() {
      const { totalSteps } = useStepper();

      return <output data-testid="nested-total">{totalSteps}</output>;
    }

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
        </StepperList>

        <StepperContent value="account">
          <StepperItem value="nested">Nested</StepperItem>
        </StepperContent>

        <StepperStatus />
      </Stepper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("nested-total")).toHaveTextContent("1");
    });
    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'StepperItem with value "nested" must be rendered inside StepperList'
        )
      );
    });

    warn.mockRestore();
  });

  it("does not render a fallback trigger when primitives are nested inside wrappers", () => {
    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">
            <div>
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Account</StepperLabel>
              </StepperTrigger>
            </div>
          </StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
      </Stepper>
    );

    expect(screen.getAllByRole("button", { name: /Account/ })).toHaveLength(1);
  });

  it("keeps disabled asChild triggers unfocusable and prevents navigation", async () => {
    const user = userEvent.setup();

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="payment" disabled>
            <StepperTrigger asChild>
              <a href="https://example.com/payment">Payment</a>
            </StepperTrigger>
          </StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="payment">Payment content</StepperContent>
      </Stepper>
    );

    const payment = screen.getByRole("link", { name: "Payment" });

    expect(payment).toHaveAttribute("aria-disabled", "true");
    expect(payment).toHaveAttribute("tabindex", "-1");

    await user.click(payment);

    expect(screen.getByText("Account content")).toBeVisible();
    expect(screen.queryByText("Payment content")).not.toBeInTheDocument();
  });

  it("supports disabled asChild triggers rendered with Next Link", async () => {
    const user = userEvent.setup();

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="payment" disabled>
            <StepperTrigger asChild>
              <Link href="/payment">Payment</Link>
            </StepperTrigger>
          </StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="payment">Payment content</StepperContent>
      </Stepper>
    );

    const payment = screen.getByRole("link", { name: "Payment" });

    expect(payment).toHaveAttribute("href", "/payment");
    expect(payment).toHaveAttribute("aria-disabled", "true");
    expect(payment).toHaveAttribute("tabindex", "-1");

    await user.click(payment);

    expect(screen.getByText("Account content")).toBeVisible();
    expect(screen.queryByText("Payment content")).not.toBeInTheDocument();
  });

  it("keeps horizontal lists scrollable on narrow screens", () => {
    const { container } = render(<BasicStepper />);
    const list = container.querySelector('[data-slot="stepper-list"]');

    expect(list).toHaveAttribute("data-orientation", "horizontal");
    expect(list).toHaveClass("data-[orientation=horizontal]:overflow-x-auto");
  });

  it("supports long descriptions in vertical orientation", () => {
    render(
      <Stepper defaultValue="workspace" orientation="vertical">
        <StepperList>
          <StepperItem value="workspace">
            <StepperTrigger>
              <StepperIndicator />
              <span>
                <StepperLabel>Workspace</StepperLabel>
                <StepperDescription>
                  Configure a workspace with a very long description that
                  should remain associated with the trigger.
                </StepperDescription>
              </span>
            </StepperTrigger>
          </StepperItem>
        </StepperList>

        <StepperContent value="workspace">Workspace content</StepperContent>
      </Stepper>
    );

    expect(screen.getByRole("list")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
    expect(
      screen.getByRole("button", { name: /Configure a workspace/ })
    ).toHaveAttribute("aria-current", "step");
  });

  it("allows navigation buttons to compose with asChild", async () => {
    const user = userEvent.setup();

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>

        <StepperPrevious asChild>
          <button type="button">Back</button>
        </StepperPrevious>
        <StepperNext asChild>
          <button type="button">Continue</button>
        </StepperNext>
      </Stepper>
    );

    const back = screen.getByRole("button", { name: "Back" });
    const next = screen.getByRole("button", { name: "Continue" });

    expect(back).toHaveAttribute("aria-disabled", "true");
    expect(back).toHaveAttribute("tabindex", "-1");

    await user.click(next);

    expect(screen.getByText("Profile content")).toBeVisible();
  });

  it("exposes a public useStepper hook for external controls", async () => {
    const user = userEvent.setup();

    function StepperControls() {
      const { value, goNext, goPrevious, canGoNext, canGoPrevious } =
        useStepper();

      return (
        <div>
          <output data-testid="hook-value">{value}</output>
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={goPrevious}
          >
            Back
          </button>
          <button type="button" disabled={!canGoNext} onClick={goNext}>
            Continue
          </button>
        </div>
      );
    }

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>

        <StepperControls />
      </Stepper>
    );

    expect(screen.getByTestId("hook-value")).toHaveTextContent("account");

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByTestId("hook-value")).toHaveTextContent("profile");
    expect(screen.getByText("Profile content")).toBeVisible();
  });

  it("exposes current index and total steps from useStepper", () => {
    function StepperStatus() {
      const { currentIndex, getStepIndex, totalSteps } = useStepper();

      return (
        <output data-testid="stepper-status">
          Step {currentIndex + 1} of {totalSteps}; payment index{" "}
          {getStepIndex("payment")}
        </output>
      );
    }

    render(
      <Stepper defaultValue="profile">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
          <StepperItem value="payment" disabled>
            Payment
          </StepperItem>
        </StepperList>

        <StepperStatus />
      </Stepper>
    );

    expect(screen.getByTestId("stepper-status")).toHaveTextContent(
      "Step 2 of 3; payment index 2"
    );
  });

  it("runs an async guard before moving to the next step", async () => {
    const user = userEvent.setup();
    const onBeforeNext = vi.fn().mockResolvedValue(false);

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>

        <StepperNext onBeforeNext={onBeforeNext}>Continue</StepperNext>
      </Stepper>
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onBeforeNext).toHaveBeenCalledOnce();
    expect(screen.getByText("Account content")).toBeVisible();
    expect(screen.queryByText("Profile content")).not.toBeInTheDocument();
  });

  it("moves focus between triggers with keyboard navigation without changing the current step", async () => {
    const user = userEvent.setup();

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
          <StepperItem value="payment" disabled>
            Payment
          </StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>
        <StepperContent value="payment">Payment content</StepperContent>
      </Stepper>
    );

    const account = screen.getByRole("button", { name: /Account/ });
    const profile = screen.getByRole("button", { name: /Profile/ });

    account.focus();
    await user.keyboard("{ArrowRight}");

    expect(profile).toHaveFocus();
    expect(screen.getByText("Account content")).toBeVisible();

    await user.keyboard("{End}");

    expect(profile).toHaveFocus();
  });

  it("adds separators automatically for custom trigger layouts", () => {
    const { container } = render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Account</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperItem value="profile">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Profile</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
      </Stepper>
    );

    expect(
      container.querySelectorAll('[data-slot="stepper-separator"]')
    ).toHaveLength(1);
  });

  it("handles a stepper where every step is disabled", () => {
    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account" disabled>
            Account
          </StepperItem>
          <StepperItem value="profile" disabled>
            Profile
          </StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>

        <StepperPrevious />
        <StepperNext />
      </Stepper>
    );

    expect(screen.queryByText("Account content")).not.toBeInTheDocument();
    expect(screen.queryByText("Profile content")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
