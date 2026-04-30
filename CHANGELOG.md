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
- `asChild` support on `StepperTrigger`, `StepperContent`, `StepperPrevious`, and `StepperNext` through Radix Slot.
- Public `useStepper()` hook for custom controls outside the visual step list.
- Accessible list labelling and screen-reader step positions.
- Lightweight step registration so wrappers around `StepperItem` still work.
- Modular source files with a generated single-file registry artifact for shadcn-style distribution.
- Product-style local demos using shadcn/ui fields, alerts, checkout, onboarding, and controlled flows.

### Notes

- The core component intentionally avoids Radix Tabs and Motion. Radix Slot is used only for `asChild`.
- The demo layer uses lucide icons, but `components/ui/stepper.tsx` does not import icon dependencies.
- A future V2 can add richer form/mobile patterns, linear navigation experiments, and optional animation examples by composition.
