import * as React from "react";
import Link from "next/link";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  useStepperItem,
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

async function waitForSettledEffects() {
  await new Promise((resolve) => setTimeout(resolve, 20));
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

  it("keeps item actions current when the controlled owner replaces its callback", () => {
    const steps = [{ value: "account" }, { value: "profile" }];
    const first = vi.fn();
    const latest = vi.fn();
    function Action() {
      const { setValue } = useStepperItem();
      return <button onClick={() => setValue("profile")}>Custom action</button>;
    }
    const children = (
      <StepperList>
        <StepperItem value="account" defaultTrigger={false}><StepperTrigger>Account</StepperTrigger><Action /></StepperItem>
        <StepperItem value="profile">Profile</StepperItem>
      </StepperList>
    );
    const view = (onValueChange: (value: string) => void) => (
      <Stepper steps={steps} value="account" onValueChange={onValueChange}>{children}</Stepper>
    );
    const { rerender } = render(view(first));
    rerender(view(latest));
    fireEvent.click(screen.getByRole("button", { name: "Custom action" }));
    fireEvent.click(screen.getByRole("button", { name: /Profile/ }));
    expect(first).not.toHaveBeenCalled();
    expect(latest.mock.calls).toEqual([["profile"], ["profile"]]);
  });

  it("exposes item state for custom composed indicators", async () => {
    function ItemState() {
      const { completed, index, isActive, stepPosition, stepState, value } =
        useStepperItem();

      return (
        <span data-testid={`item-state-${value}`}>
          {index}:{stepPosition}:{stepState}:{String(isActive)}:
          {String(completed)}
        </span>
      );
    }

    render(
      <Stepper defaultValue="profile">
        <StepperList>
          <StepperItem value="account" defaultTrigger={false}>
            <ItemState />
          </StepperItem>
          <StepperItem value="profile" defaultTrigger={false} completed>
            <ItemState />
          </StepperItem>
          <StepperItem value="payment" defaultTrigger={false}>
            <ItemState />
          </StepperItem>
        </StepperList>
      </Stepper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("item-state-account")).toHaveTextContent(
        "0:previous:inactive:false:false"
      );
      expect(screen.getByTestId("item-state-profile")).toHaveTextContent(
        "1:current:active:true:true"
      );
      expect(screen.getByTestId("item-state-payment")).toHaveTextContent(
        "2:next:inactive:false:false"
      );
    });
  });

  it("falls back to the first enabled step without syncing a missing controlled value", async () => {
    const onValueChange = vi.fn();

    render(<BasicStepper value="missing" onValueChange={onValueChange} />);

    expect(screen.getByText("Account content")).toBeVisible();

    await waitForSettledEffects();

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("falls back to the first enabled step when defaultValue is missing", () => {
    render(<BasicStepper defaultValue="missing" />);

    expect(screen.getByText("Account content")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Step 1:\s*Account/ })
    ).toHaveAttribute("aria-current", "step");
  });

  it("falls back visually when a controlled step becomes disabled", async () => {
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
      expect(screen.getByText("Account content")).toBeVisible();
    });
    await waitForSettledEffects();

    expect(screen.getByTestId("current-value")).toHaveTextContent("profile");
  });

  it("falls back visually when a wrapped controlled step becomes disabled", async () => {
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
      expect(screen.getByText("Account content")).toBeVisible();
    });
    await waitForSettledEffects();

    expect(screen.getByTestId("wrapped-current-value")).toHaveTextContent(
      "profile"
    );
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

  it("keeps implicit numbering and navigation when a mounted step is disabled and re-enabled", async () => {
    const user = userEvent.setup();
    const fixture = (disabled: boolean) => (
      <React.StrictMode>
        <Stepper defaultValue="account">
          <StepperList>
            <StepperItem value="account">Account</StepperItem>
            <StepperItem value="profile" disabled={disabled}>Profile</StepperItem>
            <StepperItem value="payment">Payment</StepperItem>
          </StepperList>
          <StepperNext>Continue</StepperNext>
          <StepperPrevious>Back</StepperPrevious>
        </Stepper>
      </React.StrictMode>
    );

    const { rerender } = render(fixture(false));
    const account = screen.getByRole("button", { name: /Account/ });
    const profile = screen.getByRole("button", { name: /Step 2:\s*Profile/ });
    const payment = screen.getByRole("button", { name: /Step 3:\s*Payment/ });
    rerender(fixture(true));

    expect(profile).toHaveAccessibleName(/Step 2:\s*Profile/);
    expect(profile).toBeDisabled();
    expect(payment).toHaveAccessibleName(/Step 3:\s*Payment/);
    account.focus();
    await user.keyboard("{ArrowRight}");
    expect(payment).toHaveFocus();
    expect(account).toHaveAttribute("aria-current", "step");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(payment).toHaveAttribute("aria-current", "step");
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(account).toHaveAttribute("aria-current", "step");

    rerender(fixture(false));
    account.focus();
    await user.keyboard("{ArrowRight}");
    expect(profile).toHaveFocus();
    expect(account).toHaveAttribute("aria-current", "step");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(profile).toHaveAttribute("aria-current", "step");
  });

  it("replaces a mounted implicit step value in the same position", async () => {
    const user = userEvent.setup();
    const fixture = (value: string) => (
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value={value}>Details</StepperItem>
          <StepperItem value="payment">Payment</StepperItem>
        </StepperList>
        <StepperContent value={value}>{value} content</StepperContent>
        <StepperNext>Continue</StepperNext>
        <StepperPrevious>Back</StepperPrevious>
      </Stepper>
    );

    const { rerender } = render(fixture("profile"));
    const account = screen.getByRole("button", { name: /Account/ });
    const details = screen.getByRole("button", { name: /Step 2:\s*Details/ });
    const payment = screen.getByRole("button", { name: /Step 3:\s*Payment/ });
    rerender(fixture("shipping"));

    expect(details).toHaveAccessibleName(/Step 2:\s*Details/);
    expect(payment).toHaveAccessibleName(/Step 3:\s*Payment/);
    account.focus();
    await user.keyboard("{ArrowRight}");
    expect(details).toHaveFocus();
    const next = screen.getByRole("button", { name: "Continue" });
    await user.click(next);
    expect(screen.getByText("shipping content")).toBeVisible();
    await user.click(next);
    expect(payment).toHaveAttribute("aria-current", "step");
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(details).toHaveAttribute("aria-current", "step");
  });

  it("keeps keyboard and panel relationships distinct for punctuated and empty step values", async () => {
    const user = userEvent.setup();
    render(
      <Stepper defaultValue="payment/card">
        <StepperList>
          <StepperItem value="payment/card">Card</StepperItem>
          <StepperItem value="payment-card">Transfer</StepperItem>
          <StepperItem value="">Summary</StepperItem>
        </StepperList>
        <StepperContent value="payment/card">Card content</StepperContent>
        <StepperContent value="payment-card">Transfer content</StepperContent>
      </Stepper>
    );

    const card = screen.getByRole("button", { name: /Card/ });
    const transfer = screen.getByRole("button", { name: /Transfer/ });
    const summary = screen.getByRole("button", { name: /Summary/ });
    expect(card.id).not.toBe(transfer.id);
    expect(card).toHaveAttribute("aria-controls", screen.getByText("Card content").id);
    card.focus();
    await user.keyboard("{ArrowRight}");
    expect(transfer).toHaveFocus();
    await user.keyboard("{Enter}");
    const panel = screen.getByText("Transfer content");
    expect(transfer).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", transfer.id);
    await user.keyboard("{ArrowRight}");
    expect(summary).toHaveFocus();
    expect(transfer).toHaveAttribute("aria-current", "step");
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

  it("indexes the first occurrence and warns once per duplicate explicit value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    function IndexProbe() {
      const { getStepIndex, steps } = useStepper();
      return <output data-testid="step-indices">{getStepIndex("a")},{getStepIndex("b")},{getStepIndex("missing")},{steps.length}</output>;
    }

    try {
      render(
        <Stepper steps={[{ value: "a" }, { value: "b" }, { value: "a" }, { value: "a" }, { value: "b" }]}>
          <IndexProbe />
        </Stepper>
      );

      expect(screen.getByTestId("step-indices")).toHaveTextContent("0,1,-1,5");
      const duplicateWarnings = warn.mock.calls
        .map(([message]) => String(message))
        .filter((message) => message.includes("is duplicated"));
      expect(duplicateWarnings).toEqual([
        expect.stringContaining('StepperItem value "a" is duplicated'),
        expect.stringContaining('StepperItem value "b" is duplicated'),
      ]);
    } finally {
      warn.mockRestore();
    }
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

  it("does not count StepperItems rendered outside StepperList", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    function StepperStatus() {
      const { totalSteps } = useStepper();

      return <output data-testid="outside-list-total">{totalSteps}</output>;
    }

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
        </StepperList>

        <StepperItem value="account">Outside duplicate</StepperItem>
        <StepperStatus />
      </Stepper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("outside-list-total")).toHaveTextContent("1");
    });
    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'StepperItem with value "account" must be rendered inside StepperList'
        )
      );
    });
    expect(warn).not.toHaveBeenCalledWith(
      expect.stringContaining('StepperItem value "account" is duplicated')
    );

    warn.mockRestore();
  });

  it("does not render a fallback trigger when primitives are nested inside wrappers", () => {
    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account" defaultTrigger={false}>
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

  it("keeps the native trigger and focus when switching to equivalent composition", () => {
    const steps = [{ value: "account" }, { value: "profile" }];
    const view = (composed: boolean) => (
      <Stepper steps={steps} value="account">
        <StepperList>
          <StepperItem value="account" defaultTrigger={false}>
            <StepperTrigger render={composed ? <button /> : undefined}>
              <StepperLabel>Account</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
        </StepperList>
        <StepperContent value="account">Account content</StepperContent>
      </Stepper>
    );
    const { rerender } = render(view(false));
    const trigger = screen.getByRole("button", { name: "Account" });
    trigger.focus();
    expect(trigger).toHaveAttribute("type", "button");
    rerender(view(true));
    expect(screen.getByRole("button", { name: "Account" })).toBe(trigger);
    expect(trigger).toHaveFocus();
    rerender(view(false));
    expect(screen.getByRole("button", { name: "Account" })).toBe(trigger);
    expect(trigger).toHaveFocus();
  });

  it("composes Base UI render buttons and preserves native semantics", async () => {
    const user = userEvent.setup();
    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="payment" defaultTrigger={false}>
            <StepperTrigger render={<button className="custom-trigger" />}>
              Payment
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="payment" render={<section />}>Payment content</StepperContent>
        <StepperNext render={<button>Continue</button>} />
      </Stepper>
    );
    const next = screen.getByRole("button", { name: "Continue" });
    expect(next).toHaveAttribute("type", "button");
    await user.click(next);
    const trigger = screen.getByRole("button", { name: "Payment" });
    expect(trigger).toHaveClass("custom-trigger");
    expect(trigger).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Payment content").tagName).toBe("SECTION");
    expect(next).toBeDisabled();
  });

  it("keeps disabled render links from navigating", async () => {
    const user = userEvent.setup();
    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="payment" defaultTrigger={false} disabled>
            <StepperTrigger nativeButton={false} render={<a href="/payment" />}>
              Payment
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="payment">Payment content</StepperContent>
      </Stepper>
    );
    const link = screen.getByRole("link", { name: "Payment" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).not.toHaveAttribute("type");
    await user.click(link);
    expect(screen.getByText("Account content")).toBeVisible();
  });

  it("keeps disabled asChild triggers unfocusable and prevents navigation", async () => {
    const user = userEvent.setup();

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="payment" defaultTrigger={false} disabled>
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
          <StepperItem value="payment" defaultTrigger={false} disabled>
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
          <StepperItem value="workspace" defaultTrigger={false}>
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

  it("does not apply default navigation button styles to asChild controls", () => {
    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
        </StepperList>

        <StepperPrevious asChild className="extra-previous">
          <button type="button" className="child-previous bg-red-500">
            Back
          </button>
        </StepperPrevious>
        <StepperNext asChild className="extra-next">
          <button type="button" className="child-next bg-blue-500">
            Continue
          </button>
        </StepperNext>
      </Stepper>
    );

    const back = screen.getByRole("button", { name: "Back" });
    const next = screen.getByRole("button", { name: "Continue" });

    expect(back).toHaveClass("child-previous", "bg-red-500", "extra-previous");
    expect(back).not.toHaveClass("min-w-24", "bg-background");
    expect(next).toHaveClass("child-next", "bg-blue-500", "extra-next");
    expect(next).not.toHaveClass("min-w-24", "bg-primary");
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

  it("supports an explicit steps prop for headless composition", async () => {
    const user = userEvent.setup();

    function StepperStatus() {
      const { value, steps, totalSteps, canGoNext, goNext } = useStepper();

      return (
        <div>
          <output data-testid="headless-value">{value}</output>
          <output data-testid="headless-total">{totalSteps}</output>
          <output data-testid="headless-steps">
            {steps
              .map((step) => `${step.value}:${step.disabled ? "off" : "on"}`)
              .join(",")}
          </output>
          <button type="button" disabled={!canGoNext} onClick={goNext}>
            Continue
          </button>
        </div>
      );
    }

    render(
      <Stepper
        defaultValue="account"
        steps={[
          { value: "account" },
          { value: "profile" },
          { value: "payment", disabled: true },
        ]}
      >
        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>
        <StepperContent value="payment">Payment content</StepperContent>

        <StepperStatus />
      </Stepper>
    );

    expect(screen.getByTestId("headless-value")).toHaveTextContent("account");
    expect(screen.getByTestId("headless-total")).toHaveTextContent("3");
    expect(screen.getByTestId("headless-steps")).toHaveTextContent(
      "account:on,profile:on,payment:off"
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByTestId("headless-value")).toHaveTextContent("profile");
    expect(screen.getByText("Profile content")).toBeVisible();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });

  it("uses explicit steps as the source of truth over rendered item props", async () => {
    const user = userEvent.setup();

    function StepperStatus() {
      const { steps, canGoNext } = useStepper();

      return (
        <>
          <output data-testid="explicit-steps">
            {steps
              .map((step) => `${step.value}:${step.disabled ? "off" : "on"}`)
              .join(",")}
          </output>
          <output data-testid="explicit-can-go-next">
            {String(canGoNext)}
          </output>
        </>
      );
    }

    render(
      <Stepper
        defaultValue="account"
        steps={[{ value: "account" }, { value: "profile" }]}
      >
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile" disabled>
            Profile
          </StepperItem>
        </StepperList>

        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>

        <StepperStatus />
        <StepperNext>Continue</StepperNext>
      </Stepper>
    );

    expect(screen.getByTestId("explicit-steps")).toHaveTextContent(
      "account:on,profile:on"
    );
    expect(screen.getByTestId("explicit-can-go-next")).toHaveTextContent(
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Profile content")).toBeVisible();
  });

  it("keeps inactive content mounted with keepMounted", async () => {
    const user = userEvent.setup();

    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
        </StepperList>

        <StepperContent value="account" keepMounted>
          Account content
        </StepperContent>
        <StepperContent value="profile" keepMounted>
          Profile content
        </StepperContent>

        <StepperNext>Continue</StepperNext>
      </Stepper>
    );

    const profileContent = screen.getByText("Profile content");
    const profilePanel = profileContent.closest('[data-slot="stepper-content"]');

    expect(profileContent).toBeInTheDocument();
    expect(profilePanel).toHaveAttribute("hidden");

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(profilePanel).not.toHaveAttribute("hidden");
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

  it("runs an async next guard once for rapid repeated clicks", async () => {
    let resolveGuard: ((value: boolean) => void) | undefined;
    const onBeforeNext = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveGuard = resolve;
        })
    );

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

    const button = screen.getByRole("button", { name: "Continue" });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(onBeforeNext).toHaveBeenCalledOnce();

    resolveGuard?.(true);

    await waitFor(() => {
      expect(screen.getByText("Profile content")).toBeVisible();
    });
  });

  it("ignores a guard that resolves after the user changes steps", async () => {
    let resolveGuard: ((allowed: boolean) => void) | undefined;
    const guard = () => new Promise<boolean>((resolve) => { resolveGuard = resolve; });
    const user = userEvent.setup();
    render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
          <StepperItem value="review">Review</StepperItem>
        </StepperList>
        <StepperContent value="account">Account content</StepperContent>
        <StepperContent value="profile">Profile content</StepperContent>
        <StepperContent value="review">Review content</StepperContent>
        <StepperNext onBeforeNext={guard}>Continue</StepperNext>
      </Stepper>
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: /Review/ }));
    resolveGuard?.(true);
    await waitForSettledEffects();
    expect(screen.getByText("Review content")).toBeVisible();
    expect(screen.queryByText("Profile content")).not.toBeInTheDocument();
  });

  it("keeps the latest guarded navigation intent across different controls", async () => {
    let resolveNext: ((allowed: boolean) => void) | undefined;
    let resolvePrevious: ((allowed: boolean) => void) | undefined;
    const onValueChange = vi.fn();

    render(
      <Stepper value="profile" steps={[{ value: "account" }, { value: "profile" }, { value: "review" }]} onValueChange={onValueChange}>
        <StepperPrevious onBeforePrevious={() => new Promise<boolean>((resolve) => { resolvePrevious = resolve; })}>Back</StepperPrevious>
        <StepperNext onBeforeNext={() => new Promise<boolean>((resolve) => { resolveNext = resolve; })}>Continue</StepperNext>
      </Stepper>
    );

    const next = screen.getByRole("button", { name: "Continue" });
    const back = screen.getByRole("button", { name: "Back" });
    fireEvent.click(next);
    expect(next).toHaveAttribute("aria-busy", "true");
    expect(next).toHaveAttribute("data-pending");
    fireEvent.click(back);
    resolveNext?.(true);
    await waitFor(() => expect(next).toBeEnabled());
    expect(next).not.toHaveAttribute("aria-busy");
    expect(onValueChange).not.toHaveBeenCalled();
    resolvePrevious?.(true);
    await waitFor(() => expect(back).toBeEnabled());
    expect(onValueChange.mock.calls).toEqual([["account"]]);
  });

  it("invalidates a pending guard on a newer direct request even before a controlled commit", async () => {
    let resolveGuard: ((allowed: boolean) => void) | undefined;
    const onValueChange = vi.fn();
    function DirectRequest() {
      const { setValue } = useStepper();
      return <button type="button" onClick={() => setValue("review")}>Review directly</button>;
    }

    render(
      <Stepper value="account" steps={[{ value: "account" }, { value: "profile" }, { value: "review" }]} onValueChange={onValueChange}>
        <StepperNext onBeforeNext={() => new Promise<boolean>((resolve) => { resolveGuard = resolve; })}>Continue</StepperNext>
        <DirectRequest />
      </Stepper>
    );
    const next = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(next);
    fireEvent.click(screen.getByRole("button", { name: "Review directly" }));
    resolveGuard?.(true);
    await waitFor(() => expect(next).toBeEnabled());
    expect(onValueChange.mock.calls).toEqual([["review"]]);
  });

  it("ignores a guard when its destination is replaced", async () => {
    let resolveGuard: ((allowed: boolean) => void) | undefined;
    const guard = () => new Promise<boolean>((resolve) => { resolveGuard = resolve; });
    const onValueChange = vi.fn();
    const fixture = (middle: string) => (
      <Stepper value="account" onValueChange={onValueChange}
        steps={[{ value: "account" }, { value: middle }, { value: "review" }]}>
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value={middle}>{middle}</StepperItem>
          <StepperItem value="review">Review</StepperItem>
        </StepperList>
        <StepperNext onBeforeNext={guard}>Continue</StepperNext>
      </Stepper>
    );
    const { rerender } = render(fixture("profile"));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    rerender(fixture("shipping"));
    resolveGuard?.(true);
    await waitFor(() => expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each(["next", "previous"] as const)("ignores %s validation after the control is disabled", async (direction) => {
    let resolveGuard: ((allowed: boolean) => void) | undefined;
    const guard = () => new Promise<boolean>((resolve) => { resolveGuard = resolve; });
    const onValueChange = vi.fn();
    const steps = [{ value: "account" }, { value: "profile" }];
    const value = direction === "next" ? "account" : "profile";
    const fixture = (disabled: boolean) => (
      <Stepper value={value} steps={steps} onValueChange={onValueChange}>
        {direction === "next" ? (
          <StepperNext disabled={disabled} onBeforeNext={guard}>Go</StepperNext>
        ) : (
          <StepperPrevious disabled={disabled} onBeforePrevious={guard}>Go</StepperPrevious>
        )}
      </Stepper>
    );

    const { rerender } = render(fixture(false));
    const button = screen.getByRole("button", { name: "Go" });
    fireEvent.click(button);
    rerender(fixture(true));
    rerender(fixture(false));
    resolveGuard?.(true);

    await waitFor(() => expect(button).toBeEnabled());
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(button);
    resolveGuard?.(true);
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(
      direction === "next" ? "profile" : "account"
    ));
  });

  it.each([
    ["ltr", "ArrowRight"],
    ["rtl", "ArrowLeft"],
  ])("moves focus in %s without changing the current step", async (direction, forwardKey) => {
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

    account.style.direction = direction;
    account.focus();
    await user.keyboard(`{${forwardKey}}`);

    expect(profile).toHaveFocus();
    expect(screen.getByText("Account content")).toBeVisible();

    await user.keyboard("{End}");

    expect(profile).toHaveFocus();
  });

  it("adds separators automatically for custom trigger layouts", () => {
    const { container } = render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account" defaultTrigger={false}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Account</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperItem value="profile" defaultTrigger={false}>
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

  it("keeps the separator filled when the current item is completed", () => {
    const { container } = render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account" completed>
            Account
          </StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
        </StepperList>
      </Stepper>
    );

    const separator = container.querySelector(
      '[data-slot="stepper-separator"]'
    );

    expect(separator?.closest('[data-slot="stepper-item"]')).toHaveStyle("--stepper-connector-fill: 1");
  });

  it("uses one shared progress cursor for forward and reverse jumps", async () => {
    const user = userEvent.setup();
    const layoutReads = new Map<number, string>();

    function ReadConnectorTiming() {
      const { currentIndex } = useStepper();
      const marker = React.useRef<HTMLSpanElement>(null);
      React.useLayoutEffect(() => {
        const root = marker.current?.closest<HTMLElement>('[data-slot="stepper"]');
        if (root) layoutReads.set(currentIndex, root.style.transitionDuration);
      }, [currentIndex]);
      return <span ref={marker} />;
    }

    const { container } = render(
      <Stepper defaultValue="account">
        <ReadConnectorTiming />
        <StepperList>
          <StepperItem value="account">Account</StepperItem>
          <StepperItem value="profile">Profile</StepperItem>
          <StepperItem value="shipping">Shipping</StepperItem>
          <StepperItem value="payment">Payment</StepperItem>
        </StepperList>
      </Stepper>
    );
    const root = container.querySelector('[data-slot="stepper"]') as HTMLElement;
    const items = container.querySelectorAll('[data-slot="stepper-item"]');
    expect(root.style.getPropertyValue("--stepper-progress")).toBe("0");
    await user.click(screen.getByRole("button", { name: /Step 4:\s*Payment/ }));
    expect(root.style.getPropertyValue("--stepper-progress")).toBe("3");
    expect(root.style.transitionDuration).toBe("330ms");
    expect(layoutReads.get(3)).toBe("330ms");
    expect(items[1]).toHaveStyle("--stepper-connector-index: 1");
    expect(items[2]).toHaveStyle("--stepper-connector-index: 2");
    await user.click(screen.getByRole("button", { name: /Step 1:\s*Account/ }));
    expect(root.style.getPropertyValue("--stepper-progress")).toBe("0");
    expect(root.style.transitionDuration).toBe("330ms");
    expect(root).toHaveClass("motion-reduce:transition-none");
    await user.click(screen.getByRole("button", { name: /Step 2:\s*Profile/ }));
    expect(root.style.transitionDuration).toBe("110ms");
  });

  it("uses an inset visible outline for keyboard focus without changing selection", async () => {
    const user = userEvent.setup();
    render(<BasicStepper />);
    const account = screen.getByRole("button", { name: /Account/ });
    const profile = screen.getByRole("button", { name: /Profile/ });
    account.focus();
    await user.keyboard("{ArrowRight}");
    expect(profile).toHaveFocus();
    expect(profile).toHaveClass("focus-visible:outline-offset-[-2px]", "focus-visible:outline-ring");
    expect(account).toHaveAttribute("aria-current", "step");
  });

  it("lets consumers opt out of the default separator explicitly", () => {
    const { container } = render(
      <Stepper defaultValue="account">
        <StepperList>
          <StepperItem value="account" defaultTrigger={false} separator={false}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Account</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperItem value="profile" defaultTrigger={false}>
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
    ).toHaveLength(0);
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
