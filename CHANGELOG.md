# Changelog

## 0.1.0

Initial V1 release candidate for the Stepper component.

### Added

- Controlled and uncontrolled Stepper state.
- Horizontal and vertical layouts.
- Step states for active, completed, disabled, and error.
- Associated content panels with optional `forceMount`.
- Navigation helpers with `StepperPrevious` and `StepperNext`.
- Primitive composition pieces: `StepperTrigger`, `StepperIndicator`, `StepperLabel`, `StepperDescription`, and `StepperSeparator`.
- Lightweight step registration so wrappers around `StepperItem` still work.
- Product-style local demos for checkout, onboarding, blocked states, and controlled flows.

### Notes

- The core component intentionally has no Radix, Motion, or `asChild` requirement.
- The demo layer uses lucide icons, but `components/ui/stepper.tsx` does not import icon dependencies.
- A future V2 can add Radix Slot `asChild`, richer trigger/indicator examples, and optional animation examples by composition.
