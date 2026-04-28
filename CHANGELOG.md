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
- `asChild` support on `StepperTrigger` and `StepperContent` through Radix Slot.
- Lightweight step registration so wrappers around `StepperItem` still work.
- Product-style local demos using shadcn/ui fields, alerts, checkout, onboarding, and controlled flows.

### Notes

- The core component intentionally avoids Radix Tabs and Motion. Radix Slot is used only for `asChild`.
- The demo layer uses lucide icons, but `components/ui/stepper.tsx` does not import icon dependencies.
- A future V2 can add richer form/mobile patterns, linear navigation experiments, and optional animation examples by composition.
