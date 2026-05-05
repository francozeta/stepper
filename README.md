# Stepper

A lightweight shadcn/ui-style Stepper primitive for real multi-step flows.

Stepper is distributed through the shadcn registry. The CLI copies the component
source into your app, so you own the code and can customize it directly.

## Install

```bash
pnpm dlx shadcn@latest registry add @stepper
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
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
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

## Contributing

Contributions are welcome. Read `CONTRIBUTING.md` before opening a pull request.

## Releases

Release Please opens release PRs from Conventional Commits on `main`.
Merging that PR updates `package.json`, `CHANGELOG.md`, the Git tag, and the
GitHub Release for the registry component.

This repo does not publish to npm. The version tracks the public shadcn registry
component only.

## License

MIT
