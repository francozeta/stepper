"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CircleHelp,
  Globe2,
  Lock,
  Mail,
  Rocket,
  Send,
  Settings2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { z } from "zod/v3";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperPrevious,
  StepperTrigger,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

const workspaceSchema = z.object({
  workspaceName: z.string().trim().min(2, "Enter a workspace name."),
  workspaceSlug: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens."
    ),
  workspaceDomain: z.enum(["vercel.app", "company.dev"]),
});

const preferencesSchema = z.object({
  region: z.enum(["iad1", "fra1", "sin1"]),
  environment: z.enum(["production", "preview"]),
});

const teamSchema = z.object({
  inviteEmail: z
    .string()
    .trim()
    .email("Enter a valid email.")
    .or(z.literal("")),
  inviteRole: z.enum(["admin", "member", "viewer"]),
});

const onboardingSchema = workspaceSchema
  .extend(preferencesSchema.shape)
  .extend(teamSchema.shape);

type OnboardingValues = z.infer<typeof onboardingSchema>;

const onboardingSteps = [
  {
    value: "workspace",
    title: "Workspace",
    description: "Name and identity",
    icon: Building2,
  },
  {
    value: "preferences",
    title: "Preferences",
    description: "Region and settings",
    icon: Settings2,
  },
  {
    value: "team",
    title: "Team",
    description: "Invite collaborators",
    icon: Users,
  },
  {
    value: "review",
    title: "Review",
    description: "Confirm and create",
    icon: Send,
  },
] as const;

type OnboardingStep = (typeof onboardingSteps)[number]["value"];

const stepFields = {
  workspace: ["workspaceName", "workspaceSlug", "workspaceDomain"],
  preferences: ["region", "environment"],
  team: ["inviteEmail", "inviteRole"],
  review: [],
} satisfies Record<OnboardingStep, FieldPath<OnboardingValues>[]>;

const regionLabels = {
  iad1: "US East - iad1",
  fra1: "Europe - fra1",
  sin1: "Asia Pacific - sin1",
} satisfies Record<OnboardingValues["region"], string>;

const controlButtonClass =
  "h-8 rounded-md px-3 text-sm font-medium [&_svg]:size-4";

