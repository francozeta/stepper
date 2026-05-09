import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  StepperExample,
  StepperRoutePatternExample,
} from "@/components/stepper-examples";
import { StepperNotionOnboardingExample } from "@/components/stepper-notion-onboarding";

function fillWorkspaceFields() {
  const workspaceName = screen.getByLabelText("Workspace name");
  const workspaceSlug = screen.getByLabelText("Workspace slug");

  fireEvent.change(workspaceName, { target: { value: "Acme" } });
  fireEvent.change(workspaceSlug, { target: { value: "acme" } });

  return { workspaceName, workspaceSlug };
}

describe("Stepper examples", () => {
  it("keeps the active workspace step visually current after returning from a completed step", async () => {
    const user = userEvent.setup();

    render(<StepperExample />);

    const { workspaceName, workspaceSlug } = fillWorkspaceFields();

    expect(workspaceName).toHaveValue("Acme");
    expect(workspaceSlug).toHaveValue("acme");
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

  it("does not draw future wizard steps as completed after navigating back", async () => {
    const user = userEvent.setup();

    render(<StepperExample />);

    fillWorkspaceFields();

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByText("Choose team defaults");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByText("Invite teammates");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByText("Review setup");
    await user.click(screen.getByRole("button", { name: /Back/ }));
    await screen.findByText("Invite teammates");
    await user.click(screen.getByRole("button", { name: /Back/ }));
    await screen.findByText("Choose team defaults");

    expect(screen.getByText("Choose team defaults")).toBeInTheDocument();

    const preferencesStep = screen
      .getByText("Preferences")
      .closest('[data-slot="stepper-item"]');
    const membersStep = screen
      .getByText("Members")
      .closest('[data-slot="stepper-item"]');

    expect(preferencesStep).toHaveAttribute("data-state", "active");
    expect(membersStep).toHaveAttribute("data-position", "next");
    expect(membersStep).not.toHaveAttribute("data-state", "completed");
    expect(
      membersStep?.querySelector('[data-slot="stepper-indicator"] .lucide-check')
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

  it("runs the Notion-style onboarding through hidden and branched steps", async () => {
    const user = userEvent.setup();

    render(<StepperNotionOnboardingExample />);

    await user.click(screen.getByRole("button", { name: /^Continue$/ }));

    expect(await screen.findByText("Enter a valid work email.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Work email"), "alex@example.com");
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));

    expect(await screen.findByText("Check your inbox")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Verification code"), "123456");
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));

    expect(await screen.findByText("Create a profile")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Enter your name"), "Alex Smith");
    await user.type(screen.getByLabelText("Set a password"), "Abcd.1234");
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));

    expect(
      await screen.findByText("How do you want to use this workspace?")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /For personal life/ }));
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));

    expect(await screen.findByText("How will you work?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /On my own/ }));
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));

    expect(await screen.findByText("What's on your mind?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /To-do list/ }));
    await user.click(screen.getByRole("button", { name: /Habit tracking/ }));

    expect(screen.getByText("2 selected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Continue$/ }));

    expect(
      await screen.findByText("Generating your starter workspace")
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "Welcome to your workspace",
      })
    ).toBeInTheDocument();
  });
});
