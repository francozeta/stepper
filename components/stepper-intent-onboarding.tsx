"use client";

import * as React from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
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
import { SiGoogle } from "react-icons/si";
import { z } from "zod/v3";

import { StepperLogo } from "@/components/stepper-logo";
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
    required_error: "Choose what you are setting up.",
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
  { value: "generating", label: "Prepare setup" },
  { value: "workspace", label: "Signed in" },
] satisfies StepDefinition[];

const intentOptions = [
  {
    value: "work",
    title: "For work",
    description: "Track projects, goals, and meeting notes",
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
      provider === "Google" ? "alex.smith@example.com" : "alex@example.com";

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

  function resetFlow() {
    if (generationTimeoutRef.current) {
      window.clearTimeout(generationTimeoutRef.current);
      generationTimeoutRef.current = null;
    }

    setIsGenerating(false);
    setCompletedSteps({});
    form.reset();
    setStep("account");
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

      <div className="flex min-h-[560px] flex-col">
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
              onGoogle={() => continueWithProvider("Google")}
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
          <CenteredStage>
            <InterestsPanel
              selectedInterests={values.interests}
              onToggleInterest={toggleInterest}
              onContinue={() => void continueFromStep()}
              onSkip={skipInterests}
            />
          </CenteredStage>
        </StepperContent>

        <StepperContent value="generating" className="border-0 bg-transparent p-0 shadow-none">
          <CenteredStage>
            <GeneratingPanel values={values} isGenerating={isGenerating} />
          </CenteredStage>
        </StepperContent>

        <StepperContent value="workspace" className="border-0 bg-transparent p-0 shadow-none">
          <SignedInPanel values={values} onRestart={resetFlow} />
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

function CenteredStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[560px] flex-1 items-start justify-center px-5 pb-10 pt-14 sm:px-6 sm:pt-16">
      {children}
    </div>
  );
}

function AuthPanel({
  email,
  error,
  registerEmail,
  onContinue,
  onGoogle,
}: {
  email: string;
  error?: string;
  registerEmail: UseFormRegisterReturn<"email">;
  onContinue: () => void;
  onGoogle: () => void;
}) {
  return (
    <div className="w-full max-w-[380px]">
      <StageHeading
        title="Create your account"
        description="Start with a focused onboarding flow."
        align="center"
        logo
      />

      <ProviderButton onClick={onGoogle} />

      <div className="my-5 flex items-center gap-3 text-xs font-medium text-muted-foreground">
        <Separator className="flex-1 bg-border" />
        or
        <Separator className="flex-1 bg-border" />
      </div>

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
            className="h-10 rounded-md border-border bg-background pr-10 text-sm shadow-none focus-visible:ring-ring"
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

      <PrimaryAction className="mt-6" onClick={onContinue}>
        Continue
      </PrimaryAction>

      <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
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
    <div className="w-full max-w-[380px]">
      <StageHeading
        title="Check your inbox"
        description="Use the code sent to your email."
        align="center"
      />

      <div className="mt-7 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
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
          className="h-10 rounded-md border-border bg-background font-mono text-sm shadow-none focus-visible:ring-ring"
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

      <PrimaryAction className="mt-6" onClick={onContinue}>
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
    <div className="w-full max-w-[380px]">
      <StageHeading
        title="Create a profile"
        description="This is how you'll appear."
        align="center"
      />

      <div className="mt-9 flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <div className="grid size-14 place-items-center rounded-full border border-border bg-muted/50 text-base font-semibold text-foreground">
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

      <div className="mt-9 grid gap-4">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="intent-name" className="text-muted-foreground">
            Enter your name
          </FieldLabel>
          <Input
            id="intent-name"
            placeholder="Name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className="h-10 rounded-md border-border bg-background text-sm shadow-none focus-visible:ring-ring"
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
              className="h-10 rounded-md border-border bg-background pr-10 text-sm shadow-none focus-visible:ring-ring"
              {...registerPassword}
            />
            <KeyRound className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.password ? (
            <FieldError>{errors.password}</FieldError>
          ) : null}
        </Field>
      </div>

      <PrimaryAction className="mt-9" onClick={onContinue}>
        Continue
      </PrimaryAction>

      <label className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
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
    <div className="w-full max-w-[520px]">
      <StageHeading
        title="What are you setting up?"
        description="This helps customize your experience"
        align="center"
      />

      <div className="mt-8 grid gap-3">
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

      <PrimaryAction className="mt-7" onClick={onContinue}>
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
    <div className="w-full max-w-[500px]">
      <StageHeading
        title="How will you work?"
        description="Pick the mode that best fits this setup"
        align="center"
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
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

      <PrimaryAction className="mt-7" onClick={onContinue}>
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
    <div className="w-full max-w-[520px] text-center">
      <StageHeading
        title="Choose starter goals"
        description="Stepper will prepare the optional path after sign-in."
        align="center"
      />

      <p className="mb-3 mt-7 text-xs font-medium text-muted-foreground">
        {selectedInterests.length} selected
      </p>

      <div className="flex flex-wrap justify-center gap-2.5">
        {interestOptions.map((option) => (
          <InterestChip
            key={option.value}
            option={option}
            active={selectedInterests.includes(option.value)}
            onClick={() => onToggleInterest(option.value)}
          />
        ))}
      </div>

      <PrimaryAction className="mx-auto mt-10 max-w-[380px]" onClick={onContinue}>
        Continue
      </PrimaryAction>
      <button
        type="button"
        className="mx-auto mt-4 block w-full max-w-[380px] rounded-md py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
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
    "Preparing a completion checklist",
  ];

  return (
    <div className="w-full max-w-[460px] text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-xl border border-border bg-muted/40 shadow-sm">
        <Sparkles className="size-6 text-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
        Preparing your setup
      </h2>
      <p className="mt-3 text-sm font-medium text-muted-foreground">
        {values.intent
          ? `Tuned for ${getIntentLabel(values.intent).toLowerCase()}.`
          : "Tuned for your workflow."}
      </p>

      <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4 text-left">
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

function SignedInPanel({
  values,
  onRestart,
}: {
  values: IntentOnboardingValues;
  onRestart: () => void;
}) {
  const selectedLabels = values.interests
    .map(
      (interest) =>
        interestOptions.find((item) => item.value === interest)?.label
    )
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="flex min-h-[560px] flex-1 items-center justify-center px-5 py-12 sm:px-6">
      <div className="w-full max-w-[360px] overflow-hidden rounded-xl border border-border bg-card text-left">
        <div className="grid h-28 place-items-center border-b border-border bg-background">
          <OnboardingLogo className="size-12 text-foreground" />
        </div>

        <div className="p-4 sm:p-5">
          <h2 className="text-base font-semibold text-foreground">
            You&apos;re signed in
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Stepper completed the account, intent, and optional setup path
            {values.email ? ` for ${values.email}` : ""}.
          </p>

          <div className="mt-5 grid gap-2 text-sm">
            <ChecklistRow checked text="Account verified" />
            <ChecklistRow checked text={getIntentSummary(values)} />
            <ChecklistRow
              checked
              text={
                selectedLabels.length > 0
                  ? `Prepared ${selectedLabels.join(" and ")}`
                  : "Skipped optional goals"
              }
            />
          </div>

          <PrimaryAction className="mt-6" onClick={onRestart}>
            Run again
          </PrimaryAction>
        </div>
      </div>
    </div>
  );
}

function StageHeading({
  title,
  description,
  align = "left",
  logo = false,
}: {
  title: string;
  description: string;
  align?: "left" | "center";
  logo?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {logo ? <OnboardingLogo className="mx-auto mb-5 size-10" /> : null}
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function OnboardingLogo({ className }: { className?: string }) {
  return <StepperLogo className={cn("size-10 text-foreground", className)} />;
}

function ProviderButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="relative mt-7 h-9 w-full justify-center rounded-md border-border bg-background text-sm font-medium text-foreground shadow-none hover:bg-muted/60"
      onClick={onClick}
    >
      <SiGoogle className="absolute left-4 size-4 text-foreground" aria-hidden="true" />
      Continue with Google
    </Button>
  );
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
        "h-9 w-full rounded-md bg-foreground text-sm font-semibold text-background shadow-none hover:bg-foreground/90 focus-visible:ring-ring",
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
        "flex min-h-20 w-full items-center gap-4 rounded-lg border border-border bg-background px-5 text-left transition-colors hover:bg-muted/60",
        active && "border-foreground bg-muted/30 ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      <Icon className="size-7 shrink-0 text-foreground" />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
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
        "flex min-h-36 flex-col items-center justify-center rounded-lg border border-border bg-background p-5 text-center transition-colors hover:bg-muted/60",
        active && "border-foreground bg-muted/30 ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      <Icon className="mb-4 size-8 text-foreground" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
      <span className="mt-2 max-w-40 text-xs leading-5 text-muted-foreground">
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
        "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60",
        active && "border-foreground text-foreground ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      {active ? <Check className="size-4" /> : <Icon className="size-4" />}
      {option.label}
    </button>
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
      <span className={cn(checked && "text-muted-foreground")}>
        {text}
      </span>
    </div>
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

function getIntentSummary(values: IntentOnboardingValues) {
  if (!values.intent) {
    return "Intent captured";
  }

  const label = getIntentLabel(values.intent).replace(/^For /, "");

  return `Intent set for ${label.toLowerCase()}`;
}

export { StepperIntentOnboardingExample };
