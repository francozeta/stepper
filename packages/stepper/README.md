# @francozeta/stepper

A shadcn/ui-native Stepper primitive for real product flows: onboarding, checkout, setup wizards, long forms, and guided processes.

The package ships compiled React components plus the generated shadcn-style registry artifact. The primitive is intentionally UI-focused: it coordinates step state and visual states, while your app owns form data, validation, routing, and persistence.

## Install

```bash
npm install @francozeta/stepper
```

```bash
pnpm add @francozeta/stepper
```

```tsx
import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrevious,
} from "@francozeta/stepper";
```

Import the package stylesheet once in your global CSS:

```css
@import "@francozeta/stepper/styles.css";
```

## Direct npm usage

When importing from npm, the package stylesheet includes the Stepper utilities generated at build time. You do not need `@source`, Tailwind `content`, or node_modules scanning.

Use this path when you want a normal npm dependency:

```tsx
import { Stepper } from "@francozeta/stepper";
```

Use the registry/copy-paste path when you want full ownership of the source in your app.

## Styles

Add the package stylesheet to your app stylesheet:

```css
@import "@francozeta/stepper/styles.css";
```

The stylesheet contains only the Stepper classes and theme variables needed by the package.

## Theme tokens

shadcn/ui projects already define these tokens. Vanilla apps can rely on the package fallbacks, or override the semantic tokens globally:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
}
```

## Usage

```tsx
export function CheckoutStepper() {
  return (
    <Stepper defaultValue="account">
      <StepperList>
        <StepperItem value="account" completed>
          Account
        </StepperItem>
        <StepperItem value="profile">Profile</StepperItem>
        <StepperItem value="payment" disabled>
          Payment
        </StepperItem>
      </StepperList>

      <StepperContent value="account">Account content</StepperContent>
      <StepperContent value="profile">Profile content</StepperContent>
      <StepperContent value="payment">Payment content</StepperContent>

      <div className="mt-6 flex justify-between">
        <StepperPrevious />
        <StepperNext />
      </div>
    </Stepper>
  );
}
```

## shadcn-style registry

The package includes the generated single-file registry artifact at:

```txt
@francozeta/stepper/registry
```

For shadcn/ui projects, copy-paste ownership is still the recommended path when you want to fully own the component source. The registry artifact uses `cn()` from your app and lists `@radix-ui/react-slot` as its only Radix dependency.

## Dependencies

Runtime dependencies are intentionally small:

- `@radix-ui/react-slot` for `asChild`
- `clsx` and `tailwind-merge` for the package-local `cn()` helper

React is a peer dependency. The primitive does not depend on Radix Tabs, Motion, `react-hook-form`, `zod`, or icon libraries.

## Styling hooks

The primitive exposes `data-slot`, `data-state`, and `data-position` attributes for customization. `data-state` describes the item state (`inactive`, `active`, `completed`, `disabled`, `error`). `data-position` describes where the item sits relative to the active step (`previous`, `current`, `next`).

## Docs

https://francozeta-stepper.vercel.app
