"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
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
import { motion, useReducedMotion } from "framer-motion";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { z } from "zod/v3";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
});

const preferencesSchema = z.object({
  region: z.enum(["iad1", "fra1", "sin1"]),
  visibility: z.enum(["private", "team"]),
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
    description: "Name and URL",
    icon: Building2,
  },
  {
    value: "preferences",
    title: "Preferences",
    description: "Region and access",
    icon: Settings2,
  },
  {
    value: "team",
    title: "Team",
    description: "Invite or skip",
    icon: Users,
  },
  {
    value: "review",
    title: "Review",
    description: "Create workspace",
    icon: Send,
  },
] as const;

type OnboardingStep = (typeof onboardingSteps)[number]["value"];

const stepFields = {
  workspace: ["workspaceName", "workspaceSlug"],
  preferences: ["region", "visibility"],
  team: ["inviteEmail", "inviteRole"],
  review: [],
} satisfies Record<OnboardingStep, FieldPath<OnboardingValues>[]>;

function StepperOnboardingExample() {
  const [value, setValue] = React.useState<OnboardingStep>("workspace");
  const [completedSteps, setCompletedSteps] = React.useState<
    Partial<Record<OnboardingStep, boolean>>
  >({});
  const [attemptedSteps, setAttemptedSteps] = React.useState<
    Partial<Record<OnboardingStep, boolean>>
  >({});
  const [submitted, setSubmitted] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      workspaceName: "",
      workspaceSlug: "",
      region: "iad1",
      visibility: "private",
      inviteEmail: "",
      inviteRole: "member",
    },
  });
  const formValues = useWatch({ control: form.control });
  const values = React.useMemo<OnboardingValues>(
    () => ({
      workspaceName: formValues.workspaceName ?? "",
      workspaceSlug: formValues.workspaceSlug ?? "",
      region: formValues.region ?? "iad1",
      visibility: formValues.visibility ?? "private",
      inviteEmail: formValues.inviteEmail ?? "",
      inviteRole: formValues.inviteRole ?? "member",
    }),
    [
      formValues.inviteEmail,
      formValues.inviteRole,
      formValues.region,
      formValues.visibility,
      formValues.workspaceName,
      formValues.workspaceSlug,
    ]
  );
  const errors = form.formState.errors;
  const currentIndex = onboardingSteps.findIndex((step) => step.value === value);
  const completedCount = onboardingSteps.filter(
    (step) => completedSteps[step.value]
  ).length;
  const progress = Math.round(
    ((submitted ? onboardingSteps.length : Math.max(currentIndex + 1, 1)) /
      onboardingSteps.length) *
      100
  );
  const currentFields = stepFields[value];
  const currentStepHasErrors = currentFields.some((field) => errors[field]);

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

  function setSelectValue(
    field: "region" | "visibility" | "inviteRole",
    nextValue: string
  ) {
    const options = {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: Boolean(attemptedSteps[value]),
    };

    form.clearErrors(field);

    if (field === "region") {
      form.setValue("region", nextValue as OnboardingValues["region"], options);
      return;
    }

    if (field === "visibility") {
      form.setValue(
        "visibility",
        nextValue as OnboardingValues["visibility"],
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
    <Card className="@container/onboarding mx-auto w-full max-w-5xl">
      <CardHeader className="gap-3 border-b">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit font-mono">
              Dev-ready block
            </Badge>
            <CardTitle className="text-xl">Create workspace</CardTitle>
            <CardDescription className="max-w-2xl">
              A complete onboarding flow with per-step validation, completion
              states, locked future steps, and motion-ready panels.
            </CardDescription>
          </div>
          <CardAction className="static col-auto row-auto flex min-w-32 flex-col gap-2 justify-self-auto">
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-mono text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} aria-label="Workspace setup progress" />
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="grid min-w-0 gap-6 p-4 @4xl/onboarding:grid-cols-[minmax(0,1fr)_18rem] @4xl/onboarding:p-5">
        <Stepper
          value={value}
          onValueChange={(nextValue) => {
            const nextStep = nextValue as OnboardingStep;

            if (!isLocked(nextStep)) {
              setValue(nextStep);
            }
          }}
          className="min-w-0 gap-5"
        >
          <StepperList aria-label="Workspace onboarding steps" className="gap-3">
            {onboardingSteps.map((step) => {
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
                >
                  <StepperTrigger>
                    <StepperIndicator>
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
                    <span className="flex min-w-0 flex-col gap-1">
                      <StepperLabel>{step.title}</StepperLabel>
                      <StepperDescription className="hidden sm:block">
                        {active ? "Current step" : step.description}
                      </StepperDescription>
                    </span>
                  </StepperTrigger>
                </StepperItem>
              );
            })}
          </StepperList>

          <StepperContent value="workspace" className="p-0">
            <MotionPanel
              title="Name the workspace"
              description="This step owns the public identity that appears in URLs and invites."
              icon={Building2}
              reduceMotion={Boolean(shouldReduceMotion)}
            >
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(errors.workspaceName)}>
                  <FieldLabel htmlFor="workspace-name">
                    Workspace name
                  </FieldLabel>
                  <Input
                    id="workspace-name"
                    placeholder="Acme Design Systems"
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.workspaceName)}
                    onInput={() => form.clearErrors("workspaceName")}
                    {...form.register("workspaceName")}
                  />
                  <FieldError>{errors.workspaceName?.message}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.workspaceSlug)}>
                  <FieldLabel htmlFor="workspace-slug">
                    Workspace slug
                  </FieldLabel>
                  <Input
                    id="workspace-slug"
                    placeholder="acme-design"
                    autoCapitalize="none"
                    autoComplete="off"
                    aria-invalid={Boolean(errors.workspaceSlug)}
                    onInput={() => form.clearErrors("workspaceSlug")}
                    {...form.register("workspaceSlug")}
                  />
                  <FieldDescription>
                    Used in URLs, for example /acme-design.
                  </FieldDescription>
                  <FieldError>{errors.workspaceSlug?.message}</FieldError>
                </Field>
              </FieldGroup>
            </MotionPanel>
          </StepperContent>

          <StepperContent value="preferences" className="p-0">
            <MotionPanel
              title="Choose workspace defaults"
              description="Preferences stay in form state while Stepper only reflects navigation and progress."
              icon={Settings2}
              reduceMotion={Boolean(shouldReduceMotion)}
            >
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(errors.region)}>
                  <FieldLabel htmlFor="workspace-region">Region</FieldLabel>
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
                        <SelectItem value="iad1">US East - iad1</SelectItem>
                        <SelectItem value="fra1">Europe - fra1</SelectItem>
                        <SelectItem value="sin1">
                          Asia Pacific - sin1
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Pick the closest default region for new projects.
                  </FieldDescription>
                  <FieldError>{errors.region?.message}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.visibility)}>
                  <FieldLabel htmlFor="workspace-visibility">
                    Visibility
                  </FieldLabel>
                  <Select
                    value={values.visibility}
                    onValueChange={(nextVisibility) =>
                      setSelectValue(
                        "visibility",
                        nextVisibility as OnboardingValues["visibility"]
                      )
                    }
                  >
                    <SelectTrigger
                      id="workspace-visibility"
                      aria-invalid={Boolean(errors.visibility)}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="team">Team visible</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Control who can discover the workspace.
                  </FieldDescription>
                  <FieldError>{errors.visibility?.message}</FieldError>
                </Field>
              </FieldGroup>
            </MotionPanel>
          </StepperContent>

          <StepperContent value="team" className="p-0">
            <MotionPanel
              title="Invite the first teammate"
              description="The invite is optional, but invalid input still blocks the next step."
              icon={Users}
              reduceMotion={Boolean(shouldReduceMotion)}
            >
              <FieldGroup className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <Field data-invalid={Boolean(errors.inviteEmail)}>
                  <FieldLabel htmlFor="invite-email">Invite email</FieldLabel>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@company.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.inviteEmail)}
                    onInput={() => form.clearErrors("inviteEmail")}
                    {...form.register("inviteEmail")}
                  />
                  <FieldDescription>
                    Leave blank to invite members later.
                  </FieldDescription>
                  <FieldError>{errors.inviteEmail?.message}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.inviteRole)}>
                  <FieldLabel htmlFor="invite-role">Role</FieldLabel>
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
            </MotionPanel>
          </StepperContent>

          <StepperContent value="review" className="p-0">
            <MotionPanel
              title={submitted ? "Workspace created" : "Review setup"}
              description={
                submitted
                  ? "The local demo submitted successfully."
                  : "Confirm the collected values before creating the workspace."
              }
              icon={submitted ? ShieldCheck : Rocket}
              reduceMotion={Boolean(shouldReduceMotion)}
            >
              <div className="grid gap-3">
                <SummaryRow
                  icon={Building2}
                  label="Workspace"
                  value={values.workspaceName || "Untitled workspace"}
                  help={`/${values.workspaceSlug || "missing-slug"}`}
                />
                <SummaryRow
                  icon={Globe2}
                  label="Defaults"
                  value={`${values.region.toUpperCase()} region`}
                  help={
                    values.visibility === "private"
                      ? "Private workspace"
                      : "Team visible workspace"
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
            </MotionPanel>
          </StepperContent>

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            {currentStepHasErrors ? (
              <Alert variant="destructive" className="sm:max-w-md">
                <AlertCircle />
                <AlertTitle>Step needs attention</AlertTitle>
                <AlertDescription>
                  Fix the highlighted fields before continuing.
                </AlertDescription>
              </Alert>
            ) : (
              <p className="text-sm text-muted-foreground">
                Validation, persistence, and animation live outside the
                primitive. Stepper only coordinates the flow.
              </p>
            )}
            <div className="flex gap-2 sm:justify-end">
              <StepperPrevious asChild>
                <Button type="button" variant="outline">
                  <ArrowLeft data-icon="inline-start" />
                  Back
                </Button>
              </StepperPrevious>
              {value === "review" ? (
                <Button
                  type="button"
                  onClick={() => void createWorkspace()}
                  disabled={submitted}
                >
                  {submitted ? "Created" : "Create workspace"}
                  <Check data-icon="inline-end" />
                </Button>
              ) : (
                <Button type="button" onClick={() => void continueToNextStep()}>
                  Continue
                  <ArrowRight data-icon="inline-end" />
                </Button>
              )}
            </div>
          </div>
        </Stepper>

        <aside className="flex min-w-0 flex-col gap-3 rounded-lg border bg-muted/25 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">Setup state</p>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {onboardingSteps.length} gates complete
              </p>
            </div>
            <Badge variant={submitted ? "default" : "outline"}>
              {submitted ? "done" : "draft"}
            </Badge>
          </div>
          <Separator />
          <div className="grid gap-2">
            {onboardingSteps.map((step) => (
              <StateRow
                key={step.value}
                title={step.title}
                active={value === step.value}
                completed={Boolean(completedSteps[step.value])}
                locked={isLocked(step.value)}
                error={hasStepError(step.value)}
              />
            ))}
          </div>
        </aside>
      </CardContent>

      <CardFooter className="justify-between gap-3 text-sm text-muted-foreground">
        <span>Installs as a shadcn block; the primitive stays dependency-light.</span>
        <span className="hidden font-mono text-xs sm:inline">
          stepper-onboarding
        </span>
      </CardFooter>
    </Card>
  );
}

function MotionPanel({
  title,
  description,
  icon: Icon,
  reduceMotion,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className="flex min-w-0 flex-col gap-5 rounded-lg bg-background p-4"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground [&>svg]:size-4">
          <Icon />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </motion.div>
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
    <div className="flex items-center gap-3 rounded-md border bg-card p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&>svg]:size-4">
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

function StateRow({
  title,
  active,
  completed,
  locked,
  error,
}: {
  title: string;
  active: boolean;
  completed: boolean;
  locked: boolean;
  error: boolean;
}) {
  const status = error
    ? "error"
    : locked
      ? "locked"
      : completed
        ? "done"
        : active
          ? "active"
          : "ready";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2",
        active && "border-primary/40",
        error && "border-destructive/50"
      )}
    >
      <span className="truncate text-sm">{title}</span>
      <Badge
        variant={error ? "destructive" : completed ? "default" : "secondary"}
        className="font-mono"
      >
        {status}
      </Badge>
    </div>
  );
}

export { StepperOnboardingExample };
