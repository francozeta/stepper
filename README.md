# Stepper

A lightweight Stepper component for React, Next.js, TypeScript, Tailwind CSS, and shadcn/ui-style projects.

The Stepper core is intentionally small and shadcn/ui-friendly. It uses Radix Slot only for `asChild` composition and does not require Radix Tabs, Motion, or multiple visual variants.

## Positioning

Most stepper libraries focus on workflow state. This component focuses on shadcn-style composition, UI states, and copy-paste ownership.

Stepper does not own your form state. It coordinates the UI around it. Keep validation, persistence, server actions, and routing in the app layer, then map those decisions onto `completed`, `disabled`, and `error`.

## Files

- `components/ui/stepper.tsx` is the public import surface for the reusable Stepper primitive.
- `components/ui/stepper/*` contains the maintainable source split by responsibility.
- `registry/default/ui/stepper.tsx` is the generated single-file copy-paste artifact.
- `packages/stepper` contains the npm package wrapper for `@francozeta/stepper`.
- `components/stepper-examples.tsx` contains the product-style demos used by the local preview.

## Registry Output

The source is maintained as small modules, while the shadcn-style distribution file is generated:

```bash
pnpm registry:build
```

Use `pnpm registry:check` to verify the generated file is in sync with `components/ui/stepper/*`. The normal `pnpm check` command runs this verification before lint, tests, and build.

## NPM Package

The npm package is built from the same generated source, but replaces the local `cn()` import with package-local `clsx` and `tailwind-merge` utilities:

```bash
pnpm package:build
pnpm package:pack
pnpm package:publish
```

The package name is `@francozeta/stepper`. The docs app remains private; only `packages/stepper` is meant to be published.

Direct npm consumers only need the package stylesheet:

```css
@import "@francozeta/stepper/styles.css";
```

No `@source`, `content`, or node_modules scanning is required. The generated CSS respects shadcn-style semantic tokens when they exist and ships package-local fallbacks for vanilla apps.

## Features

- Controlled state with `value` and `onValueChange`
- Uncontrolled state with `defaultValue`
- Horizontal and vertical orientation
- Step states: `inactive`, `active`, `completed`, `disabled`, and `error`
- Associated content per step
- Basic navigation with `StepperPrevious` and `StepperNext`
- Real buttons, `aria-current="step"` on the active step, and real `disabled`
- Tailwind tokens such as `border`, `muted-foreground`, `primary`, `destructive`, `background`, and `foreground`
- Primitive pieces for custom step markup: `StepperTrigger`, `StepperIndicator`, `StepperLabel`, `StepperDescription`, and `StepperSeparator`
- `asChild` on `StepperTrigger`, `StepperContent`, `StepperPrevious`, and `StepperNext` with `@radix-ui/react-slot`
- Public `useStepper()` hook for custom footers and form controls
- `forceMount` on `StepperContent` for mounted inactive content
- `data-position="previous|current|next"` on `StepperItem` for styling progress without implying completion
- Guard rails for invalid `value` / `defaultValue` and disabled steps
- Lightweight step registration so simple wrapper components can still be composed around `StepperItem`

## Works With

- `react-hook-form` and `zod` in examples, not in the primitive.
- Next.js routing through `StepperTrigger asChild` with `Link`.
- shadcn/ui `Field`, `Input`, `Select`, `Alert`, and `Button` in product flows.
- Server Actions or API mutations owned by the app layer.
- `@radix-ui/react-slot` only for `asChild` composition.

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
  StepperNext,
  StepperPrevious,
  StepperSeparator,
  StepperTrigger,
  useStepper,
} from "@/components/ui/stepper";

export function CheckoutStepper() {
  return (
    <Stepper defaultValue="cart" orientation="horizontal">
      <StepperList>
        <StepperItem value="cart" completed>
          Cart
        </StepperItem>
        <StepperItem value="shipping">Shipping</StepperItem>
        <StepperItem value="payment" disabled>
          Payment
        </StepperItem>
      </StepperList>

      <StepperContent value="cart">Review your cart.</StepperContent>
      <StepperContent value="shipping">Add a shipping address.</StepperContent>
      <StepperContent value="payment">Choose a payment method.</StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        <StepperNext />
      </div>
    </Stepper>
  );
}
```

## Controlled Example

```tsx
const [step, setStep] = React.useState("details");

