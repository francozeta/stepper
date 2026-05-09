import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  StepperExample,
  StepperRoutePatternExample,
} from "@/components/stepper-examples";
import { StepperOnboardingExample } from "@/components/stepper-onboarding";

function fillWorkspaceFields() {
  const workspaceName = screen.getByLabelText("Workspace name");
  const workspaceSlug = screen.getByLabelText("Workspace slug");

  fireEvent.change(workspaceName, { target: { value: "Acme" } });
  fireEvent.change(workspaceSlug, { target: { value: "acme" } });

  return { workspaceName, workspaceSlug };
}

function fillOnboardingWorkspaceFields() {
  const workspaceName = screen.getByLabelText("Workspace name");
  const workspaceSlug = screen.getByLabelText("Workspace URL");

  fireEvent.change(workspaceName, { target: { value: "Acme" } });
  fireEvent.change(workspaceSlug, { target: { value: "acme" } });

  return { workspaceName, workspaceSlug };
}

describe("Stepper examples", () => {
  it("blocks the onboarding flow and marks the current step as error when required fields are missing", async () => {
    const user = userEvent.setup();

    render(<StepperOnboardingExample />);

    await user.clear(screen.getByLabelText("Workspace name"));
    await user.clear(screen.getByLabelText("Workspace URL"));
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(await screen.findByText("Enter a workspace name.")).toBeInTheDocument();
    expect(screen.getByText("Step needs attention")).toBeInTheDocument();
    expect(
      screen
        .getAllByText("Workspace")[0]
        .closest('[data-slot="stepper-item"]')
    ).toHaveAttribute("data-state", "error");
    expect(screen.getByText("Create your workspace")).toBeInTheDocument();
  });

  it("unlocks onboarding steps only after each step validates", async () => {
    const user = userEvent.setup();

    render(<StepperOnboardingExample />);

    fillOnboardingWorkspaceFields();

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByText("Choose region and settings");

    const workspaceStep = screen
      .getAllByText("Workspace")[0]
      .closest('[data-slot="stepper-item"]');
    const teamStep = screen
      .getAllByText("Team")[0]
      .closest('[data-slot="stepper-item"]');

    expect(workspaceStep).toHaveAttribute("data-state", "completed");
    expect(teamStep).toHaveAttribute("data-state", "disabled");

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByRole("heading", { name: /Invite collaborators/ });

    expect(teamStep).not.toHaveAttribute("data-state", "disabled");
  });

  it("submits the onboarding review after all step gates pass", async () => {
    const user = userEvent.setup();

    render(<StepperOnboardingExample />);

    fillOnboardingWorkspaceFields();

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByText("Choose region and settings");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByRole("heading", { name: /Invite collaborators/ });
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await screen.findByText("Review workspace");
    await user.click(screen.getByRole("button", { name: /Create workspace/ }));

    expect(
      await screen.findByRole("heading", { name: /Workspace created/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Created/ })).toBeDisabled();
  });

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
});