function StepperOnboardingExample() {
  const [value, setValue] = React.useState<OnboardingStep>("workspace");
  const [completedSteps, setCompletedSteps] = React.useState<
    Partial<Record<OnboardingStep, boolean>>
  >({});
  const [attemptedSteps, setAttemptedSteps] = React.useState<
    Partial<Record<OnboardingStep, boolean>>
  >({});
  const [submitted, setSubmitted] = React.useState(false);
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      workspaceName: "francozeta",
      workspaceSlug: "francozeta",
      workspaceDomain: "vercel.app",
      region: "iad1",
      environment: "production",
      inviteEmail: "",
      inviteRole: "member",
    },
  });
  const formValues = useWatch({ control: form.control });
  const values = React.useMemo<OnboardingValues>(
    () => ({
      workspaceName: formValues.workspaceName ?? "",
      workspaceSlug: formValues.workspaceSlug ?? "",
      workspaceDomain: formValues.workspaceDomain ?? "vercel.app",
      region: formValues.region ?? "iad1",
      environment: formValues.environment ?? "production",
      inviteEmail: formValues.inviteEmail ?? "",
      inviteRole: formValues.inviteRole ?? "member",
    }),
    [
      formValues.environment,
      formValues.inviteEmail,
      formValues.inviteRole,
      formValues.region,
      formValues.workspaceDomain,
      formValues.workspaceName,
      formValues.workspaceSlug,
    ]
  );
  const errors = form.formState.errors;
  const currentIndex = onboardingSteps.findIndex((step) => step.value === value);
  const completedCount = onboardingSteps.filter(
    (step) => completedSteps[step.value]
  ).length;
  const currentFields = stepFields[value];
  const currentStepHasErrors = currentFields.some((field) => errors[field]);
  const workspaceUrl = getWorkspaceUrl(values);

  function isLocked(step: OnboardingStep) {
    if (step === "workspace") return false;
    if (step === "preferences") return !completedSteps.workspace;
    if (step === "team") return !completedSteps.preferences;

    return !completedSteps.team;
  }

  function isStepCompleted(step: OnboardingStep) {
    return Boolean(
      completedSteps[step] &&
        onboardingSteps.findIndex((item) => item.value === step) < currentIndex
    );
  }

  function hasStepError(step: OnboardingStep) {
    return Boolean(
      attemptedSteps[step] &&
        stepFields[step].some((field) => form.formState.errors[field])
    );
  }

  async function validateCurrentStep() {
    setAttemptedSteps((current) => ({ ...current, [value]: true }));

    const fields = stepFields[value];
    const isValid = fields.length
      ? await form.trigger(fields, { shouldFocus: true })
      : await form.trigger(undefined, { shouldFocus: true });

    if (!isValid) {
      return false;
    }

    setCompletedSteps((current) => ({ ...current, [value]: true }));
    return true;
  }

  async function continueToNextStep() {
    const isValid = await validateCurrentStep();

    if (!isValid) return;

    const nextStep = onboardingSteps[currentIndex + 1]?.value;

    if (nextStep) {
      setValue(nextStep);
    }
  }

  async function createWorkspace() {
    setAttemptedSteps((current) => ({ ...current, review: true }));

    const isValid = await form.trigger(undefined, { shouldFocus: true });

    if (!isValid) return;

    setCompletedSteps((current) => ({ ...current, review: true }));
    setSubmitted(true);
  }

  function resetOnboarding() {
    form.reset();
    setValue("workspace");
    setAttemptedSteps({});
    setCompletedSteps({});
    setSubmitted(false);
  }

  function setSelectValue(
    field: "workspaceDomain" | "region" | "environment" | "inviteRole",
    nextValue: string
  ) {
    const options = {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: Boolean(attemptedSteps[value]),
    };

    form.clearErrors(field);

    if (field === "workspaceDomain") {
      form.setValue(
        "workspaceDomain",
        nextValue as OnboardingValues["workspaceDomain"],
        options
      );
      return;
    }

    if (field === "region") {
      form.setValue("region", nextValue as OnboardingValues["region"], options);
      return;
    }

    if (field === "environment") {
      form.setValue(
        "environment",
        nextValue as OnboardingValues["environment"],
        options
      );
      return;
    }

    form.setValue(
      "inviteRole",
      nextValue as OnboardingValues["inviteRole"],
      options
    );
  }

  return (
    <Card className="@container/onboarding mx-auto w-full max-w-5xl overflow-hidden border-border/80 bg-card">
      <CardContent className="p-0">
        <Stepper
          value={value}
          onValueChange={(nextValue) => {
            const nextStep = nextValue as OnboardingStep;

            if (!isLocked(nextStep)) {
              setValue(nextStep);
            }
          }}
          className="min-w-0 gap-0"
        >
          <div className="border-b bg-muted/20 px-4 py-5 @lg/onboarding:px-8">
            <StepperList
              aria-label="Workspace onboarding steps"
              className="mx-auto max-w-4xl gap-4"
            >
              {onboardingSteps.map((step, index) => {
                const active = value === step.value;
                const completed = isStepCompleted(step.value);
                const disabled = isLocked(step.value);
                const error = hasStepError(step.value);
                const Icon = step.icon;

                return (
                  <StepperItem
                    key={step.value}
                    value={step.value}
                    completed={completed}
                    disabled={disabled}
                    error={error}
                    className="[--stepper-indicator-size:2rem] data-[orientation=horizontal]:min-w-32"
                  >
                    <StepperTrigger className="gap-2">
                      <span className="relative">
                        <StepperIndicator className="bg-card group-data-[state=active]:border-blue-500 group-data-[state=active]:bg-card group-data-[state=active]:text-blue-500 group-data-[state=active]:ring-4 group-data-[state=active]:ring-blue-500/15 group-data-[state=completed]:border-blue-500 group-data-[state=completed]:bg-blue-500 group-data-[state=completed]:text-white">
                          {error ? (
                            <AlertCircle />
                          ) : disabled ? (
                            <Lock />
                          ) : completed ? (
                            <Check />
                          ) : (
                            <Icon />
                          )}
                        </StepperIndicator>
                        <span
                          className={cn(
                            "absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full border text-[10px] font-semibold",
                            active
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-border bg-muted text-muted-foreground",
                            completed && "border-blue-500 bg-blue-500 text-white",
                            error && "border-destructive bg-destructive text-destructive-foreground"
                          )}
                        >
                          {index + 1}
                        </span>
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <StepperLabel>{step.title}</StepperLabel>
                        <StepperDescription className="hidden sm:block">
                          {step.description}
                        </StepperDescription>
                      </span>
                    </StepperTrigger>
                  </StepperItem>
                );
              })}
            </StepperList>
          </div>

          <div className="p-4 @lg/onboarding:p-8">
            <StepperContent
              value="workspace"
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <OnboardingPanel
                title="Create your workspace"
                description="This is where projects, teams, and deployments will live."
              >
                <FieldGroup className="gap-5">
                  <Field data-invalid={Boolean(errors.workspaceName)}>
                    <FieldLabel htmlFor="workspace-name">
                      Workspace name
                    </FieldLabel>
                    <FieldDescription>
                      This will be visible to your team members.
                    </FieldDescription>
                    <div className="relative max-w-md">
                      <Input
                        id="workspace-name"
                        autoComplete="organization"
                        aria-invalid={Boolean(errors.workspaceName)}
                        className="pr-9"
                        onInput={() => form.clearErrors("workspaceName")}
                        {...form.register("workspaceName")}
                      />
                      {values.workspaceName && !errors.workspaceName ? (
                        <CheckCircle2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-emerald-500" />
                      ) : null}
                    </div>
                    <FieldError>{errors.workspaceName?.message}</FieldError>
                  </Field>

                  <Field data-invalid={Boolean(errors.workspaceSlug)}>
                    <FieldLabel htmlFor="workspace-slug">
                      Workspace URL
                    </FieldLabel>
                    <FieldDescription>
                      Choose a unique URL for your workspace.
                    </FieldDescription>
                    <div className="flex max-w-md">
                      <Input
                        id="workspace-slug"
                        autoCapitalize="none"
                        autoComplete="off"
                        aria-invalid={Boolean(errors.workspaceSlug)}
                        className="rounded-r-none"
                        onInput={() => form.clearErrors("workspaceSlug")}
                        {...form.register("workspaceSlug")}
                      />
                      <Select
                        value={values.workspaceDomain}
                        onValueChange={(nextDomain) =>
                          setSelectValue(
                            "workspaceDomain",
                            nextDomain as OnboardingValues["workspaceDomain"]
                          )
                        }
                      >
                        <SelectTrigger
                          aria-label="Workspace domain"
                          className="w-36 rounded-l-none border-l-0"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="vercel.app">
                              .vercel.app
                            </SelectItem>
                            <SelectItem value="company.dev">
                              .company.dev
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {values.workspaceSlug && !errors.workspaceSlug ? (
                      <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                        <CheckCircle2 className="size-3.5" />
                        {workspaceUrl} is available
                      </p>
                    ) : null}
                    <FieldError>{errors.workspaceSlug?.message}</FieldError>
                  </Field>

                  <WorkspacePreview values={values} workspaceUrl={workspaceUrl} />
                </FieldGroup>
              </OnboardingPanel>
            </StepperContent>

            <StepperContent
              value="preferences"
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <OnboardingPanel
                title="Choose region and settings"
                description="Set the defaults new projects inherit when the workspace is created."
              >
                <FieldGroup className="grid gap-5 @2xl/onboarding:grid-cols-2">
                  <Field data-invalid={Boolean(errors.region)}>
                    <FieldLabel htmlFor="workspace-region">Region</FieldLabel>
                    <FieldDescription>
                      Pick the closest region for production deployments.
                    </FieldDescription>
                    <Select
                      value={values.region}
                      onValueChange={(nextRegion) =>
                        setSelectValue(
                          "region",
                          nextRegion as OnboardingValues["region"]
                        )
                      }
                    >
                      <SelectTrigger
                        id="workspace-region"
                        aria-invalid={Boolean(errors.region)}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="iad1">
                            {regionLabels.iad1}
                          </SelectItem>
                          <SelectItem value="fra1">
                            {regionLabels.fra1}
                          </SelectItem>
                          <SelectItem value="sin1">
                            {regionLabels.sin1}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError>{errors.region?.message}</FieldError>
                  </Field>

                  <Field data-invalid={Boolean(errors.environment)}>
                    <FieldLabel htmlFor="workspace-environment">
                      Default environment
                    </FieldLabel>
                    <FieldDescription>
                      Choose where collaborators land after setup.
                    </FieldDescription>
                    <Select
                      value={values.environment}
                      onValueChange={(nextEnvironment) =>
                        setSelectValue(
                          "environment",
                          nextEnvironment as OnboardingValues["environment"]
                        )
                      }
                    >
                      <SelectTrigger
                        id="workspace-environment"
                        aria-invalid={Boolean(errors.environment)}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="preview">Preview</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError>{errors.environment?.message}</FieldError>
                  </Field>
                </FieldGroup>

                <div className="grid gap-3 @2xl/onboarding:grid-cols-2">
                  <PreferenceCard
                    icon={Rocket}
                    title="Fast path"
                    description="Create the workspace with production defaults and invite teammates later."
                    active={values.environment === "production"}
                  />
                  <PreferenceCard
                    icon={Globe2}
                    title="Preview first"
                    description="Start in preview mode when the team needs a private staging space."
                    active={values.environment === "preview"}
                  />
                </div>
              </OnboardingPanel>
            </StepperContent>

            <StepperContent
              value="team"
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <OnboardingPanel
                title="Invite collaborators"
                description="Add the first teammate now, or leave the invite blank and do it later."
              >
                <FieldGroup className="grid gap-5 @2xl/onboarding:grid-cols-[minmax(0,1fr)_12rem]">
                  <Field data-invalid={Boolean(errors.inviteEmail)}>
                    <FieldLabel htmlFor="invite-email">Invite email</FieldLabel>
                    <FieldDescription>
                      Leave blank to invite members after setup.
                    </FieldDescription>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="teammate@company.com"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.inviteEmail)}
                      onInput={() => form.clearErrors("inviteEmail")}
                      {...form.register("inviteEmail")}
                    />
                    <FieldError>{errors.inviteEmail?.message}</FieldError>
                  </Field>

                  <Field data-invalid={Boolean(errors.inviteRole)}>
                    <FieldLabel htmlFor="invite-role">Role</FieldLabel>
                    <FieldDescription>Access for this invite.</FieldDescription>
                    <Select
                      value={values.inviteRole}
                      onValueChange={(nextRole) =>
                        setSelectValue(
                          "inviteRole",
                          nextRole as OnboardingValues["inviteRole"]
                        )
                      }
                    >
                      <SelectTrigger
                        id="invite-role"
                        aria-invalid={Boolean(errors.inviteRole)}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError>{errors.inviteRole?.message}</FieldError>
                  </Field>
                </FieldGroup>

                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground">
                      <Users className="size-4" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium">
                        Collaborators can join later
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        This block keeps team invitations optional while still
                        validating malformed email addresses before review.
                      </p>
                    </div>
                  </div>
                </div>
              </OnboardingPanel>
            </StepperContent>

            <StepperContent
              value="review"
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <OnboardingPanel
                title={submitted ? "Workspace created" : "Review workspace"}
                description={
                  submitted
                    ? "The local demo submitted successfully."
                    : "Confirm the collected settings before creating the workspace."
                }
              >
                <div className="grid gap-3">
                  <SummaryRow
                    icon={Building2}
                    label="Workspace"
                    value={values.workspaceName || "Untitled workspace"}
                    help={workspaceUrl}
                  />
                  <SummaryRow
                    icon={Globe2}
                    label="Defaults"
                    value={regionLabels[values.region]}
                    help={
                      values.environment === "production"
                        ? "Production is the default landing view"
                        : "Preview is the default landing view"
                    }
                  />
                  <SummaryRow
                    icon={Mail}
                    label="Invite"
                    value={values.inviteEmail || "No invite yet"}
                    help={
                      values.inviteEmail
                        ? `${values.inviteRole} access queued`
                        : "Members can be invited later"
                    }
                  />
                </div>

                {submitted ? (
                  <Alert>
                    <ShieldCheck />
                    <AlertTitle>Workspace created</AlertTitle>
                    <AlertDescription>
                      The flow reached its submitted state and locked the final
                      action.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </OnboardingPanel>
            </StepperContent>

            <Separator className="my-5" />

            <div className="flex flex-col gap-4 @2xl/onboarding:flex-row @2xl/onboarding:items-center @2xl/onboarding:justify-between">
              {currentStepHasErrors ? (
                <Alert variant="destructive" className="@2xl/onboarding:max-w-md">
                  <AlertCircle />
                  <AlertTitle>Step needs attention</AlertTitle>
                  <AlertDescription>
                    Fix the highlighted fields before continuing.
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleHelp className="size-4" />
                  You can always change these settings later.
                </p>
              )}

              <div className="flex justify-end gap-2">
                {currentIndex === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className={controlButtonClass}
                    onClick={resetOnboarding}
                  >
                    Cancel
                  </Button>
                ) : (
                  <StepperPrevious asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={controlButtonClass}
                    >
                      <ArrowLeft data-icon="inline-start" />
                      Back
                    </Button>
                  </StepperPrevious>
                )}

                {value === "review" ? (
                  <Button
                    type="button"
                    className={cn(controlButtonClass, "min-w-32")}
                    onClick={() => void createWorkspace()}
                    disabled={submitted}
                  >
                    {submitted ? "Created" : "Create workspace"}
                    <Check data-icon="inline-end" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className={controlButtonClass}
                    onClick={() => void continueToNextStep()}
                  >
                    Continue
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {completedCount} of {onboardingSteps.length} gates complete
              </span>
              <span className="font-mono">stepper-onboarding</span>
            </div>
          </div>
        </Stepper>
      </CardContent>
    </Card>
  );
}

function getWorkspaceUrl(values: Pick<OnboardingValues, "workspaceDomain" | "workspaceSlug">) {
  const slug = values.workspaceSlug || "workspace";

  return `${slug}.${values.workspaceDomain}`;
}

function OnboardingPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto flex max-w-3xl min-w-0 flex-col gap-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function WorkspacePreview({
  values,
  workspaceUrl,
}: {
  values: OnboardingValues;
  workspaceUrl: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <p className="mb-2 text-xs text-muted-foreground">Workspace preview</p>
      <div className="overflow-hidden rounded-md border bg-background">
        <div className="flex gap-1.5 border-b bg-muted/30 px-3 py-2">
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="flex flex-col gap-4 p-4 @2xl/onboarding:flex-row @2xl/onboarding:items-center @2xl/onboarding:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
              <Rocket className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">
                  {values.workspaceName || "Untitled workspace"}
                </p>
                <Badge variant="secondary" className="rounded-md px-1.5 py-0">
                  Hobby
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {workspaceUrl}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 rounded-md border bg-muted/20 p-1 text-xs text-muted-foreground">
            <span className="rounded bg-background px-2 py-1 text-foreground shadow-sm">
              Projects
            </span>
            <span className="px-2 py-1">Deployments</span>
            <span className="px-2 py-1">Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferenceCard({
  icon: Icon,
  title,
  description,
  active,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/20 p-4",
        active && "border-blue-500/50 bg-blue-500/5"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground",
            active && "border-blue-500/50 text-blue-500"
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  help,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  help: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-card text-muted-foreground [&>svg]:size-4">
        <Icon />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{help}</p>
      </div>
    </div>
  );
}

export { StepperOnboardingExample };
