# @francozeta/stepper Changelog

## 0.1.4

- Default completed indicators now render a completion mark instead of repeating the step number.
- Step items expose `data-position="previous|current|next"` for custom styling and variants.
- Package docs include clearer npm install guidance.

## 0.1.3

- Replaced the `radix-ui` umbrella dependency with `@radix-ui/react-slot`.
- Updated the bundled shadcn-style registry item to depend on `@radix-ui/react-slot`.
- Added explicit npm usage docs for Tailwind v4, Tailwind v3, and required shadcn semantic tokens.

## 0.1.2

- Added package-level `devDependencies` metadata so npm shows the build and test stack used by the package.

## 0.1.1

- Initial npm package build for the Stepper primitive.
- Exports compiled ESM, CommonJS, and TypeScript declarations.
- Includes the generated shadcn-style registry artifact.
- Keeps React as a peer dependency and limits runtime dependencies to `clsx`, `tailwind-merge`, and Radix Slot.
