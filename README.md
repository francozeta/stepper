# Stepper

A lightweight shadcn/ui-style Stepper primitive for real multi-step flows.

Stepper is distributed through the shadcn registry. The CLI copies the component
source into your app, so you own the code and can customize it directly.

## Install

Start in a TypeScript React project with shadcn/ui and Tailwind CSS v4.
Use Node.js 22 or newer for the `cn` dependency. Keep your existing shadcn preset; Base UI is an internal composition dependency, not a requirement to use Base Nova. Base Nova and Radix Nova have passed local CLI installation and markup checks; other presets are unverified.

```bash
pnpm dlx shadcn@latest add @stepper/stepper
```

If the namespace cannot be resolved, use the direct registry URL:

```bash
npx shadcn@latest add https://francozeta-stepper.vercel.app/r/stepper.json
```

The CLI uses your `components.json` UI alias. The default source path is:

```txt
components/ui/stepper.tsx
```

Install the styled demo block with:

```bash
pnpm dlx shadcn@latest add @stepper/stepper-demo
```

## Your first flow

```tsx
"use client";

import { useState } from "react";
import {
  Stepper, StepperContent, StepperItem, StepperList,
  StepperNext, StepperPrevious, type StepperStepsValue,
} from "@/components/ui/stepper";

const steps = [{ value: "details" }, { value: "review" }] as const;
type Step = StepperStepsValue<typeof steps>;

export function SetupStepper() {
  const [step, setStep] = useState<Step>("details");
  return (
    <Stepper steps={steps} value={step} onValueChange={setStep}>
      <StepperList>
        <StepperItem value="details">Details</StepperItem>
        <StepperItem value="review">Review</StepperItem>
      </StepperList>
      <StepperContent value="details">Enter your details.</StepperContent>
      <StepperContent value="review">Review your details.</StepperContent>
      <div className="flex justify-between">
        <StepperPrevious />
        <StepperNext />
      </div>
    </Stepper>
  );
}
```

Render `SetupStepper` in your page. The app owns form validation and final
submission; this example demonstrates navigation only. The registry copies
one Stepper file and installs or reuses Base UI and `cn`.

[Installation and usage](https://francozeta-stepper.vercel.app/docs/installation) · [API](https://francozeta-stepper.vercel.app/docs/api)

## Philosophy

Stepper does not own your form state, routing, validation, persistence, or
server actions.

Your app owns the workflow. Stepper reflects that workflow in the UI.

Stepper uses Base UI `useRender` for composition. Existing `asChild` usage is
supported for compatibility; prefer `render` for new code.

## Development

The registry item is generated from `components/ui/stepper.tsx`.

```bash
pnpm registry:build
```

Use the check command before shipping changes:

```bash
pnpm check
```

That verifies the registry output, lint, typecheck, tests, and production build.

## Contributing

Contributions are welcome. Read `CONTRIBUTING.md` before opening a pull request.

## Releases

Release Please opens release PRs from Conventional Commits on `main`.
Merging that PR updates `package.json`, `CHANGELOG.md`, the Git tag, and the
GitHub Release for the registry component.

This repo does not publish to npm. The version tracks the public beta shadcn
registry component only.

## License

MIT
