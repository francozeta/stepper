# @francozeta/stepper

A shadcn/ui-native Stepper primitive for real product flows: onboarding, checkout, setup wizards, long forms, and guided processes.

This package exports the React primitive and also includes the shadcn-style registry artifact.

## Install

```bash
npm install @francozeta/stepper
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

For shadcn/ui projects, copy-paste ownership is still the recommended path when you want to fully own the component source.

## Styling note

The component uses Tailwind semantic tokens such as `border`, `background`, `foreground`, `primary`, `destructive`, and `muted-foreground`. If you import the npm package directly, make sure your Tailwind setup scans or otherwise includes the package classes. The registry file avoids that issue because the component lives in your app source.

## Docs

https://stepper-hazel-sigma.vercel.app
