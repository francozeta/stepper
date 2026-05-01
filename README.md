# Stepper

A lightweight shadcn/ui-style Stepper primitive for real multi-step flows.

Stepper is distributed through the shadcn registry. The CLI copies the component
source into your app, so you own the code and can customize it directly.

## Install

```bash
pnpm dlx shadcn@latest add https://francozeta-stepper.vercel.app/stepper.json
```

The registry installs the source at:

```txt
components/ui/stepper.tsx
```

## Usage

```tsx
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
```

## Philosophy

Stepper does not own your form state, routing, validation, persistence, or
server actions.

Your app owns the workflow. Stepper reflects that workflow in the UI.

## Development

The registry item is generated from the modular source in
`components/ui/stepper/*`.

```bash
pnpm registry:build
```

Use the check command before shipping changes:

```bash
pnpm check
```

That verifies the registry output, lint, typecheck, tests, and production build.
