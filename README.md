# Stepper

A lightweight Stepper component for React, Next.js, TypeScript, and Tailwind CSS.

The current implementation is intentionally small and shadcn/ui-friendly. It does not require Radix, `asChild`, or multiple visual variants. Motion is used only for subtle `StepperContent` transitions.

## Features

- Controlled state with `value` and `onValueChange`
- Uncontrolled state with `defaultValue`
- Horizontal and vertical orientation
- Step states: `inactive`, `active`, `completed`, `disabled`, and `error`
- Associated content per step
- Basic navigation with `StepperPrevious` and `StepperNext`
- Real buttons, `aria-current="step"` on the active step, and real `disabled`
- Tailwind tokens such as `border`, `muted-foreground`, `primary`, `destructive`, `background`, and `foreground`
- Subtle content transitions with Motion
- `forceMount` on `StepperContent` for mounted inactive content

## Usage

```tsx
import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
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

## API

### `Stepper`

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Controlled active step value. |
| `defaultValue` | `string` | Initial active step for uncontrolled usage. |
| `onValueChange` | `(value: string) => void` | Called when a step changes. |
| `orientation` | `"horizontal" \| "vertical"` | Layout direction. Defaults to `"horizontal"`. |

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

## Notes

This V1 uses `collectSteps(children)` to infer step order from direct `StepperItem` usage. That keeps the component light and copy-paste friendly, but it is a controlled tradeoff: custom wrapper components around `StepperItem` may not be detected.

For a more flexible V2, split `StepperItem` into primitives such as `StepperTrigger`, `StepperIndicator`, `StepperLabel`, `StepperDescription`, and `StepperSeparator`, then consider `asChild` with Radix Slot. Richer animation control or Presence should come after the component is more composable.
