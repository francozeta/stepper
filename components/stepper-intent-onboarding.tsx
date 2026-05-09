"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Circle,
  CircleHelp,
  Home,
  ImagePlus,
  KeyRound,
  Laptop,
  ListChecks,
  LoaderCircle,
  Mail,
  Monitor,
  Plane,
  School,
  Search,
  Sparkles,
  SquareCheckBig,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  useForm,
  useWatch,
  type FieldPath,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { FaApple, FaBuilding, FaKey, FaMicrosoft } from "react-icons/fa6";
import { SiGoogle } from "react-icons/si";
import { z } from "zod/v3";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

const emailStepSchema = z.object({
  email: z.string().trim().email("Enter a valid work email."),
});

const verificationStepSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit verification code."),
});

const profileStepSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  password: z.string().min(8, "Use at least 8 characters."),
});

const intentStepSchema = z.object({
  intent: z.enum(["work", "personal", "school"], {
    required_error: "Choose how you want to use the workspace.",
  }),
});

const collaborationStepSchema = z.object({
  collaboration: z.enum(["with-others", "on-my-own"], {
    required_error: "Choose a collaboration mode.",
  }),
});

const onboardingStepValues = [
  "account",
  "verify",
  "profile",
  "intent",
  "collaboration",
  "interests",
  "generating",
  "workspace",
] as const;

type OnboardingStep = (typeof onboardingStepValues)[number];
type IntentValue = z.infer<typeof intentStepSchema>["intent"];
type CollaborationValue = z.infer<
  typeof collaborationStepSchema
>["collaboration"];
type InterestValue =
  | "career"
  | "books"
  | "todo"
  | "site"
  | "travel"
  | "projects"
  | "finance"
  | "food"
  | "hobbies"
  | "habits";

type IntentOnboardingValues = {
  email: string;
  code: string;
  name: string;
  password: string;
  intent?: IntentValue;
  collaboration?: CollaborationValue;
  interests: InterestValue[];
  marketingOptOut: boolean;
};

type StepDefinition = {
  value: OnboardingStep;
  label: string;
};

const onboardingSteps = [
  { value: "account", label: "Create account" },
  { value: "verify", label: "Verify email" },
  { value: "profile", label: "Create profile" },
  { value: "intent", label: "Choose intent" },
  { value: "collaboration", label: "Choose collaboration" },
  { value: "interests", label: "Choose interests" },
  { value: "generating", label: "Generate workspace" },
  { value: "workspace", label: "Open workspace" },
] satisfies StepDefinition[];

const intentOptions = [
  {
    value: "work",
    title: "For work",
    description: "Track projects, company goals, meeting notes",
    icon: BriefcaseBusiness,
  },
  {
    value: "personal",
    title: "For personal life",
    description: "Write better, think more clearly, stay organized",
    icon: Home,
  },
  {
    value: "school",
    title: "For school",
    description: "Keep notes, research, and tasks in one place",
    icon: School,
  },
] satisfies Array<{
  value: IntentValue;
  title: string;
  description: string;
  icon: LucideIcon;
}>;

const collaborationOptions = [
  {
    value: "with-others",
    title: "With others",
    description: "Plan travel, household chores, group activities",
    icon: UsersRound,
  },
  {
    value: "on-my-own",
    title: "On my own",
    description: "Manage expenses, track hobbies, stay organized",
    icon: CircleHelp,
  },
] satisfies Array<{
  value: CollaborationValue;
  title: string;
  description: string;
  icon: LucideIcon;
}>;

const interestOptions = [
  { value: "career", label: "Career building", icon: BriefcaseBusiness },
  { value: "books", label: "Books and media", icon: Monitor },
  { value: "todo", label: "To-do list", icon: ListChecks },
  { value: "site", label: "Site or blog", icon: Laptop },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "projects", label: "Project tracking", icon: SquareCheckBig },
  { value: "finance", label: "Personal finance", icon: Circle },
  { value: "food", label: "Food and nutrition", icon: Home },
  { value: "hobbies", label: "Hobbies", icon: BookOpen },
  { value: "habits", label: "Habit tracking", icon: Check },
] satisfies Array<{
  value: InterestValue;
  label: string;
  icon: LucideIcon;
}>;

