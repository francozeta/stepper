# Changelog

## 0.1.3

NPM package DX polish.

### Changed

- Replaced the Stepper package runtime dependency on the Radix umbrella package with `@radix-ui/react-slot`.
- Updated the generated registry item to install only `@radix-ui/react-slot`.
- Documented direct npm usage for Tailwind v4, Tailwind v3, and required shadcn semantic tokens.

## 0.1.2

Package metadata polish.

### Changed

- Added package-level `devDependencies` metadata to `@francozeta/stepper` so npm shows the build and test stack used by the package.

## 0.1.1

Launch-ready docs and registry polish for the first public pass.

### Changed

- Added `typecheck` to the main `pnpm check` pipeline.
- Promoted the Form Wizard guide to a live Preview / Code example.
- Promoted Patterns to live Preview / Code examples for route-based and mobile drawer composition.
- Added an accessible description to the mobile Sheet pattern.
- Kept the registry artifact generated from modular source and verified by `pnpm registry:check`.
- Added a publishable npm package wrapper at `packages/stepper` for `@francozeta/stepper`.

## 0.1.0

Initial V1 release candidate for the Stepper component.

### Added

- Controlled and uncontrolled Stepper state.
- Horizontal and vertical layouts.
- Step states for active, completed, disabled, and error.
- Associated content panels with optional `forceMount`.
- Navigation helpers with `StepperPrevious` and `StepperNext`.
- Primitive composition pieces: `StepperTrigger`, `StepperIndicator`, `StepperLabel`, `StepperDescription`, and `StepperSeparator`.
- `asChild` support on `StepperTrigger`, `StepperContent`, `StepperPrevious`, and `StepperNext` through Radix Slot.
- Public `useStepper()` hook for custom controls outside the visual step list.
- Accessible list labelling and screen-reader step positions.
- Lightweight step registration so wrappers around `StepperItem` still work.
- Modular source files with a generated single-file registry artifact for shadcn-style distribution.
- Product-style local demos using shadcn/ui fields, alerts, checkout, onboarding, and controlled flows.
- Strategy docs for react-hook-form integration, route-based steppers, and mobile drawer composition.

### Notes

- The core component intentionally avoids Radix Tabs and Motion. Radix Slot is used only for `asChild`.
- The demo layer uses lucide icons, but `components/ui/stepper.tsx` does not import icon dependencies.
- A future V2 can add richer form/mobile patterns, linear navigation experiments, and optional animation examples by composition.
