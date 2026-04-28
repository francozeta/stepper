# Stepper

A lightweight Stepper component for React, Next.js, TypeScript, Tailwind CSS, and shadcn/ui-style projects.

The Stepper core is intentionally small and shadcn/ui-friendly. It does not require Radix, Motion, `asChild`, or multiple visual variants.

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
- `forceMount` on `StepperContent` for mounted inactive content
- Guard rails for invalid `value` / `defaultValue` and disabled steps
- Lightweight step registration so simple wrapper components can still be composed around `StepperItem`

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

`StepperIndicator` accepts custom children, so icons can be composed in the demo or application layer without becoming a hard requirement of the Stepper core.

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

The next V2 step would be adding `asChild` with Radix Slot, richer primitive parts for wrapper-heavy composition, and optional animated examples where users compose their own `motion.div` instead of making Motion part of the core Stepper.