const stepFields = {
  account: ["email"],
  verify: ["code"],
  profile: ["name", "password"],
  intent: ["intent"],
  collaboration: ["collaboration"],
  interests: [],
  generating: [],
  workspace: [],
} satisfies Record<OnboardingStep, FieldPath<IntentOnboardingValues>[]>;

function StepperIntentOnboardingExample() {
  const [step, setStep] = React.useState<OnboardingStep>("account");
  const [completedSteps, setCompletedSteps] = React.useState<
    Partial<Record<OnboardingStep, boolean>>
  >({});
  const [isGenerating, setIsGenerating] = React.useState(false);
  const generationTimeoutRef = React.useRef<number | null>(null);
  const form = useForm<IntentOnboardingValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
      code: "",
      name: "",
      password: "",
      intent: undefined,
      collaboration: undefined,
      interests: [],
      marketingOptOut: false,
    },
  });
  const watchedValues = useWatch({ control: form.control });
  const values = React.useMemo<IntentOnboardingValues>(
    () => ({
      email: watchedValues.email ?? "",
      code: watchedValues.code ?? "",
      name: watchedValues.name ?? "",
      password: watchedValues.password ?? "",
      intent: watchedValues.intent,
      collaboration: watchedValues.collaboration,
      interests: watchedValues.interests ?? [],
      marketingOptOut: watchedValues.marketingOptOut ?? false,
    }),
    [
      watchedValues.code,
      watchedValues.collaboration,
      watchedValues.email,
      watchedValues.intent,
      watchedValues.interests,
      watchedValues.marketingOptOut,
      watchedValues.name,
      watchedValues.password,
    ]
  );
  const currentIndex = getVisibleStepIndex(step, values);
  const totalVisibleSteps = getVisibleSteps(values).length;
  const progress = Math.round(((currentIndex + 1) / totalVisibleSteps) * 100);

  React.useEffect(() => {
    return () => {
      if (generationTimeoutRef.current) {
        window.clearTimeout(generationTimeoutRef.current);
      }
    };
  }, []);

  function goBack() {
    const previousStep = getPreviousStep(step, values);

    if (previousStep) {
      setStep(previousStep);
    }
  }

  async function continueFromStep() {
    const isValid = validateCurrentStep(step, form);

    if (!isValid) {
      return;
    }

    setCompletedSteps((current) => ({ ...current, [step]: true }));

    if (step === "interests") {
      startGeneration();
      return;
    }

    const nextStep = getNextStep(step, values);

    if (nextStep) {
      setStep(nextStep);
    }
  }

  function continueWithProvider(provider: string) {
    const providerEmail =
      provider === "Google" ? "alex.smith@example.com" : "alex@workspace.co";

    form.clearErrors(["email", "code"]);
    form.setValue("email", providerEmail, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCompletedSteps((current) => ({
      ...current,
      account: true,
      verify: true,
    }));
    setStep("profile");
  }

  function selectIntent(intent: IntentValue) {
    form.clearErrors("intent");
    form.setValue("intent", intent, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCompletedSteps((current) => ({
      ...current,
      intent: false,
      collaboration: false,
    }));
  }

  function selectCollaboration(collaboration: CollaborationValue) {
    form.clearErrors("collaboration");
    form.setValue("collaboration", collaboration, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function toggleInterest(interest: InterestValue) {
    const currentInterests = values.interests;
    const nextInterests = currentInterests.includes(interest)
      ? currentInterests.filter((item) => item !== interest)
      : [...currentInterests, interest];

    form.setValue("interests", nextInterests, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  function skipInterests() {
    form.setValue("interests", [], {
      shouldDirty: true,
      shouldTouch: true,
    });
    setCompletedSteps((current) => ({ ...current, interests: true }));
    startGeneration();
  }

  function startGeneration() {
    setIsGenerating(true);
    setStep("generating");

    if (generationTimeoutRef.current) {
      window.clearTimeout(generationTimeoutRef.current);
    }

    generationTimeoutRef.current = window.setTimeout(() => {
      setIsGenerating(false);
      setCompletedSteps((current) => ({
        ...current,
        interests: true,
        generating: true,
        workspace: true,
      }));
      setStep("workspace");
    }, 700);
  }

  return (
    <Stepper
      value={step}
      onValueChange={(nextStep) => setStep(nextStep as OnboardingStep)}
      className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-sm"
    >
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-foreground transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex min-h-[720px] flex-col">
        <OnboardingTopBar canGoBack={Boolean(getPreviousStep(step, values))} onBack={goBack} />
        <HiddenStepList completedSteps={completedSteps} values={values} />

        <StepperContent value="account" className="border-0 bg-transparent p-0 shadow-none">
          <CenteredStage>
            <AuthPanel
              email={values.email}
              error={form.formState.errors.email?.message}
              registerEmail={form.register("email", {
                onChange: () => form.clearErrors("email"),
              })}
              onContinue={() => void continueFromStep()}
              onProvider={continueWithProvider}
            />
          </CenteredStage>
        </StepperContent>

        <StepperContent value="verify" className="border-0 bg-transparent p-0 shadow-none">
          <CenteredStage>
            <VerifyPanel
              email={values.email}
              error={form.formState.errors.code?.message}
              registerCode={form.register("code", {
                onChange: () => form.clearErrors("code"),
              })}
              onContinue={() => void continueFromStep()}
            />
          </CenteredStage>
        </StepperContent>

        <StepperContent value="profile" className="border-0 bg-transparent p-0 shadow-none">
          <CenteredStage>
            <ProfilePanel
              values={values}
              errors={{
                name: form.formState.errors.name?.message,
                password: form.formState.errors.password?.message,
              }}
              registerName={form.register("name", {
                onChange: () => form.clearErrors("name"),
              })}
              registerPassword={form.register("password", {
                onChange: () => form.clearErrors("password"),
              })}
              marketingOptOut={values.marketingOptOut}
              onMarketingChange={(checked) =>
                form.setValue("marketingOptOut", checked, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              onContinue={() => void continueFromStep()}
            />
          </CenteredStage>
        </StepperContent>

        <StepperContent value="intent" className="border-0 bg-transparent p-0 shadow-none">
          <CenteredStage>
            <IntentPanel
              value={values.intent}
              error={form.formState.errors.intent?.message}
              onSelect={selectIntent}
              onContinue={() => void continueFromStep()}
            />
          </CenteredStage>
        </StepperContent>

        <StepperContent
          value="collaboration"
          className="border-0 bg-transparent p-0 shadow-none"
        >
          <CenteredStage>
            <CollaborationPanel
              value={values.collaboration}
              error={form.formState.errors.collaboration?.message}
              onSelect={selectCollaboration}
              onContinue={() => void continueFromStep()}
            />
          </CenteredStage>
        </StepperContent>

        <StepperContent value="interests" className="border-0 bg-transparent p-0 shadow-none">
          <SplitStage>
            <InterestsPanel
              selectedInterests={values.interests}
              onToggleInterest={toggleInterest}
              onContinue={() => void continueFromStep()}
              onSkip={skipInterests}
            />
            <WorkspaceBlueprint selectedInterests={values.interests} />
          </SplitStage>
        </StepperContent>

        <StepperContent value="generating" className="border-0 bg-transparent p-0 shadow-none">
          <CenteredStage>
            <GeneratingPanel values={values} isGenerating={isGenerating} />
          </CenteredStage>
        </StepperContent>

        <StepperContent value="workspace" className="border-0 bg-transparent p-0 shadow-none">
          <WorkspacePanel values={values} />
        </StepperContent>
      </div>
    </Stepper>
  );
}

function HiddenStepList({
  completedSteps,
  values,
}: {
  completedSteps: Partial<Record<OnboardingStep, boolean>>;
  values: IntentOnboardingValues;
}) {
  return (
    <StepperList
      aria-label="Intent onboarding flow steps"
      className="sr-only !w-px !gap-0 !overflow-hidden !pb-0 data-[orientation=horizontal]:!w-px data-[orientation=horizontal]:!gap-0 data-[orientation=horizontal]:!overflow-hidden data-[orientation=horizontal]:!pb-0"
    >
      {onboardingSteps.map((item) => (
        <StepperItem
          key={item.value}
          value={item.value}
          completed={Boolean(completedSteps[item.value])}
          disabled={isStepSkipped(item.value, values)}
        >
          {item.label}
        </StepperItem>
      ))}
    </StepperList>
  );
}

function OnboardingTopBar({
  canGoBack,
  onBack,
}: {
  canGoBack: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex h-16 items-center justify-between px-4 text-sm text-muted-foreground sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          disabled={!canGoBack}
          onClick={onBack}
          aria-label="Go back"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <StepperMark />
          <Separator orientation="vertical" className="h-5 bg-border" />
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted hover:text-foreground"
          >
            English (US)
            <ChevronDown className="size-3.5" />
          </button>
        </div>
      </div>
      <CircleHelp className="size-4 text-muted-foreground" />
    </div>
  );
}

function CenteredStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[640px] flex-1 items-start justify-center px-6 pb-12 pt-24 sm:pt-32">
      {children}
    </div>
  );
}

function SplitStage({
  children,
}: {
  children: [React.ReactNode, React.ReactNode];
}) {
  return (
    <div className="grid min-h-[640px] flex-1 items-center gap-8 overflow-hidden px-6 pb-10 pt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:px-16">
      {children}
    </div>
  );
}

function AuthPanel({
  email,
  error,
  registerEmail,
  onContinue,
  onProvider,
}: {
  email: string;
  error?: string;
  registerEmail: UseFormRegisterReturn<"email">;
  onContinue: () => void;
  onProvider: (provider: string) => void;
}) {
  return (
    <div className="w-full max-w-[430px]">
      <StageHeading
        title="Your AI workspace."
        description="Create your account"
      />

      <div className="mt-9 grid gap-2">
        {["Google", "Apple", "Microsoft", "passkey", "SSO"].map((provider) => (
          <ProviderButton
            key={provider}
            provider={provider}
            onClick={() => onProvider(provider)}
          />
        ))}
      </div>

      <Separator className="my-7 bg-border" />

      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor="intent-email" className="text-muted-foreground">
          Work email
        </FieldLabel>
        <div className="relative">
          <Input
            id="intent-email"
            type="email"
            placeholder="Enter your email address..."
            autoComplete="email"
            aria-invalid={Boolean(error)}
            className="h-11 rounded-md border-border bg-background pr-10 text-base shadow-none focus-visible:ring-ring"
            {...registerEmail}
          />
          {email ? (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-foreground p-0.5 text-background">
              <Check className="size-3" />
            </span>
          ) : (
            <Mail className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          )}
        </div>
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <FieldDescription className="text-muted-foreground">
            Use an organization email to easily collaborate with teammates.
          </FieldDescription>
        )}
      </Field>

      <PrimaryAction className="mt-7" onClick={onContinue}>
        Continue
      </PrimaryAction>

      <p className="mt-7 text-sm leading-6 text-muted-foreground">
        By continuing, you acknowledge that you understand and agree to the{" "}
        <span className="underline decoration-border underline-offset-2">
          Terms & Conditions
        </span>{" "}
        and{" "}
        <span className="underline decoration-border underline-offset-2">
          Privacy Policy
        </span>
        .
      </p>
    </div>
  );
}

function VerifyPanel({
  email,
  error,
  registerCode,
  onContinue,
}: {
  email: string;
  error?: string;
  registerCode: UseFormRegisterReturn<"code">;
  onContinue: () => void;
}) {
  return (
    <div className="w-full max-w-[430px]">
      <StageHeading
        title="Your AI workspace."
        description="Check your inbox"
      />

      <div className="mt-9 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        We sent a verification code to{" "}
        <span className="font-medium text-foreground">{email}</span>.
      </div>

      <Field data-invalid={Boolean(error)} className="mt-5">
        <FieldLabel htmlFor="intent-code" className="text-muted-foreground">
          Verification code
        </FieldLabel>
        <Input
          id="intent-code"
          inputMode="numeric"
          placeholder="Enter code"
          aria-invalid={Boolean(error)}
          className="h-11 rounded-md border-border bg-background text-base tracking-[0.18em] shadow-none focus-visible:ring-ring"
          {...registerCode}
        />
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <FieldDescription className="text-muted-foreground">
            Use 123456 for this demo.
          </FieldDescription>
        )}
      </Field>

      <PrimaryAction className="mt-7" onClick={onContinue}>
        Continue
      </PrimaryAction>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Resend in 25s
      </p>
    </div>
  );
}

function ProfilePanel({
  values,
  errors,
  registerName,
  registerPassword,
  marketingOptOut,
  onMarketingChange,
  onContinue,
}: {
  values: IntentOnboardingValues;
  errors: { name?: string; password?: string };
  registerName: UseFormRegisterReturn<"name">;
  registerPassword: UseFormRegisterReturn<"password">;
  marketingOptOut: boolean;
  onMarketingChange: (checked: boolean) => void;
  onContinue: () => void;
}) {
  return (
    <div className="w-full max-w-[430px]">
      <StageHeading
        title="Create a profile"
        description="This is how you'll appear in the workspace"
        align="center"
      />

      <div className="mt-12 flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <div className="grid size-20 place-items-center rounded-full border border-border bg-muted/50 text-xl font-semibold text-foreground">
          {getInitials(values.name || values.email)}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ImagePlus className="size-4" />
          Add a photo
        </button>
      </div>

      <div className="mt-12 grid gap-5">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="intent-name" className="text-muted-foreground">
            Enter your name
          </FieldLabel>
          <Input
            id="intent-name"
            placeholder="Name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className="h-11 rounded-md border-border bg-background text-base shadow-none focus-visible:ring-ring"
            {...registerName}
          />
          {errors.name ? <FieldError>{errors.name}</FieldError> : null}
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="intent-password" className="text-muted-foreground">
            Set a password
          </FieldLabel>
          <div className="relative">
            <Input
              id="intent-password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              className="h-11 rounded-md border-border bg-background pr-10 text-base shadow-none focus-visible:ring-ring"
              {...registerPassword}
            />
            <KeyRound className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.password ? (
            <FieldError>{errors.password}</FieldError>
          ) : null}
        </Field>
      </div>

      <PrimaryAction className="mt-12" onClick={onContinue}>
        Continue
      </PrimaryAction>

      <label className="mt-5 flex items-start gap-2 text-sm leading-5 text-muted-foreground">
        <Checkbox
          checked={marketingOptOut}
          onCheckedChange={(checked) => onMarketingChange(checked === true)}
          className="mt-0.5 border-border"
        />
        No, I do not want to receive marketing communications.
      </label>
    </div>
  );
}