<Stepper value={step} onValueChange={setStep}>
  <StepperList>
    <StepperItem value="details">Details</StepperItem>
    <StepperItem value="review">Review</StepperItem>
    <StepperItem value="confirm">Confirm</StepperItem>
  </StepperList>

  <StepperContent value="details">Collect details.</StepperContent>
  <StepperContent value="review">Review the request.</StepperContent>
  <StepperContent value="confirm">Confirm the flow.</StepperContent>
</Stepper>;
```

## Primitive Composition

```tsx
<StepperItem value="shipping">
  <StepperTrigger>
    <StepperIndicator />
    <span className="flex flex-col gap-1">
      <StepperLabel>Shipping</StepperLabel>
      <StepperDescription>Delivery address</StepperDescription>
    </span>
  </StepperTrigger>
  <StepperSeparator />
</StepperItem>
```

## Icon Composition

`StepperIndicator` accepts custom children, so icons can be composed in the demo or application layer without becoming a hard requirement of the Stepper core. The core file does not import `lucide-react`.

```tsx
import { Check } from "lucide-react";

<StepperItem value="shipping" completed>
  <StepperTrigger>
    <StepperIndicator>
      <Check />
    </StepperIndicator>
    <span className="flex flex-col gap-1">
      <StepperLabel>Shipping</StepperLabel>
      <StepperDescription>Delivery address</StepperDescription>
    </span>
  </StepperTrigger>
  <StepperSeparator />
</StepperItem>;
```

## API

### `Stepper`

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Controlled active step value. |
| `defaultValue` | `string` | Initial active step for uncontrolled usage. |
| `onValueChange` | `(value: string) => void` | Called when a step changes. |
| `orientation` | `"horizontal" \| "vertical"` | Layout direction. Defaults to `"horizontal"`. |

If `value` or `defaultValue` points to a missing or disabled step, the Stepper falls back to the first enabled step.

### `StepperList`

| Prop | Type | Description |
| --- | --- | --- |
| `aria-label` | `string` | Accessible name for the ordered list. Defaults to `"Progress steps"`. |

### `StepperItem`

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Unique step value. |
| `completed` | `boolean` | Marks a step as completed. |
| `disabled` | `boolean` | Disables navigation to the step. |
| `error` | `boolean` | Marks the step as errored. |

### `StepperContent`

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Step value this content belongs to. |
| `forceMount` | `boolean` | Keeps inactive content mounted with `hidden` and `data-state="inactive"`. |
| `asChild` | `boolean` | Renders the content props onto a child element with Radix Slot. |

### `StepperTrigger`

| Prop | Type | Description |
| --- | --- | --- |
| `asChild` | `boolean` | Renders trigger props onto a custom button or link with Radix Slot. |
| `disabled` | `boolean` | Disables the trigger in addition to the parent `StepperItem` disabled state. |

When `asChild` is used on a disabled trigger, the component applies `aria-disabled`, `data-disabled`, and `tabIndex={-1}` instead of passing a native `disabled` attribute to links.

### `StepperPrevious` / `StepperNext`

| Prop | Type | Description |
| --- | --- | --- |
| `asChild` | `boolean` | Renders navigation props onto a custom button primitive with Radix Slot. |
| `disabled` | `boolean` | Disables navigation in addition to `canGoPrevious` / `canGoNext`. |

### `useStepper`

```tsx
function WizardFooter() {
  const { canGoPrevious, canGoNext, goPrevious, goNext } = useStepper();

  return (
    <div className="flex justify-between">
      <button type="button" disabled={!canGoPrevious} onClick={goPrevious}>
        Back
      </button>
      <button type="button" disabled={!canGoNext} onClick={goNext}>
        Continue
      </button>
    </div>
  );
}
```

### Primitive step parts

| Component | Element | Description |
| --- | --- | --- |
| `StepperTrigger` | `button` | Real button that selects the step. |
| `StepperIndicator` | `span` | Visual step number or error marker. |
| `StepperLabel` | `span` | Label text with responsive truncation. |
| `StepperDescription` | `span` | Optional secondary text inside a custom trigger. |
| `StepperSeparator` | `span` | Visual connector between steps. |

## Notes

This V1 keeps `collectSteps(children)` as a first-render fallback for direct `StepperItem` usage, then uses a small internal registration step after mount. That keeps the component copy-paste friendly while allowing simple wrapper components around `StepperItem`.

The next V2 step would be richer form and mobile patterns, linear navigation experiments, and optional animated examples where users compose their own `motion.div` instead of making Motion part of the core Stepper.
