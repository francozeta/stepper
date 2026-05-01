# Changelog

## [0.4.1](https://github.com/francozeta/stepper/compare/v0.4.0...v0.4.1) (2026-05-01)

## [0.4.0](https://github.com/francozeta/stepper/compare/v0.3.2...v0.4.0) (2026-05-01)

### Features

* **stepper:** add Stepper component and demo ([11b96a6](https://github.com/francozeta/stepper/commit/11b96a657a5f858f702aeeb1016971f376ac89f9))

## [0.3.2](https://github.com/francozeta/stepper/compare/v0.3.1...v0.3.2) (2026-05-01)

### Bug Fixes

* publish flat shadcn registry urls ([d925718](https://github.com/francozeta/stepper/commit/d925718d779e8d2011db6fd300caa7f0a1a2e598))

## [0.3.1](https://github.com/francozeta/stepper/compare/v0.3.0...v0.3.1) (2026-05-01)

## [0.3.0](https://github.com/francozeta/stepper/compare/v0.2.1...v0.3.0) (2026-05-01)

### Features

* add MDX docs and shadcn registry infrastructure ([717fb76](https://github.com/francozeta/stepper/commit/717fb768adbe7a2b8585389d56ca34b1d5ea5c36))

## [0.2.1](https://github.com/francozeta/stepper/compare/v0.2.0...v0.2.1) (2026-05-01)

### Bug Fixes

* update package version to 0.2.0 and add sync-release-version script with tests ([a857be9](https://github.com/francozeta/stepper/commit/a857be9c271fbd1384740e2efc97836bbd37738d))

## [0.2.0](https://github.com/francozeta/stepper/compare/v0.1.6...v0.2.0) (2026-05-01)

### Features

* enhance documentation and examples with new install command and recipe patterns ([42975dd](https://github.com/francozeta/stepper/commit/42975dd4e05f7567ad4015c408d49112e11696a4))

## [0.1.6](https://github.com/francozeta/stepper/compare/v0.1.5...v0.1.6) (2026-05-01)

### Bug Fixes

* sync sidebar release version ([51f5e95](https://github.com/francozeta/stepper/commit/51f5e958108c2a418f5074e58108baaae004b34e))

## 0.1.5

Package CSS export for direct npm usage.

### Changed

- Added a Tailwind CSS build pipeline for the npm package.
- Generated `packages/stepper/dist/styles.css` from the Stepper package source only.
- Exported `@francozeta/stepper/styles.css` through package exports.
- Marked CSS as a package side effect so bundlers keep the stylesheet import.
- Updated docs to use `@import "@francozeta/stepper/styles.css";` instead of Tailwind `@source`.

## 0.1.4

UI clarity and docs simplification.

### Changed

- Default completed indicators now render a completion mark instead of repeating the step number.
- Step items expose `data-position="previous|current|next"` for clearer styling and future variants.
- Simplified the docs home page around preview, install, usage, and positioning.
- Added explicit npm install commands to the docs site.

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