function IntentPanel({
  value,
  error,
  onSelect,
  onContinue,
}: {
  value?: IntentValue;
  error?: string;
  onSelect: (value: IntentValue) => void;
  onContinue: () => void;
}) {
  return (
    <div className="w-full max-w-[560px]">
      <StageHeading
        title="How do you want to use this workspace?"
        description="This helps customize your experience"
        align="center"
      />

      <div className="mt-16 grid gap-4">
        {intentOptions.map((option) => (
          <LargeOptionButton
            key={option.value}
            active={value === option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>

      {error ? (
        <p className="mt-3 text-center text-sm text-destructive">{error}</p>
      ) : null}

      <PrimaryAction className="mt-8" onClick={onContinue}>
        Continue
      </PrimaryAction>
    </div>
  );
}

function CollaborationPanel({
  value,
  error,
  onSelect,
  onContinue,
}: {
  value?: CollaborationValue;
  error?: string;
  onSelect: (value: CollaborationValue) => void;
  onContinue: () => void;
}) {
  return (
    <div className="w-full max-w-[540px]">
      <StageHeading
        title="How will you work?"
        description="Pick the mode that best fits this setup"
        align="center"
      />

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {collaborationOptions.map((option) => (
          <TileOptionButton
            key={option.value}
            active={value === option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>

      {error ? (
        <p className="mt-3 text-center text-sm text-destructive">{error}</p>
      ) : null}

      <PrimaryAction className="mt-8" onClick={onContinue}>
        Continue
      </PrimaryAction>
    </div>
  );
}

function InterestsPanel({
  selectedInterests,
  onToggleInterest,
  onContinue,
  onSkip,
}: {
  selectedInterests: InterestValue[];
  onToggleInterest: (value: InterestValue) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="w-full max-w-[560px] justify-self-center lg:justify-self-start">
      <div className="mb-11">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          What&apos;s on your mind?
        </h2>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-muted-foreground">
          Select as many as you want.
        </p>
      </div>

      <p className="mb-3 text-sm font-medium text-muted-foreground">
        {selectedInterests.length} selected
      </p>

      <div className="flex flex-wrap gap-3">
        {interestOptions.map((option) => (
          <InterestChip
            key={option.value}
            option={option}
            active={selectedInterests.includes(option.value)}
            onClick={() => onToggleInterest(option.value)}
          />
        ))}
      </div>

      <PrimaryAction className="mt-24 max-w-[520px]" onClick={onContinue}>
        Continue
      </PrimaryAction>
      <button
        type="button"
        className="mt-5 block w-full max-w-[520px] rounded-md py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        onClick={onSkip}
      >
        Skip for now
      </button>
    </div>
  );
}

function GeneratingPanel({
  values,
  isGenerating,
}: {
  values: IntentOnboardingValues;
  isGenerating: boolean;
}) {
  const items = [
    "Choosing starter pages",
    "Mapping your interests",
    "Preparing a workspace checklist",
  ];

  return (
    <div className="w-full max-w-[500px] text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-border bg-muted/40 shadow-sm">
        <Sparkles className="size-7 text-foreground" />
      </div>
      <h2 className="mt-7 text-3xl font-semibold tracking-tight text-foreground">
        Generating your starter workspace
      </h2>
      <p className="mt-3 text-lg font-medium text-muted-foreground">
        {values.intent
          ? `Tuned for ${getIntentLabel(values.intent).toLowerCase()}.`
          : "Tuned for your workflow."}
      </p>

      <div className="mt-10 rounded-xl border border-border bg-muted/30 p-4 text-left">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3 py-2">
            <span className="grid size-7 place-items-center rounded-full bg-background text-muted-foreground">
              {index === items.length - 1 && isGenerating ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </span>
            <span className="text-sm font-medium text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkspacePanel({ values }: { values: IntentOnboardingValues }) {
  const selectedLabels = values.interests
    .map((interest) => interestOptions.find((item) => item.value === interest)?.label)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="grid min-h-[640px] flex-1 grid-cols-1 bg-background lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-r border-border bg-muted/40 px-3 py-4">
        <div className="mb-6 flex items-center justify-between gap-2 px-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-6 place-items-center rounded bg-background text-xs font-semibold text-foreground ring-1 ring-border">
              {getInitials(values.name || values.email)}
            </span>
            <p className="truncate text-sm font-medium text-foreground">
              {values.name ? `${values.name}'s Workspace` : "Starter Workspace"}
            </p>
          </div>
          <Sparkles className="size-4 text-muted-foreground" />
        </div>

        <nav className="grid gap-1 text-sm text-muted-foreground">
          <SidebarItem icon={Search} label="Search" />
          <SidebarItem icon={Home} label="Home" />
          <SidebarItem icon={Mail} label="Inbox" />
        </nav>

        <div className="mt-8 px-2 text-xs font-medium text-muted-foreground">
          Private
        </div>
        <nav className="mt-2 grid gap-1 text-sm text-foreground">
          <SidebarItem icon={ListChecks} label="Weekly To-do List" />
          <SidebarItem icon={Sparkles} label="Welcome to your workspace" active />
          <SidebarItem icon={SquareCheckBig} label="Habit Tracker" />
        </nav>
      </aside>

      <main className="flex min-w-0 flex-col">
        <div className="flex h-14 items-center justify-between border-b border-border px-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Welcome to your workspace
          </span>
          <div className="flex items-center gap-4">
            <span>Edited just now</span>
            <button type="button" className="font-medium text-foreground">
              Share
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-7 grid size-20 place-items-center rounded-2xl border border-border bg-muted/50 text-4xl">
              <Sparkles className="size-9 text-foreground" />
            </div>
            <h2 className="text-5xl font-bold tracking-tight text-foreground">
              Welcome to your workspace
            </h2>
          </div>

          <div className="mx-auto max-w-xl space-y-3 text-lg text-foreground">
            <ChecklistRow checked text="Create an account" />
            <ChecklistRow checked text="Choose your workspace intent" />
            <ChecklistRow
              checked={values.interests.length > 0}
              text={
                selectedLabels.length > 0
                  ? `Generate pages for ${selectedLabels.join(", ")}`
                  : "Add starter pages when you are ready"
              }
            />
            <ChecklistRow text="Click anywhere below and type / to add blocks" />
            <ChecklistRow text="Invite teammates from the sidebar" />
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
            This final screen is still Stepper content. The user sees a normal
            workspace, while the primitive keeps the flow state available for
            completion, analytics, or resume logic.
          </div>
        </div>
      </main>
    </div>
  );
}

function StageHeading({
  title,
  description,
  align = "left",
}: {
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ProviderButton({
  provider,
  onClick,
}: {
  provider: string;
  onClick: () => void;
}) {
  const label =
    provider === "passkey"
      ? "Log in with passkey"
      : provider === "SSO"
        ? "Single sign-on (SSO)"
        : `Continue with ${provider}`;

  return (
    <Button
      type="button"
      variant="outline"
      className="relative h-11 justify-center rounded-md border-border bg-background text-base font-medium text-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-muted/60"
      onClick={onClick}
    >
      <ProviderGlyph provider={provider} />
      {label}
    </Button>
  );
}

function ProviderGlyph({ provider }: { provider: string }) {
  const Icon =
    provider === "Google"
      ? SiGoogle
      : provider === "Apple"
        ? FaApple
        : provider === "Microsoft"
          ? FaMicrosoft
          : provider === "passkey"
            ? FaKey
            : FaBuilding;

  return <Icon className="absolute left-4 size-4 text-foreground" aria-hidden="true" />;
}

function PrimaryAction({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      className={cn(
        "h-11 w-full rounded-md bg-foreground text-base font-semibold text-background shadow-none hover:bg-foreground/90 focus-visible:ring-ring",
        className
      )}
      onClick={onClick}
    >
      {children}
      <ArrowRight data-icon="inline-end" />
    </Button>
  );
}

function LargeOptionButton({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-32 w-full items-center gap-7 rounded-xl border border-border bg-background px-8 text-left transition-colors hover:bg-muted/60",
        active && "border-foreground bg-muted/30 ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      <Icon className="size-12 shrink-0 text-foreground" />
      <span className="min-w-0">
        <span className="block text-xl font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-1 block text-base leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}

function TileOptionButton({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-56 flex-col items-center justify-center rounded-xl border border-border bg-background p-7 text-center transition-colors hover:bg-muted/60",
        active && "border-foreground bg-muted/30 ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      <Icon className="mb-6 size-16 text-foreground" />
      <span className="text-xl font-semibold text-foreground">{title}</span>
      <span className="mt-2 max-w-44 text-base leading-6 text-muted-foreground">
        {description}
      </span>
    </button>
  );
}

function InterestChip({
  option,
  active,
  onClick,
}: {
  option: (typeof interestOptions)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-12 items-center gap-3 rounded-lg border border-border bg-background px-5 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted/60",
        active && "border-foreground text-foreground ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      {active ? <Check className="size-5" /> : <Icon className="size-5" />}
      {option.label}
    </button>
  );
}

function WorkspaceBlueprint({
  selectedInterests,
}: {
  selectedInterests: InterestValue[];
}) {
  const labels =
    selectedInterests.length > 0
      ? selectedInterests
          .map((interest) => interestOptions.find((item) => item.value === interest)?.label)
          .filter(Boolean)
          .slice(0, 3)
      : ["Intent", "Checklist", "Starter pages"];

  return (
    <div className="relative hidden min-h-[560px] items-center justify-center lg:flex">
      <div className="absolute inset-y-10 right-0 w-[86%] rounded-[2rem] border border-border bg-muted/30" />
      <div className="relative w-[540px] rounded-2xl border border-border bg-background p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground/30" />
            <span className="size-2 rounded-full bg-foreground/20" />
            <span className="size-2 rounded-full bg-foreground/10" />
          </div>
          <div className="h-2 w-24 rounded-full bg-muted" />
        </div>

        <div className="grid gap-4 md:grid-cols-[8rem_minmax(0,1fr)]">
          <aside className="rounded-xl border border-border bg-muted/40 p-3">
            <div className="mb-4 h-6 w-20 rounded-md bg-background ring-1 ring-border" />
            <div className="grid gap-2">
              {["Home", "Inbox", "Roadmap"].map((item, index) => (
                <div
                  key={item}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground",
                    index === 0 && "bg-background text-foreground ring-1 ring-border"
                  )}
                >
                  <span className="size-2 rounded-full bg-foreground/50" />
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 rounded-xl border border-border bg-background p-4">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 h-3 w-16 rounded-full bg-foreground" />
                <div className="h-4 w-48 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="grid size-9 place-items-center rounded-lg border border-border bg-muted/40">
                <Sparkles className="size-4" />
              </div>
            </div>

            <div className="grid gap-3">
              {labels.map((label, index) => (
                <div
                  key={label}
                  className="rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      {label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <div className="grid gap-1.5">
                    <span className="h-1.5 rounded-full bg-foreground/20" />
                    <span className="h-1.5 w-4/5 rounded-full bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5",
        active && "bg-background font-medium text-foreground ring-1 ring-border"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function ChecklistRow({ checked, text }: { checked?: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center border border-border",
          checked && "border-foreground bg-foreground text-background"
        )}
      >
        {checked ? <Check className="size-4" /> : null}
      </span>
      <span className={cn(checked && "text-muted-foreground line-through")}>
        {text}
      </span>
    </div>
  );
}

function StepperMark() {
  return (
    <span className="grid size-7 place-items-center rounded-md bg-foreground text-base font-black text-background shadow-sm">
      S
    </span>
  );
}

function validateCurrentStep(
  step: OnboardingStep,
  form: ReturnType<typeof useForm<IntentOnboardingValues>>
) {
  const values = form.getValues();
  const schema = getStepSchema(step);

  form.clearErrors(stepFields[step]);

  if (!schema) {
    return true;
  }

  const result = schema.safeParse(values);

  if (result.success) {
    return true;
  }

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as FieldPath<IntentOnboardingValues>;

    form.setError(field, { message: issue.message, type: "manual" });
  });

  const firstIssue = result.error.issues[0];

  if (firstIssue) {
    const firstField = firstIssue.path[0] as FieldPath<IntentOnboardingValues>;

    form.setFocus(firstField);
  }

  return false;
}

function getStepSchema(step: OnboardingStep) {
  if (step === "account") return emailStepSchema;
  if (step === "verify") return verificationStepSchema;
  if (step === "profile") return profileStepSchema;
  if (step === "intent") return intentStepSchema;
  if (step === "collaboration") return collaborationStepSchema;

  return undefined;
}

function getVisibleSteps(values: IntentOnboardingValues) {
  return onboardingStepValues.filter((step) => !isStepSkipped(step, values));
}

function getVisibleStepIndex(step: OnboardingStep, values: IntentOnboardingValues) {
  const visibleSteps = getVisibleSteps(values);
  const index = visibleSteps.indexOf(step);

  return index === -1 ? 0 : index;
}

function getNextStep(step: OnboardingStep, values: IntentOnboardingValues) {
  const visibleSteps = getVisibleSteps(values);
  const currentIndex = visibleSteps.indexOf(step);

  return visibleSteps[currentIndex + 1];
}

function getPreviousStep(step: OnboardingStep, values: IntentOnboardingValues) {
  const visibleSteps = getVisibleSteps(values);
  const currentIndex = visibleSteps.indexOf(step);

  return visibleSteps[currentIndex - 1];
}

function isStepSkipped(step: OnboardingStep, values: IntentOnboardingValues) {
  return step === "collaboration" && values.intent !== "personal";
}

function getInitials(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return "A";
  }

  return normalized
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getIntentLabel(intent: IntentValue) {
  return intentOptions.find((option) => option.value === intent)?.title ?? intent;
}

export { StepperIntentOnboardingExample };
