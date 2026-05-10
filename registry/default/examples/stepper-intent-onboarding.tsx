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

      <div className="flex min-h-[640px] flex-col">
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
          <SplitStage>
            <InterestsPanel
              selectedInterests={values.interests}
              onToggleInterest={toggleInterest}
              onContinue={() => void continueFromStep()}
              onSkip={skipInterests}
            />
            <FlowBlueprint selectedInterests={values.interests} />
          </SplitStage>
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
    <div className="flex min-h-[640px] flex-1 items-start justify-center px-6 pb-12 pt-20 sm:pt-24">
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
  onGoogle,
}: {
  email: string;
  error?: string;
  registerEmail: UseFormRegisterReturn<"email">;
  onContinue: () => void;
  onGoogle: () => void;
}) {
  return (
    <div className="w-full max-w-[400px]">
      <StageHeading
        title="Create your account"
        description="Start with a focused onboarding flow."
        align="center"
        logo
      />

      <ProviderButton onClick={onGoogle} />

      <div className="my-6 flex items-center gap-3 text-xs font-medium text-muted-foreground">
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

      <PrimaryAction className="mt-7" onClick={onContinue}>
        Continue
      </PrimaryAction>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
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
    <div className="w-full max-w-[400px]">
      <StageHeading
        title="Check your inbox"
        description="Use the code sent to your email."
        align="center"
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
    <div className="w-full max-w-[400px]">
      <StageHeading
        title="Create a profile"
        description="This is how you'll appear."
        align="center"
      />

      <div className="mt-12 flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <div className="grid size-16 place-items-center rounded-full border border-border bg-muted/50 text-lg font-semibold text-foreground">
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
        title="What are you setting up?"
        description="This helps customize your experience"
        align="center"
      />

      <div className="mt-12 grid gap-3">
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

      <div className="mt-12 grid gap-3 sm:grid-cols-2">
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
        <h2 className="text-2xl font-semibold text-foreground sm:text-[1.7rem] sm:leading-8">
          What&apos;s on your mind?
        </h2>
        <p className="mt-1.5 text-lg font-medium leading-7 text-muted-foreground sm:text-xl">
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

      <PrimaryAction className="mt-16 max-w-[520px]" onClick={onContinue}>
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
    "Preparing a completion checklist",
  ];

  return (
    <div className="w-full max-w-[500px] text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-border bg-muted/40 shadow-sm">
        <Sparkles className="size-7 text-foreground" />
      </div>
      <h2 className="mt-7 text-2xl font-semibold text-foreground sm:text-[1.7rem] sm:leading-8">
        Preparing your setup
      </h2>
      <p className="mt-3 text-sm font-medium text-muted-foreground">
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

function SignedInPanel({
  values,
  onRestart,
}: {
  values: IntentOnboardingValues;
  onRestart: () => void;
}) {
  return (
    <div className="flex min-h-[640px] flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[430px] text-center">
        <OnboardingLogo className="mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-foreground sm:text-[1.7rem]">
          You&apos;re signed in
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {values.email
            ? `${values.email} completed the onboarding loop.`
            : "The onboarding loop has completed."}
        </p>

        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4 text-left">
          <ChecklistRow checked text="Account created" />
          <ChecklistRow checked text="Intent captured" />
          <ChecklistRow checked text="Flow state completed" />
        </div>

        <PrimaryAction className="mt-8" onClick={onRestart}>
          Run again
        </PrimaryAction>
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
      {logo ? <OnboardingLogo className="mx-auto mb-6" /> : null}
      <h2 className="text-2xl font-semibold text-foreground sm:text-[1.7rem] sm:leading-8">
        {title}
      </h2>
      <p className="mt-1.5 text-lg font-medium leading-7 text-muted-foreground sm:text-xl">
        {description}
      </p>
    </div>
  );
}

function OnboardingLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-12 place-items-center rounded-xl border border-border bg-foreground text-background",
        className
      )}
    >
      <svg
        viewBox="0 0 789.79 1058.83"
        fill="currentColor"
        className="h-7 w-5"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M361.13,1058.28c28.61-24.08,55.58-46.86,82.62-69.55,41.82-35.09,83.8-69.99,125.49-105.23,39.2-33.13,57.7-75.81,57.69-126.9-.05-177.51-.02-355.01-.02-532.52v-9.26c10,3.28,18.99,5.96,27.69,9.36,1.36.53,1.99,4.36,2.02,6.68.17,14.17.25,28.35-.05,42.51-.11,5.26,1.68,7.95,6.82,9.47,15.55,4.58,30.97,9.59,47.4,14.73.21-2.91.48-5.06.49-7.22.1-14.17.02-28.35.23-42.52.15-10.07,3.69-12.79,13.08-9.76,17.45,5.63,34.83,11.45,52.15,17.48,9.32,3.24,12.66,8.43,12.67,18.46.03,35.78-.07,71.56.05,107.34.03,7.56-2.6,13.42-8.55,18.1-9.31,7.32-18.32,15.04-27.71,22.25-3.47,2.67-4.92,5.42-4.91,9.88.11,138.01.03,276.02.1,414.03.01,32.23-2.08,64.19-14.18,94.47-24.52,61.33-67.45,101.93-133.21,115.85-9.24,1.96-18.91,2.61-28.38,2.64-67.61.24-135.22.17-202.83.18-2.22,0-4.44-.24-8.67-.49ZM707.67,578.13c0-28.19.75-55.54-.53-82.79-.32-6.88-5.92-14.7-11.24-19.89-10.81-10.58-24.41-6.66-29.84,7.52-1.06,2.78-1.94,5.84-1.96,8.77-.15,24.56-.09,49.13-.09,74.2,14.53,4.06,28.94,8.09,43.64,12.2Z" />
        <path d="M550.29,611.15h-140.74c-.15-3.18-.37-5.67-.37-8.15-.02-58.79.02-117.58-.07-176.37,0-4.36.43-7.09,5.61-8.45,58.86-15.42,117.64-31.12,176.45-46.74.42-.11.9-.01,2.63-.01,0,2.81,0,5.68,0,8.54-.03,125.94.18,251.88-.23,377.83-.13,40.79-16.04,74.87-47.7,101.19-78.26,65.05-156.45,130.16-234.85,195.04-3.21,2.66-8.17,4.4-12.36,4.49-21.32.45-42.66.21-66.02.21,3.09-2.75,4.81-4.38,6.64-5.88,71.94-58.84,143.89-117.65,215.82-176.5,19.42-15.89,38.64-32.02,58.12-47.83,25.37-20.58,37.33-47.15,37.14-79.7-.26-43.22-.07-86.44-.08-129.66,0-2.29,0-4.57,0-8Z" />
        <path d="M560.11,210.07c0-7.96,0-15.13,0-22.31.01-55.3.02-110.61.03-165.91,0-13.02,7.86-22.02,19.1-21.85,11.18.17,18.62,8.67,18.62,21.58-.02,58.79,3.25,117.83-1.19,176.29-3.69,48.59-.74,96.93-2.82,145.33-.24,5.6-3.85,5.64-7.21,6.51-38.68,10.01-77.36,19.98-116.08,29.85-26.11,6.66-52.25,13.21-78.42,19.65-13.71,3.38-24.86-5.34-24.87-19.28-.03-34.86.01-69.71.07-104.57.02-12.2,5.31-18.61,17.17-21.91,16.55-4.6,33.02-9.5,49.53-14.27,12.34-3.56,18.24.81,18.31,13.64.07,11.85-.05,23.7.09,35.55.09,7.1,1.61,8.22,8.64,6.39,14.15-3.7,28.21-7.77,42.4-11.3,5.37-1.34,6.93-4.22,6.84-9.43-.26-14.4.02-28.81-.19-43.22-.1-6.94,2.65-10.63,9.69-11.98,13.22-2.53,26.31-5.68,40.3-8.76Z" />
        <path d="M361.32,924.39c-47.66,5.68-95.31,11.36-143.75,17.13-.12,2.35-.34,4.79-.35,7.24-.04,23.47.13,46.94-.25,70.41-.05,3.11-2.01,7.08-4.39,9.12-10.77,9.2-21.85,18.06-33.17,26.57-2.88,2.16-7.06,3.65-10.65,3.67-49.49.29-98.99.3-148.49.31-13.39,0-20.24-6.84-20.25-20.15-.04-31.6-.03-63.21.03-94.81.03-13.68,7.96-21.79,21.61-21.78,95.97.05,191.94.2,287.91.31,17.15.02,34.3,0,51.45,0,.1.66.2,1.33.3,1.99Z" />
        <path d="M179.64,881.76c0-27.43-.27-54.36.13-81.28.16-11.16,9.64-18.62,21.94-18.62,52.72.02,105.44.02,158.16.07,44.36.04,88.72.15,133.07.23,3.93,0,7.87,0,11.94,1.58-41.18,4.92-82.37,9.83-124.17,14.82v83.19h-201.07Z" />
        <path d="M541.46,651.31v11.92h-63.14v83.22h-180.91c-.16-2.11-.45-4.12-.45-6.13-.03-21.82-.06-43.65.02-65.47.05-15.26,8.51-23.64,23.77-23.63,70.81.02,141.62.06,212.43.1,2.51,0,5.02,0,8.29,0Z" />
        <path d="M789.79,68.43c-21.66,23.89-42.73,46.06-74.45,52.96-7.27,1.58-15.63,2.2-22.63.21-25.49-7.24-50.59-9.24-76.16,1.67-.36-2.34-.77-3.82-.79-5.3-.28-22.74-.36-45.48-.88-68.22-.11-4.86,1.6-6.76,6.03-8.28,34.87-11.94,67.86-10,98.71,11.86,19.17,13.58,40.53,19.02,63.96,15.43,1.5-.23,3.04-.17,6.2-.33Z" />
        <path d="M230.89,504.03c27.49.25,49.21,22.49,48.96,50.14-.27,28.73-22.72,51.45-50.58,51.18-27.41-.27-49.86-23.56-49.59-51.46.26-27.63,23.35-50.1,51.22-49.85Z" />
      </svg>
    </span>
  );
}

function ProviderButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="relative mt-8 h-10 w-full justify-center rounded-md border-border bg-background text-sm font-medium text-foreground shadow-none hover:bg-muted/60"
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
        "h-10 w-full rounded-md bg-foreground text-sm font-semibold text-background shadow-none hover:bg-foreground/90 focus-visible:ring-ring",
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
        "flex min-h-24 w-full items-center gap-5 rounded-xl border border-border bg-background px-6 text-left transition-colors hover:bg-muted/60",
        active && "border-foreground bg-muted/30 ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      <Icon className="size-8 shrink-0 text-foreground" />
      <span className="min-w-0">
        <span className="block text-base font-semibold text-foreground">
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
        "flex min-h-44 flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center transition-colors hover:bg-muted/60",
        active && "border-foreground bg-muted/30 ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      <Icon className="mb-5 size-10 text-foreground" />
      <span className="text-base font-semibold text-foreground">{title}</span>
      <span className="mt-2 max-w-44 text-sm leading-5 text-muted-foreground">
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
        "inline-flex h-10 items-center gap-2.5 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/60",
        active && "border-foreground text-foreground ring-2 ring-foreground/10"
      )}
      onClick={onClick}
    >
      {active ? <Check className="size-5" /> : <Icon className="size-5" />}
      {option.label}
    </button>
  );
}

function FlowBlueprint({
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
      : ["Account", "Intent", "Signed in"];

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
              {["Account", "Profile", "Intent"].map((item, index) => (
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

export { StepperIntentOnboardingExample };
